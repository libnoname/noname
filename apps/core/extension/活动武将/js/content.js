import { lib, game, ui, get, ai, _status } from '../../../noname.js';

export async function content(config, pack) {

	//官方武将包保护机制
	//添加
	lib.config.all.sgscharacters.push('diy');
	//检测
	var openCharacterPack = lib.config.all.sgscharacters.filter(i => lib.config.hiddenCharacterPack.includes(i));
	if (openCharacterPack.length) {
		lib.config.hiddenCharacterPack.removeArray(openCharacterPack);
		game.saveConfig('hiddenCharacterPack', lib.config.hiddenCharacterPack);
		alert('检测到官方武将包' + get.translation(openCharacterPack) + '被隐藏，可能会使得部分技能函数无法读取从而导致问题，即将为您解除这些武将包的隐藏并重启游戏');
		setTimeout(() => game.reload(), 2000);
	}

	//precBoss
	//Boss模式编辑
	if (get.mode() == 'boss') {
		//等阶设置
		lib.config.extension_活动武将_Boss_TZ_level ??= '1';
		lib.config.extension_活动武将_Boss_YZ_level ??= '1';
		lib.skill._boss_tz_level = {
			charlotte: true,
			ruleSkill: true,
			trigger: { global: 'gameStart' },
			firstDo: true,
			priority: Infinity,
			silent: true,
			content() {
				var num1 = lib.config.extension_活动武将_Boss_TZ_level;
				var num2 = lib.config.extension_活动武将_Boss_YZ_level;
				switch (player.identity) {
					case 'cai':
						player.node.framebg.dataset.decoration = 'none';
						switch (num1) {
							case '2':
								player.directgain(get.cards(1));
								break;
							case '3':
								player.directgain(get.cards(1));
								player.addSkill('boss_tz_sha');
								player.maxHp = player.maxHp + 1;
								player.hp = player.hp + 1;
								player.update();
								player.node.framebg.dataset.decoration = 'bronze';
								break;
							case '4':
								player.directgain(get.cards(2));
								player.addSkill('boss_tz_sha');
								player.addSkill('boss_tz_draw');
								player.maxHp = player.maxHp + 1;
								player.hp = player.hp + 1;
								player.update();
								player.node.framebg.dataset.decoration = 'silver';
								break;
							case '5':
								player.directgain(get.cards(2));
								player.addSkill('boss_tz_sha');
								player.addSkill('boss_tz_draw');
								player.addSkill('boss_tz_chongsheng');
								player.maxHp = player.maxHp + 2;
								player.hp = player.hp + 2;
								player.update();
								player.node.framebg.dataset.decoration = 'gold';
								break;
						}
						player.node.framebg.dataset.auto = player.node.framebg.dataset.decoration;
						break;
					case 'zhu': case 'zhong':
						player.node.framebg.dataset.decoration = 'none';
						switch (num2) {
							case '2':
								player.directgain(get.cards(1));
								player.addSkill('boss_yz_equip');
								player.maxHp = player.maxHp + 1;
								player.hp = player.hp + 1;
								player.update();
								break;
							case '3':
								player.directgain(get.cards(1));
								player.addSkill('boss_yz_sha');
								player.maxHp = player.maxHp + 2;
								player.hp = player.hp + 2;
								player.update();
								player.node.framebg.dataset.decoration = 'bronze';
								break;
							case '4':
								player.directgain(get.cards(2));
								player.addSkill('boss_yz_sha');
								player.addSkill('boss_yz_draw');
								player.maxHp = player.maxHp + 3;
								player.hp = player.hp + 3;
								player.update();
								player.node.framebg.dataset.decoration = 'silver';
								break;
							case '5':
								player.directgain(get.cards(2));
								player.addSkill('boss_yz_sha');
								if (game.boss_shenwuzaishi) player.addSkill('boss_yz_kunshou');
								player.maxHp = player.maxHp + 5;
								player.hp = player.hp + 5;
								player.update();
								player.node.framebg.dataset.decoration = 'gold';
								break;
						}
						player.node.framebg.dataset.auto = player.node.framebg.dataset.decoration;
						break;
				}
			},
		};
	}
	//precC
	//对局机制优化
	//整肃
	if (lib.config.extension_活动武将_HD_zhengsu) {
		for (const name of ['leijin', 'bianzhen', 'mingzhi']) {
			if (!lib.card[`zhengsi_${name}`]) continue;
			lib.card[`zhengsi_${name}`].fullimage = true;
			lib.card[`zhengsi_${name}`].image = `ext:活动武将/image/card/zhengsi_${name}.png`;
		}
		Object.assign(lib.skill.zhengsu_leijin ? lib.skill.zhengsu_leijin : lib.skill.zhengsu.subSkill.leijin, {
			init(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				if (!zsbgxx) {
					player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijing1', ui.arena);
					player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
					player.storage.zhengsu_leijingua2 = true;
				}
				else if (!zsbggg) {
					player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijing2', ui.arena);
					player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
					player.storage.zhengsu_leijingua3 = true;
				}
				else {
					player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijing3', ui.arena);
					player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
				}
			},
			onremove(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				var zsbgxg = document.querySelector('.zhengsubeijing3');
				if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
				if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
				if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
				delete player.storage.zhengsu_leijin_markcount;
				delete player.storage.zhengsu_leijingua2;
				delete player.storage.zhengsu_leijingua3;
				delete player.storage.zhengsu_leijin;
			},
			content() {
				var list = player.getHistory('useCard', function (evt) {
					return evt.isPhaseUsing(player);
				});
				var goon = true;
				for (var i = 0; i < list.length; i++) {
					var num = get.number(list[i].card);
					if (typeof num != 'number') {
						goon = false;
						break;
					}
					if (i > 0) {
						var num2 = get.number(list[i - 1].card);
						if (typeof num2 != 'number' || num2 >= num) {
							goon = false;
							break;
						}
					}
					if (goon == true && list.length <= 2) {
						player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (3 - list.length) + '张牌' + '<br>出牌点数大于' + get.number(list[i].card);
					} else if (goon == true && list.length > 2) {
						player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌点数大于' + get.number(list[i].card);
					}
				}
				if (!goon) {
					game.broadcastAll(function (player) {
						player.storage.zhengsu_leijin = false;
						if (player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML = '╳';
						delete player.storage.zhengsu_leijin_markcount;
						if (player.storage.zhengsu_leijingua2) {
							var zsbgxx = document.querySelector('.zhengsubeijing1');
							if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
						}
						else if (player.storage.zhengsu_leijingua3) {
							var zsbggg = document.querySelector('.zhengsubeijing2');
							if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
						}
						else {
							var zsbgxg = document.querySelector('.zhengsubeijing3');
							if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
						}
					}, player);
				}
				else {
					if (list.length > 2) {
						player.storage.zhengsu_leijin = true;
						game.broadcastAll(function (player, num) {
							if (player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML = '○';
							player.storage.zhengsu_leijin = true;
							player.storage.zhengsu_leijin_markcount = num;
						}, player, num);
					}
					else game.broadcastAll(function (player, num) {
						player.storage.zhengsu_leijin_markcount = num;
					}, player, num);
				}
				player.markSkill('zhengsu_leijin');
			},
		});
		Object.assign(lib.skill.zhengsu_bianzhen ? lib.skill.zhengsu_bianzhen : lib.skill.zhengsu.subSkill.bianzhen, {
			init(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				if (!zsbgxx) {
					player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijing1', ui.arena);
					player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
					player.storage.zhengsu_bianzhengua2 = true;
				}
				else if (!zsbggg) {
					player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijing2', ui.arena);
					player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
					player.storage.zhengsu_bianzhengua3 = true;
				}
				else {
					player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijing3', ui.arena);
					player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
				}
			},
			onremove(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				var zsbgxg = document.querySelector('.zhengsubeijing3');
				if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
				if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
				if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
				delete player.storage.zhengsu_bianzhen;
				delete player.storage.zhengsu_bianzhengua2;
				delete player.storage.zhengsu_bianzhengua3;
			},
			content() {
				var list = player.getHistory('useCard', function (evt) {
					return evt.isPhaseUsing();
				});
				var goon = true, suit = get.suit(list[0].card, false);
				if (goon == true && list.length <= 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (2 - list.length) + '张牌' + '<br>出牌花色为' + get.translation(suit);
				else if (goon == true && list.length > 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌花色为' + get.translation(suit);
				if (suit == 'none') goon = false;
				else {
					for (var i = 1; i < list.length; i++) {
						if (get.suit(list[i]) != suit) {
							goon = false;
							break;
						}
						if (goon == true && list.length <= 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (2 - list.length) + '张牌' + '<br>出牌花色为' + get.translation(get.suit(list[i]));
						else if (goon == true && list.length > 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌花色为' + get.translation(get.suit(list[i]));
					}
				}
				if (!goon) {
					game.broadcastAll(function (player) {
						player.storage.zhengsu_bianzhen = false;
						if (player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML = '╳';
						if (player.storage.zhengsu_bianzhengua2) {
							var zsbgxx = document.querySelector('.zhengsubeijing1');
							if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
						}
						else if (player.storage.zhengsu_bianzhengua3) {
							var zsbggg = document.querySelector('.zhengsubeijing2');
							if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
						}
						else {
							var zsbgxg = document.querySelector('.zhengsubeijing3');
							if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
						}
					}, player);
				}
				else if (list.length > 1) {
					game.broadcastAll(function (player) {
						if (player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML = '○';
						player.storage.zhengsu_bianzhen = true;
					}, player);
				}
			},
		});
		Object.assign(lib.skill.zhengsu_mingzhi ? lib.skill.zhengsu_mingzhi : lib.skill.zhengsu.subSkill.mingzhi, {
			init(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				if (!zsbgxx) {
					player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijing1', ui.arena);
					player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
					player.storage.zhengsu_mingzhigua2 = true;
				}
				else if (!zsbggg) {
					player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijing2', ui.arena);
					player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
					player.storage.zhengsu_mingzhigua3 = true;
				}
				else {
					player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijing3', ui.arena);
					player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
				}
			},
			onremove(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				var zsbgxg = document.querySelector('.zhengsubeijing3');
				if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
				if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
				if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
				delete player.storage.zhengsu_mingzhi_list;
				delete player.storage.zhengsu_mingzhi;
				delete player.storage.zhengsu_mingzhi_markcount;
				delete player.storage.zhengsu_mingzhigua2;
				delete player.storage.zhengsu_mingzhigua3;
			},
			content() {
				var goon = true, list = [];
				player.getHistory('lose', function (event) {
					if (!goon || event.type != 'discard') return false;
					var evt = event.getParent('phaseDiscard');
					if (evt?.player == player) {
						for (var i of event.cards2) {
							var suit = get.suit(i, player);
							if (list.includes(suit)) {
								goon = false;
								break;
							}
							else list.push(suit);
						}
					}
				});
				if (!goon) {
					game.broadcastAll(function (player) {
						player.storage.zhengsu_mingzhi = false;
						if (player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML = '╳';
						if (player.storage.zhengsu_mingzhigua2) {
							var zsbgxx = document.querySelector('.zhengsubeijing1');
							if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
						}
						else if (player.storage.zhengsu_mingzhigua3) {
							var zsbggg = document.querySelector('.zhengsubeijing2');
							if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
						}
						else {
							var zsbgxg = document.querySelector('.zhengsubeijing3');
							if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
						}
						delete player.storage.zhengsu_mingzhi_list;
					}, player);
				}
				else {
					if (list.length > 1) {
						game.broadcastAll(function (player, list) {
							if (player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML = '○';
							player.storage.zhengsu_mingzhi = true;
							player.storage.zhengsu_mingzhi_list = list;
							player.storage.zhengsu_mingzhi_markcount = list.length;
						}, player, list);
					}
					else game.broadcastAll(function (player, list) {
						player.storage.zhengsu_mingzhi_list = list;
						player.storage.zhengsu_mingzhi_markcount = list.length;
					}, player, list);
				}
				player.markSkill('zhengsu_mingzhi');
			},
		});
		lib.translate.spyanji_info = `出牌阶段开始时，你可以进行${get.poptip('rule_zhengsu')}。若如此做，弃牌阶段结束时，若你整肃成功，你获得整肃奖励。`;
		lib.translate.spzhengjun_info = `出牌阶段开始时，你可以进行${get.poptip('rule_zhengsu')}。若如此做，弃牌阶段结束时，若你整肃成功，你获得整肃奖励，然后你可以选择一名其他角色，令其也获得整肃奖励。`;
		lib.translate.houfeng_info = `每轮限一次，一名其他角色的出牌阶段开始时，若其在你的攻击范围内，则你可以令其进行${get.poptip('rule_zhengsu')}。若如此做，其本回合弃牌阶段结束时，若其整肃成功，你与其获得整肃奖励。`;
	}
	//仁库
	if (lib.config.extension_活动武将_HD_renku) {
		game.updateRenku = function () {
			game.broadcast(renku => _status.renku = renku, _status.renku);
			if (!window.rkbg) {
				window.rkbg = ui.create.div('.renkubeijinggua', ui.arena);
				if (lib.config.hdwj_renkuIndex) {
					window.rkbg.style.left = Math.round(lib.config.hdwj_renkuIndex.x * document.body.offsetWidth) + 'px';
					window.rkbg.style.top = Math.round(lib.config.hdwj_renkuIndex.y * document.body.offsetHeight) + 'px';
				}
			}
			window.rkbg.innerHTML = '仁' + (_status.renku.length < 6 ? '' : '<b><font color=\"#FF5500\">') + _status.renku.length;
			let isDragging = false;
			let offsetX = 0, offsetY = 0;
			let animationFrameId = null;
			let saveRenkuPosition = function () {
				lib.config.hdwj_renkuIndex ??= {};
				lib.config.hdwj_renkuIndex.x = window.rkbg.offsetLeft / document.body.offsetWidth;
				lib.config.hdwj_renkuIndex.y = window.rkbg.offsetTop / document.body.offsetHeight;
				game.saveConfig('hdwj_renkuIndex', lib.config.hdwj_renkuIndex);
			}
			if (lib.config.touchscreen) {
				let defaultevent = e => e.preventDefault();
				window.rkbg.addEventListener('touchstart', function (e) {
					let evt = e || window.event;
					let zoom = game.documentZoom || 1;
					offsetX = (evt.touches[0].clientX - window.rkbg.offsetLeft * zoom) / zoom;
					offsetY = (evt.touches[0].clientY - window.rkbg.offsetTop * zoom) / zoom;
					document.addEventListener('touchmove', defaultevent, false);
				});
				window.rkbg.addEventListener('touchmove', function (e) {
					let evt = e || window.event;
					let zoom = game.documentZoom || 1;
					let oleft = evt.touches[0].clientX / zoom - offsetX;
					let otop = evt.touches[0].clientY / zoom - offsetY;
					window.rkbg.style.left = oleft + 'px';
					window.rkbg.style.top = otop + 'px';
				});
				window.rkbg.addEventListener('touchend', function () {
					saveRenkuPosition();
					document.removeEventListener('touchmove', defaultevent);
				});
			}
			else {
				window.rkbg.addEventListener('mousedown', function (e) {
					let zoom = game.documentZoom || 1;
					isDragging = true;
					offsetX = (e.clientX - window.rkbg.offsetLeft * zoom) / zoom;
					offsetY = (e.clientY - window.rkbg.offsetTop * zoom) / zoom;
					document.body.style.userSelect = 'none';
					e.preventDefault();
				});
				document.addEventListener('mousemove', function (e) {
					if (isDragging) {
						if (animationFrameId) cancelAnimationFrame(animationFrameId);
						animationFrameId = requestAnimationFrame(() => {
							let zoom = game.documentZoom || 1;
							let newX = e.clientX / zoom - offsetX;
							let newY = e.clientY / zoom - offsetY;
							window.rkbg.style.left = newX + 'px';
							window.rkbg.style.top = newY + 'px';
						});
					}
				});
				document.addEventListener('mouseup', function () {
					if (isDragging) {
						isDragging = false;
						document.body.style.userSelect = '';
						saveRenkuPosition();
					}
				});
			}
			if (_status.renku.length === 0) {
				window.rkbg.remove();
				window.rkbg = null;
			}
			else {
				window.rkbg.onclick = function () {
					if (!window.dialogguagua) {
						window.dialogguagua = ui.create.dialog('仁库', _status.renku, "peaceDialog");
						window.rkbg.innerHTML = '❌';
					}
					else {
						window.dialogguagua.remove();
						window.dialogguagua = null;
						window.rkbg.innerHTML = '仁' + (_status.renku.length < 6 ? '' : '<b><font color=\"#FF5500\">') + _status.renku.length;
					}
				};
			}
		};
	}

	//precGuoZhan(分界线，便于我搜过来)
	if (get.mode() == 'guozhan') {
		//国战武将技能修复
		if (get.config('onlyguozhan')) {
			//------------------------------增改武将------------------------------//
			Object.assign(lib.character, {
				gz_re_xushu: ['male', 'shu', 4, ['gzqiance', 'gzjujian'], ['gzskin']],
				gz_wujing: ['male', 'wu', 4, ['donggui', 'fengyang_old'], ['gzskin']],
			});
		}
		//------------------------------选项------------------------------//
		//卞夫人
		lib.skill.gzwanwei = {
			audio: 'wanwei',
			inherit: 'fuwei',
		};
		//左慈
		Object.assign(lib.skill.yigui, {
			drawCharacter(player, list) {
				game.broadcastAll((player, list) => {
					player.$draw(list.map(name => {
						const cardname = 'huashen_card_' + name;
						lib.card[cardname] = {
							fullimage: true,
							image: player.isUnderControl(true) ? `character:${name}` : 'ext:活动武将/image/card/huashen_unknown.jpg',
						}
						lib.translate[cardname] = player.isUnderControl(true) ? get.rawName2(name) : ' ';
						return game.createCard(cardname, '', '');
					}), 'nobroadcast');
				}, player, list);
			},
			group: ['yigui_init', 'yigui_refrain', 'yigui_gzshan', 'yigui_gzwuxie'],
		});
		const yiguiInfo = lib.translate.yigui_info;
		lib.translate.yigui_info = yiguiInfo.slice(0, yiguiInfo.indexOf('（')) + '（此牌指定或响应的角色须为未确定势力的角色或野心家或与此“魂”势力相同的角色）';
		//唐咨
		lib.skill.gzxingzhao.derivation = 'xunxun';
		lib.skill.gzxingzhao.subSkill.use = {
			audio: 'gzxingzhao',
			trigger: { player: 'damageEnd' },
			filter(event, player) {
				var num = lib.skill.gzxingzhao.getNum();
				return num >= 2 && event.source?.isIn() && player.countCards('h') != event.source.countCards('h');
			},
			logTarget(event, player) {
				return player.countCards('h') > event.source.countCards('h') ? event.source : player;
			},
			forced: true,
			content() {
				event.targets[0].draw();
			},
		};
		lib.translate.gzxingzhao_info = lib.translate.gzxingzhao_old_info;
	}

	//设置稀有度
	//鄙人用脚设置的稀有度，只图博君一笑
	if (lib.rank) {
		//平凡升阶
		lib.rank.rarity.junk.remove('sunshao');
		lib.rank.rarity.junk.remove('re_chenqun');
		//设置评级
		var rank = {
			rarity: {
				//传说
				legend: [
					//SSS传说武将评级
					//DDDD
					'sunce',
					're_sunce',
					'machao',
					'dingyuan',
					//正经补充
					'sp_ol_zhanghe',
					'zhangxuan',
					'zhouyi',
					'tengfanglan',
					'caoxiancaohua',
					//----------------分界线----------------
					'old_zhangzhongjing',
					'oldx_zhangzhongjing',
					'old_shen_xunyu',
					'old_shen_taishici',
					'old_shen_sunce',
					'ol_shen_dianwei',
					'ol_shen_guanyu',
					'mb_shen_caocao',
				],
				//史诗
				epic: [
					'old_sp_jianggan',
					'ol_maliang',
					'old_clan_xunchen',
					'old_clan_xuncai',
					'old_clan_xuncan',
					'old_sb_ganning',
					'old_yj_ganning',
					'junk_simayi',
					'old_zhangyì',
					'old_yanghuiyu',
					'junk_lidian',
				],
				//稀有
				rare: [
					'old_yuanji',
					'old_ol_yuanji',
					'junk_duanwei',
					'old_sb_zhanghe',
					'old_sunluyu',
					'zhaoxiang',
					'old_zhouchu',
					'old_liuzhang',
					'old_wangling',
					'junk_zhangrang',
					'old_zhaoxiang',
					'ol_yujin',
				],
				//普通
				common: [
				],
				//平凡
				junk: [
					'old_ol_xiaoqiao',
					'old_zhanghe',
					'old_zhugejin',
				],
			},
			//出场率
			s: [
			],
			ap: [
			],
			a: [
			],
			am: [
			],
			bp: [
			],
			b: [
			],
			bm: [
			],
			c: [
			],
			d: [
			],
		};
		//块级修改
		const mx_rarity = {
			legend: ['decadeQiHuan', 'decadeZhuoGui', 'MiNikill', 'MX_feihongyinxue', 'decadeKuiBa', 'HD_chaoshikong'],
			epic: ['WeChatkill', 'MiNiAppkill', 'hezongkangqincharacter'],
			rare: ['yingbian'],
			junk: ['sb'],
		};
		for (const i in mx_rarity) {
			for (const j of mx_rarity[i]) {
				for (const name of Object.keys(lib.characterPack[j])) {
					if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].includes(name))) rank.rarity[i].add(name);
				}
			}
		}
		for (const name of Object.keys(lib.characterPack['huodongcharacter'])) {
			if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].includes(name))) {
				if (['Chuodong', 'CXuanDie'].some(pack => lib.characterSort.huodongcharacter[pack].includes(name))) rank.rarity['legend'].push(name);
				else rank.rarity['rare'].push(name);
			}
		}
		for (const name of lib.characterSort['diy'].diy_trashbin) {
			if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].includes(name))) rank.rarity['junk'].add(name);
		}
		for (const name of lib.characterSort['sp'].sp_qifu) {
			if (!rank.rarity.legend.includes(name)) rank.rarity['legend'].add(name);
		}
		//总置
		var addRank = function (rank) {
			if (!lib.rank) return;
			for (var i in rank) {
				if (i == 'rarity') continue;
				lib.rank[i].addArray(rank[i]);
			}
			if (rank.rarity && lib.rank.rarity) {
				for (var i in rank.rarity) {
					lib.rank.rarity[i] ??= [];
					lib.rank.rarity[i].addArray(rank.rarity[i]);
				}
			}
		};
		addRank(rank);
	}

	//名称还原
	const changeMap = new Map([
		['张机', '张仲景'],
		['蔡琰', '蔡文姬'],
		['卧龙', '卧龙诸葛'],
		['严虎', '严白虎'],
		['甄宓', '甄姬'],
		['伏寿', '伏皇后'],
		['吉本', '吉平'],
		['南华', '南华老仙'],
		...[...(_status._HD_REname?.changeMap ?? new Map([])).entries()],
	]);
	const BanIdList = ['jsrg_zhenji'].concat(_status._HD_REname?.BanIdList ?? []);//不修改名称的ID白名单，必须ID完全符合才不替换
	const BanTransList = [].concat(_status._HD_REname?.BanTransList ?? []);//不修改名称的translate白名单，包含此翻译的均不替换
	const getRawName = function (name, str) {
		let str2 = str;
		if (str2) {
			if (lib.translate[`${name}_prefix`]) {
				let prefixList = lib.translate[`${name}_prefix`].split('|');
				while (prefixList.length) {
					const prefix = prefixList.shift();
					if (str2.startsWith(prefix)) {
						str2 = str2.slice(prefix.length);
						continue;
					}
					break;
				}
			}
			return str2;
		}
		return '';
	};
	lib.translate = new Proxy(lib.translate, {
		get(target, name, receiver) {
			const translation = Reflect.get(target, name, receiver);
			if (lib.config.extension_活动武将_HD_REname) {
				if (typeof name === 'string' && typeof translation === 'string' && !BanTransList.includes(translation)) {
					let character = name, rawtranslate = getRawName(name, translation);
					if (character.endsWith('_ab')) character = character.slice(name.slice(0, -'_ab'.length));
					if (!get.character(character).isNull && !BanIdList.includes(character) && changeMap.has(rawtranslate)) return `${translation.slice(0, -rawtranslate.length)}${changeMap.get(rawtranslate)}`;
				}
			}
			return translation;
		},
	});

	//precA
	//配音
	//技能配音修正
	lib.skill.juntun.audio = 'ext:活动武将/audio/skill:true';
	lib.skill.jiaojie.audio = 'ext:活动武将/audio/skill:true';
	lib.skill.old_sbqiaobian.audio = 'sbqiaobian';
	lib.skill.old_sbqiaobian.subSkill.draw.audio = 'sbqiaobian';

	//武将配音audioname添加
	game.HDsetAudioname = function (skills, list) {
		if (!Array.isArray(skills)) skills = [skills];
		if (!Array.isArray(list)) list = [list];
		skills.forEach(skill => {
			if (!lib.skill[skill]) return;
			lib.skill[skill].audioname ??= [];
			lib.skill[skill].audioname.addArray(list);
			if (lib.skill[skill].subSkill) {
				for (const skill2 in lib.skill[skill].subSkill) {
					if (lib.skill[skill2]?.audio === skill) {
						lib.skill[skill2].audioname ??= [];
						lib.skill[skill2].audioname.addArray(list);
					}
				}
			}
		});
	};
	game.HDsetAudioname(get.character('bilibili_zhoutaigong').skills, 'bilibili_zhoutaigong');
	game.HDsetAudioname(get.character('bilibili_zhouxiaomei').skills, 'bilibili_zhouxiaomei');
	game.HDsetAudioname('yijin', 'bilibili_litiansuo');
	game.HDsetAudioname(['reqimou', 'zhaxiang', 'zhaxiang2', 'tairan', 'tairan2'], 'bilibili_kuangshen04');
	game.HDsetAudioname('longdan', 'sp_zhaoyun');

	//武将配音audioname2添加
	game.HDsetAudioname2 = function (skills, map) {
		if (!Array.isArray(skills)) skills = [skills];
		skills.forEach(skill => {
			if (!lib.skill[skill]) return;
			lib.skill[skill].audioname2 ??= {};
			for (var i in map) lib.skill[skill].audioname2[i] = map[i];
		});
	};
	game.HDsetAudioname2('yaowu', {
		FD_huaxiong: 'haoshi2',
	});
	game.HDsetAudioname2(['yinghun', 'gzyinghun'], {
		FD_sunjian: 'haoshi2',
	});
	game.HDsetAudioname2(['yicong', 'reyicong'], {
		jsp_zhaoyun: 'haoshi2',
		oldx_zhaoyun: 'haoshi2',
	});
	game.HDsetAudioname2(['rejianxiong', 'new_rejianxiong'], {
		qin_lvbuwei: 'haoshi2',
		Mbaby_caocao: 'jianxiong',
	});
	game.HDsetAudioname2('rerende', {
		qin_lvbuwei: 'haoshi2',
		Mbaby_liubei: 'rende',
	});
	game.HDsetAudioname2('rezhiheng', {
		qin_lvbuwei: 'haoshi2',
		Mbaby_sunquan: 'zhiheng',
	});
	game.HDsetAudioname2('relianying', {
		wechat_lukang: 'rejizhi_lukang',
	});
	game.HDsetAudioname2('huguan', {
		bilibili_wangwang: Array.from({ length: 2 }).map((_, i) => ['', '_wangyue'].map(j => j + (i + 1))).flat().map(i => `huguan${i}.mp3`),
	});
	game.HDsetAudioname2('luoyi', {
		Mbaby_re_xuzhu: 'reluoyi',
	});
	game.HDsetAudioname2('reganglie', {
		Mbaby_xiahoudun: 'ganglie',
	});
	game.HDsetAudioname2('kurou', {
		Mbaby_re_huanggai: 'rekurou',
	});
	game.HDsetAudioname2('reyingzi', {
		Mbaby_zhouyu: 'yingzi',
		Mbaby_heqi: 'miniqizhou_yingzi',
	});
	game.HDsetAudioname2('jsrgguanjue', {
		Mbaby_re_guanyu: 'miniguanjue',
	});
	game.HDsetAudioname2('jugu', {
		qin_lvbuwei: 'qin_jugu',
		bilibili_litiansuo: 'haoshi2',
	});
	game.HDsetAudioname2('yijin', {
		bilibili_litiansuo: 'haoshi2',
	});
	game.HDsetAudioname2(['wushuang', 'wushuang1', 'wushuang2'], {
		wechat_zhiyin_lvbu: 'wushuang_wechat_zhiyin_lvbu',
	});
	game.HDsetAudioname2('decadexuanfeng', {
		wechat_lingtong: 'xuanfeng',
		Mbaby_heqi: 'miniqizhou_xuanfeng',
	});
	game.HDsetAudioname2('bifa', {
		Mbaby_chenlin: 'bifa_Mbaby_chenlin',
	});
	game.HDsetAudioname2(['songwei', 'songwei2'], {
		Mbaby_caopi: 'songwei_Mbaby_caopi',
	});
	game.HDsetAudioname2('nzry_jianxiang', {
		Mbaby_kuailiangkuaiyue: 'nzry_jianxiang_Mbaby_kuailiangkuaiyue',
	});
	game.HDsetAudioname2('rejunbing', {
		Mbaby_simalang: 'rejunbing_Mbaby_simalang',
	});
	game.HDsetAudioname2('decadezhenjun', {
		Mbaby_yujin: 'decadezhenjun_Mbaby_yujin',
	});
	game.HDsetAudioname2(['paiyi', 'paiyi_backup'], {
		Mbaby_zhonghui: 'paiyi_Mbaby_zhonghui',
	});
	game.HDsetAudioname2('reweizhong', {
		Mbaby_zhugedan: 'weizhong',
	});
	game.HDsetAudioname2('sheyan', {
		Mbaby_dongyun: 'sheyan_Mbaby_dongyun',
	});
	game.HDsetAudioname2('jiezhong', {
		Mbaby_guanping: 'jiezhong_Mbaby_guanping',
	});
	game.HDsetAudioname2('xueji', {
		Mbaby_guanyinping: 'xueji_Mbaby_guanyinping',
	});
	game.HDsetAudioname2('jyzongshi', {
		Mbaby_jianyong: 'jyzongshi_Mbaby_jianyong',
	});
	game.HDsetAudioname2('zhuning', {
		Mbaby_liuyong: 'zhuning_Mbaby_liuyong',
	});
	game.HDsetAudioname2(['xinfu_bijing', 'xinfu_bijing_lose', 'xinfu_bijing_discard'], {
		Mbaby_lvkai: 'xinfu_bijing_Mbaby_lvkai',
	});
	game.HDsetAudioname2('xinwuyan', {
		Mbaby_xushu: 'wuyan',
	});
	game.HDsetAudioname2('zhuihuan', {
		Mbaby_yangwan: 'zhuihuan_Mbaby_yangwan',
	});
	game.HDsetAudioname2('rewurong', {
		Mbaby_zhangyi: 'rewurong_Mbaby_zhangyi',
	});
	game.HDsetAudioname2('rebingyi', {
		Mbaby_re_guyong: 'bingyi',
	});
	game.HDsetAudioname2('xinfu_zhanji', {
		Mbaby_re_jsp_pangtong: 'xinfu_zhanji_Mbaby_re_jsp_pangtong',
	});
	game.HDsetAudioname2('remumu', {
		Mbaby_sunluyu: 'remumu_Mbaby_sunluyu',
	});
	game.HDsetAudioname2(['rezhijian', 'rezhijian_use'], {
		Mbaby_zhangzhang: 'zhijian',
	});
	game.HDsetAudioname2('xinfu_duanfa', {
		Mbaby_zhoufang: 'xinfu_duanfa_Mbaby_zhoufang',
	});
	game.HDsetAudioname2('dcjiezhen', {
		Mbaby_dc_huangchengyan: 'dcjiezhen_Mbaby_dc_huangchengyan',
	});
	game.HDsetAudioname2('dcyinshi', {
		Mbaby_dc_huangchengyan: 'dcyinshi_Mbaby_dc_huangchengyan',
	});
	game.HDsetAudioname2('dcjinggong', {
		Mbaby_dc_huangzu: 'dcjinggong_Mbaby_dc_huangzu',
	});
	game.HDsetAudioname2('olpingduan', {
		Mbaby_kebineng: 'olpingduan_Mbaby_kebineng',
	});
	game.HDsetAudioname2('lxzhuixi', {
		Mbaby_liangxing: 'lxzhuixi_Mbaby_liangxing',
	});
	game.HDsetAudioname2('xinjuece', {
		Mbaby_liru: 'xinjuece_Mbaby_liru',
	});
	game.HDsetAudioname2('xinfencheng', {
		Mbaby_liru: 'xinfencheng_Mbaby_liru',
	});
	game.HDsetAudioname2('xinfu_chenghao', {
		Mbaby_simahui: 'xinfu_chenghao_Mbaby_simahui',
	});
	game.HDsetAudioname2('xinjingong', {
		Mbaby_wangyun: 'xinjingong_Mbaby_wangyun',
	});
	game.HDsetAudioname2('jdsbzhiheng', {
		Mbaby_sb_sunquan: 'jdsbzhiheng_Mbaby_sb_sunquan',
	});
	game.HDsetAudioname2('sbyingzi', {
		Mbaby_sb_sunquan: 'minitongye_yingzi',
	});
	game.HDsetAudioname2('jdsbjiuyuan', {
		Mbaby_sb_sunquan: 'jdsbjiuyuan_Mbaby_sb_sunquan',
	});
	game.HDsetAudioname2('refankui', {
		mp_simayi: 'fankui',
	});
	game.HDsetAudioname2('gongxin', {
		mp_lvmeng: 'gongxin_mp_lvmeng',
	});
	game.HDsetAudioname2('reqingguo', {
		mp_zhenji: 'qingguo',
	});
	game.HDsetAudioname2('xinguidao', {
		mp_sp_zhangjiao: 'guidao',
	});
	game.HDsetAudioname2('olduanliang', {
		mp_xuhuang: 'duanliang',
	});
	game.HDsetAudioname2('reweizhong', {
		mp_zhugedan: 'weizhong',
	});
	game.HDsetAudioname2('reguose', {
		mp_daqiao: 'guose',
	});

	//precCI
	//武将信息
	//----------------孙笨の专属正名区·始----------------
	lib.characterIntro.re_sunben = lib.characterIntro.sunce || '';
	//----------------孙笨の专属正名区·末----------------
	//遗漏武将介绍补充
	lib.characterIntro.lidian = lib.characterIntro.re_lidian;
	lib.characterIntro.wolongfengchu = lib.characterIntro.zhugeliang + '<br>' + lib.characterIntro.pangtong;

	//precCR
	//同名武将替换
	const hdpj_characterReplace = {
		xuyou: ['bilibili_sp_xuyou'],
		zhangzhongjing: ['bol_zhangzhongjing', 'old_zhangzhongjing', 'oldx_zhangzhongjing'],
		jin_yanghuiyu: ['old_yanghuiyu'],
		shen_xunyu: ['old_shen_xunyu'],
		shen_taishici: ['old_shen_taishici'],
		shen_sunce: ['old_shen_sunce'],
		sunluyu: ['old_sunluyu'],
		zhaoxiang: ['old_zhaoxiang'],
		zhangyì: ['old_zhangyì'],
		yj_ganning: ['old_yj_ganning'],
		ol_lusu: ['lusu'],
		re_yuanshao: ['yuanshao'],
		yuanji: ['old_yuanji', 'old_ol_yuanji'],
		zhanghe: ['old_zhanghe', 'old_sb_zhanghe'],
		zhugejin: ['old_zhugejin'],
		xiaoqiao: ['old_ol_xiaoqiao'],
		xunchen: ['old_xunchen'],
		sunshao: ['old_sp_sunshao'],
		huaxin: ['bol_sp_huaxin', 'old_sp_huaxin'],
		kongrong: ['old_sp_kongrong'],
		dc_mifuren: ['old_sp_mifuren'],
		liuzhang: ['old_liuzhang'],
		zhouchu: ['old_zhouchu'],
		ganning: ['old_sb_ganning'],
		zhangbao: ['old_zhangbao'],
		jsp_guanyu: ['bolx_jsp_guanyu'],
		shen_dianwei: ['ol_shen_dianwei'],
		jianggan: ['old_sp_jianggan'],
		shen_guanyu: ['ol_shen_guanyu'],
		shen_caocao: ['mb_shen_caocao'],
	};
	for (const i in hdpj_characterReplace) {
		let list = lib.characterReplace[i] || [];
		lib.characterReplace[i] = list.concat(hdpj_characterReplace[i]).unique();
	}

	//precC
	//武将补充/修改
	//标包
	game.HDaddCharacter('re_yuanshu', ['male', 'qun', 4, ['wangzun', 'tongji'], []], 'standard');

	//经典神将
	game.HDaddCharacter('shen_guanyu', ['male', 'shen', 5, ['old_wushen', 'new_wuhun'], ['shu']], 'extra');

	//界限突破
	game.HDaddCharacter('dc_xushu', ['male', 'shu', 4, ['bolzhuhai', 'xsqianxin'], []], 'refresh');

	//璀璨星河
	game.HDaddCharacter('maliang', ['male', 'shu', 3, ['zishu', 'xinyingyuan'], []], 'sp');
	game.HDaddCharacter('zhanghua', ['male', 'jin', 3, ['olbihun', 'oljianhe', 'bolchuanwu'], []], 'sp');

	//系列专属包
	lib.characterSort.sp2.sp2_waitforsort.addArray(['junk_zhangrang']);
	game.HDaddCharacter('junk_zhangrang', ['male', 'qun', 3, ['junktaoluan'], ['die:zhangrang']], 'sp2');

	//OL专属
	lib.characterSort.onlyOL.extra_ol.addArray(['ol_shen_dianwei', 'ol_shen_guanyu']);
	lib.characterSort.onlyOL.bilibili_buchong_online = ['old_huatuo'];
	game.HDaddCharacter('ol_shen_dianwei', ['male', 'shen', 4, ['juanjia', 'fh_qiexie', 'fh_cuijue'], ['unseen', 'wei', ...['character:', 'die:'].map(i => i + 'shen_dianwei')]], 'onlyOL');
	game.HDaddCharacter('shen_sunquan', ['male', 'shen', 4, ['bolyuheng', 'boldili'], ['wu']], 'onlyOL');
	game.HDaddCharacter('shen_dianwei', ['male', 'shen', 4, ['juanjia', 'qiexie', 'fh_cuijue'], ['wei']], 'onlyOL');
	game.HDmoveCharacter('old_huatuo', 'onlyOL');
	game.HDaddCharacter('ol_shen_guanyu', ['male', 'shen', 5, ['wushen', 'new_wuhun'], ['shu', 'die:shen_guanyu']], 'onlyOL');

	//移动服
	lib.characterSort.mobile.extra_mb.addArray(['mb_shen_caocao']);
	lib.characterSort.mobile.bilibili_buchong_mobile = ['ol_huaxiong', 'old_zhangxingcai', 'ol_maliang', 'ol_yuanshu', 'old_bulianshi'];
	game.HDaddCharacter('old_bulianshi', ['female', 'wu', 3, ['anxu', 'zhuiyi'], ['die:bulianshi']], 'mobile');
	game.HDaddCharacter('ol_yuanshu', ['male', 'qun', 4, ['rewangzun', 'retongji'], ['die:re_yuanshu']], 'mobile');
	game.HDaddCharacter('ol_maliang', ['male', 'shu', 3, ['zishu', 'yingyuan'], ['die:maliang']], 'mobile');
	game.HDmoveCharacter('old_zhangxingcai', 'mobile');
	game.HDmoveCharacter('ol_huaxiong', 'mobile');
	game.HDaddCharacter('mb_shen_caocao', ['male', 'shen', 3, ['guixin', 'feiying'], ['wei', 'die:shen_caocao']], 'mobile');

	//线下
	lib.characterSort.offline.offline_star.add('bolx_jsp_guanyu');
	lib.characterSort.offline.offline_yongjian.add('bol_sunluban');
	if (lib.config.extension_活动武将_XvXiang) {
		for (const name of lib.characterSort.offline.offline_vtuber) {
			lib.characterPack.offline[name].skills.add('bilibili_xuxiang');
			if (lib.character[name]) lib.character[name].skills.add('bilibili_xuxiang');
		}
	}
	game.HDaddCharacter('bolx_jsp_guanyu', ['male', 'wei', 4, ['wusheng', 'wzdanji'], ['tempname:jsp_guanyu', 'die:jsg_guanyu']], 'offline');
	game.HDaddCharacter('bol_sunluban', ['female', 'wu', 3, ['boljiaozong', 'bolchouyou']], 'offline');

	//怀旧包
	lib.characterSort.old.bilibili_buchong_online2 = ['old_peixiu', 'junk_guanyu', 'old_ol_xiaoqiao', 'old_zhangbao', 'old_sunluyu', 'old_ol_yuanji'];
	lib.characterSort.old.bilibili_buchong_yijiang2 = ['old_yuanji', 'junk_duanwei'];
	lib.characterSort.old.bilibili_buchong_mobile2 = ['old_sb_zhanghe', 'old_shen_sunce', 'old_shen_taishici', 'old_shen_xunyu', 'old_zhaoxiang', 'old_sb_ganning', 'old_zhouchu', 'old_xunchen', 'old_sp_kongrong', 'old_zhangzhongjing', 'oldx_zhangzhongjing', 'old_zhangyì', 'old_yanghuiyu', 'old_liuzhang', 'old_sp_sunshao', 'old_wangling', 'old_sp_huaxin', 'old_sp_mifuren', 'old_sp_jianggan'];
	lib.characterSort.old.bilibili_buchong_menfashizu = ['old_clan_xunchen', 'old_clan_xuncai', 'old_clan_xuncan'];
	game.HDaddCharacter('old_clan_xunchen', ['male', 'qun', 3, ['old_sankuang', 'old_beishi', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xunchen', 'die:clan_xunchen']], 'old');
	game.HDaddCharacter('old_clan_xuncai', ['female', 'qun', 3, ['old_lieshi', 'old_dianzhan', 'old_huanyin', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xuncai', 'die:clan_xuncai']], 'old');
	game.HDaddCharacter('old_clan_xuncan', ['male', 'wei', 3, ['old_yunshen', 'old_shangshen', 'old_fenchai', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xuncan', 'die:clan_xuncan']], 'old');
	game.HDaddCharacter('old_shen_xunyu', ['male', 'shen', 3, ['old_tianzuo', 'old_lingce', 'old_dinghan'], ['wei', 'die:shen_xunyu']], 'old');
	game.HDaddCharacter('old_shen_taishici', ['male', 'shen', 4, ['olddulie', 'oldpowei', 'dangmo'], ['wu', 'die:shen_taishici']], 'old');
	game.HDaddCharacter('old_shen_sunce', ['male', 'shen', '1/6', ['old_yingba', 'old_fuhai', 'old_pinghe'], ['wu', 'die:shen_sunce']], 'old');
	game.HDaddCharacter('old_zhangyì', ['male', 'shu', 4, ['zhiyi'], ['die:zhangyì']], 'old');
	game.HDaddCharacter('old_xunchen', ['male', 'qun', 3, ['jianzhan', 'reduoji'], ['die:ext:活动武将/audio/die:true']], 'old');
	game.HDaddCharacter('old_zhangzhongjing', ['male', 'qun', 3, ['old_jishi', 'liaoyi', 'binglun'], ['die:zhangzhongjing']], 'old');
	game.HDaddCharacter('oldx_zhangzhongjing', ['male', 'qun', 3, ['jishi', 'old_liaoyi', 'binglun'], ['die:zhangzhongjing']], 'old');
	game.HDaddCharacter('old_yanghuiyu', ['female', 'wei', 3, ['oldhongyi', 'quanfeng'], ['die:yanghuiyu']], 'old');
	game.HDaddCharacter('old_zhangbao', ['male', 'qun', 3, ['old_zhoufu', 'old_yingbing'], ['die:zhangbao']], 'old');
	game.HDaddCharacter('old_sunluyu', ['female', 'wu', 3, ['meibu', 'mumu'], ['die:sunluyu']], 'old');
	game.HDaddCharacter('old_ol_yuanji', ['female', 'wu', 3, ['old_jieyan', 'old_jinghua', 'old_shuiyue'], ['die:ol_yuanji']], 'old');
	game.HDaddCharacter('old_sp_sunshao', ['male', 'wu', 3, ['refubi', 'rezuici'], ['die:sp_sunshao']], 'old');
	game.HDaddCharacter('old_liuzhang', ['male', 'qun', 3, ['xiusheng', 'yinlang', 'huaibi'], ['zhu', 'die:liuzhang']], 'old');
	game.HDaddCharacter('old_wangling', ['male', 'wei', 4, ['mouli', 'zifu'], ['die:wangling']], 'old');
	game.HDaddCharacter('old_sp_huaxin', ['male', 'wei', 3, ['hxrenshi', 'debao', 'buqi'], ['die:sp_huaxin']], 'old');
	game.HDaddCharacter('old_sp_kongrong', ['male', 'qun', 3, ['spmingshi', 'splirang'], ['die:sp_kongrong']], 'old');
	game.HDaddCharacter('old_sp_mifuren', ['female', 'shu', 3, ['spguixiu', 'spcunsi'], ['die:sp_mifuren']], 'old');
	game.HDaddCharacter('old_zhouchu', ['male', 'wu', 4, ['xianghai', 'chuhai'], ['die:zhouchu']], 'old');
	game.HDaddCharacter('old_sb_ganning', ['male', 'wu', 4, ['old_qixi', 'old_fenwei'], ['die:sb_ganning']], 'old');
	game.HDmoveCharacter('junk_duanwei', 'old');
	lib.characterPack.old.junk_duanwei[4].add('die:duanwei');
	if (lib.config.characters.includes('old')) lib.character.junk_duanwei[4].add('die:duanwei');
	game.HDaddCharacter('old_sp_jianggan', ['male', 'wei', 3, ['spdaoshu', 'spdaizui'], ['die:sp_jianggan']], 'old');
	game.HDaddCharacter('old_yuanji', ['female', 'wu', 3, ['dcmengchi', 'dcjiexing'], ['die:yuanji']], 'old');
	game.HDmoveCharacter('junk_guanyu', 'old');
	game.HDaddCharacter('old_ol_xiaoqiao', ['female', 'wu', 3, ['oltianxiang', 'rehongyan'], [...['tempname', 'die'].map(i => `${i}:ol_xiaoqiao`)]], 'old');
	game.HDaddCharacter('old_zhaoxiang', ['female', 'shu', 4, ['xinfanghun', 'xinfuhan'], ['die:zhaoxiang']], 'old');
	game.HDaddCharacter('old_sb_zhanghe', ['male', 'wei', 4, ['old_sbqiaobian'], ['die:sb_zhanghe']], 'old');
	game.HDaddCharacter('old_peixiu', ['male', 'wei', 4, ['olmaozhu', 'oljinlan'], ['character:ol_peixiu', 'border:jin']], 'old');

	//DIY
	lib.characterSort.diy.diy_trashbin.addArray(['old_yj_ganning', 'lusu', 'yuanshao', 'bol_zhangzhongjing', 'bol_sp_huaxin', 'bfake_zuoci', 'bfake_yangfu', 'bfake_chengpu', 'bfake_sundeng', 'old_shen_sunquan', 'old_shen_ganning', 'bfake_chengui', 'old_ol_xiaoqiao', 'old_zhanghe', 'old_zhugejin', 'oldx_zhangfei', 'oldx_guanyu', 'oldx_zhaoyun', 'oldx_yujin']);
	game.HDaddCharacter('bfake_yangfu', ['male', 'wei', 4, ['old_jiebing', 'old_kuzhan'], ['die:yangfu']], 'diy');
	game.HDaddCharacter('bfake_zuoci', ['male', 'qun', 3, ['BThuashen', 'BTxinsheng'], ['die:re_zuoci']], 'diy');
	game.HDaddCharacter('bfake_chengpu', ['male', 'wu', 4, ['bollihuo', 'bolchunlao'], ['die:chengpu']], 'diy');
	game.HDaddCharacter('bfake_sundeng', ['male', 'wu', 4, ['bolkuangbi'], ['die:sundeng']], 'diy');
	game.HDaddCharacter('old_shen_sunquan', ['male', 'shen', 4, ['old_yuheng'], ['wu', 'die:shen_sunquan']], 'diy');
	game.HDaddCharacter('old_shen_ganning', ['male', 'shen', 1, ['old_jieying', 'old_tongling'], ['wu', 'die:shen_ganning']], 'diy');
	game.HDaddCharacter('bfake_chengui', ['male', 'qun', 3, ['bolyingtu', 'bolcongshi'], ['die:chengui']], 'diy');
	if (lib.config.connect_nickname == '萌新（转型中）') {
		game.HDaddCharacter('bol_sp_huaxin', ['male', 'wei', 3, ['bolyuanqing', 'bolshuchen', 'bolxiezheng'], ['die:sp_huaxin']], 'diy');
		game.HDaddCharacter('bol_zhangzhongjing', ['male', 'qun', 3, ['bolliaoyi', 'bolbinglun'], ['die:zhangzhongjing']], 'diy');
	}
	game.HDaddCharacter('old_zhanghe', ['male', 'wei', 4, ['qiaobian', 'bilibili_zhiyinxian'], ['die:zhanghe']], 'diy');
	game.HDaddCharacter('old_zhugejin', ['male', 'wu', 3, ['olhongyuan', 'bolhuanshi', 'olmingzhe'], ['die:zhugejin']], 'diy');
	game.HDaddCharacter('oldx_zhangfei', ['male', 'shu', 4, ['paoxiao', 'bilibili_tannang'], ['character:zhangfei', 'die:zhangfei']], 'diy');
	game.HDaddCharacter('oldx_guanyu', ['male', 'shu', 4, ['wusheng', 'bilibili_yishi'], ['character:guanyu', 'die:guanyu']], 'diy');
	game.HDaddCharacter('oldx_zhaoyun', ['male', 'shu', 4, ['longdan', 'yicong'], ['character:zhaoyun', 'die:zhaoyun']], 'diy');
	game.HDaddCharacter('oldx_yujin', ['male', 'wei', 4, ['bilibili_zhengjun'], ['character:yujin', 'die:yujin']], 'diy');
	game.HDaddCharacter('lusu', ['male', 'wu', 3, ['haoshi', 'redimeng'], ['die:re_lusu']], 'diy');
	game.HDaddCharacter('yuanshao', ['male', 'qun', 4, ['oldluanji', 'xueyi'], ['zhu']], 'diy');
	game.HDaddCharacter('old_yj_ganning', ['male', 'qun', 4, ['bilibili_jinfan', 'bilibili_sheque'], ['die:yj_ganning']], 'diy');

	//precS
	//技能修改
	//魅步
	lib.skill.meibu.content = function () {
		var target = trigger.player;
		target.addTempSkill('meibu_range');
		target.storage.meibu_range = player;
		target.markSkillCharacter('meibu_range', player, '魅步', '锦囊牌均视为【杀】且' + get.translation(player) + '视为在攻击范围内');
	};
	lib.skill.meibu.subSkill.range = {
		charlotte: true,
		onremove: true,
		mod: {
			cardname(card) {
				if (get.itemtype(card) == 'card' && (get.type(card, null, false) == 'trick' || get.type(card, null, false) == 'delay')) return 'sha';
			},
			targetInRange(card, player, target) {
				if (!player.storage.meibu_range) return;
				if (target == player.storage.meibu_range) return true;
			},
		},
	};
	lib.translate.meibu_info = '其他角色的出牌阶段开始时，若你不在其攻击范围内，你可以令该角色的锦囊牌均视为【杀】直到回合结束。若如此做，本回合你视为在其攻击范围内。';
	//周处
	lib.skill._xianghai = {
		charlotte: true,
		trigger: { player: ['useCard1', 'respond'] },
		filter(event, player) {
			if (!player.hasSkill('xianghai')) return false;
			return event.card.name == 'jiu' && !event.skill && event.cards?.length == 1 && get.type(event.cards[0]) == 'equip';
		},
		priority: 15,
		direct: true,
		content() { player.logSkill('xianghai') },
	};
	//暴怒战神
	lib.skill._shenji = {
		charlotte: true,
		trigger: { player: 'useCard1' },
		filter(event, player) {
			if (!player.hasSkill('shenji')) return false;
			return event.card.name == 'sha' && (event.targets.length > 1 || player.countUsed('sha', true) > 1);
		},
		priority: 15,
		direct: true,
		content() { player.logSkill('shenji') },
	};
	//神张角
	delete lib.skill.yizhao.intro.markcount;
	Object.assign(lib.skill.yizhao, {
		filter(event, player) {
			return typeof get.number(event.card) == 'number' && (player.countMark('yizhao') < 184 || !lib.config.extension_活动武将_ShenZhangJiao);
		},
		content() {
			'step 0'
			event.num = player.countMark('yizhao');
			player.addMark('yizhao', Math.min(get.number(trigger.card), (lib.config.extension_活动武将_ShenZhangJiao ? 184 - player.countMark('yizhao') : get.number(trigger.card))));
			'step 1'
			var num = Math.floor(num / 10) % 10, num2 = Math.floor(player.countMark('yizhao') / 10) % 10;
			if (num != num2) {
				var card = get.cardPile2(card => {
					return get.number(card, false) == num2;
				});
				if (card) player.gain(card, 'gain2');
				else {
					player.chat('无牌可得？！');
					game.log('但是牌堆中已经没有点数为', '#y' + num2, '的牌了！');
				}
			}
		},
	});
	//左慈
	lib.skill.rehuashen.drawCharacter = function (player, list) {
		game.broadcastAll(function (player, list) {
			player.$draw(list.map(function (name) {
				if (!player.isUnderControl(true)) return game.createCard('huashen_unknown', ' ', ' ');
				var cardname = 'huashen_card_' + name;
				lib.card[cardname] = {
					fullimage: true,
					image: 'character:' + name
				}
				lib.translate[cardname] = get.rawName2(name);
				return game.createCard(cardname, ' ', ' ');
			}), 'nobroadcast');
		}, player, list);
	};
	//YYDSの蔡阳
	Object.assign(lib.skill.yinka, {
		charlotte: true,
		trigger: { global: ['drawBegin', 'judgeBegin'] },
		firstDo: true,
		group: 'yinka_view',
		subSkill: {
			view: {
				ai: {
					viewHandcard: true,
					skillTagFilter: (player, arg, target) => target != player,
				},
			},
		},
	});
	//星黄忠
	lib.skill.spshidi.intro.markcount = storage => (storage || 0) % 2 == 0 ? '攻' : '守';
	//滕芳兰
	Object.assign(lib.skill.luochong, {
		async cost(event, trigger, player) {
			const result = await player.bilibili_chooseTargetControl({
				prompt: get.prompt2(event.skill),
				filterTarget(card, player, target) {
					const storage1 = player.getStorage('luochong_round', [[], []]), storage2 = player.getStorage('luochong');
					return Array.from({ length: 4 }).map((_, i) => i).some(i => {
						if (storage2.includes(i)) return false;
						return !storage1[0].includes(i) && !storage1[1].includes(target) && lib.skill.luochong.filterx[i](target);
					});
				},
				controls: ['回复体力', '失去体力', '弃牌', '摸牌'],
				filterControl(control, player, event) {
					if (!ui.selected.targets.length) return false;
					const target = ui.selected.targets.at(-1);
					const storage1 = player.getStorage('luochong_round', [[], []]), storage2 = player.getStorage('luochong');
					const i = event.controls.indexOf(control);
					if (storage2.includes(i)) return false;
					return !storage1[0].includes(i) && !storage1[1].includes(target) && lib.skill.luochong.filterx[i](target);
				},
				processAI() {
					const player = get.player();
					const func = [
						target => get.recoverEffect(target, player, player),
						target => get.effect(target, { name: 'losehp' }, player, player),
						target => {
							let num = target.countDiscardableCards(player, 'he');
							return Math.sqrt(Math.min(2, num)) * get.effect(target, { name: 'guohe_copy2' }, player, player);
						},
						target => get.effect(target, { name: 'draw' }, player, player),
					];
					const storage1 = player.getStorage('luochong_round', [[], []]), storage2 = player.getStorage('luochong');
					const list = game.filterPlayer(target => {
						return Array.from({ length: 4 }).map((_, i) => i).some(i => {
							if (storage2.includes(i)) return false;
							return !storage1[0].includes(i) && !storage1[1].includes(target) && lib.skill.luochong.filterx[i](target);
						});
					}).map(target => {
						let index = undefined, max = undefined;
						for (const num of Array.from({ length: 4 }).map((_, i) => i).filter(i => {
							if (storage2.includes(i)) return false;
							return !storage1[0].includes(i) && !storage1[1].includes(target) && lib.skill.luochong.filterx[i](target);
						})) {
							const num2 = func[num](target);
							if (max === undefined || max < num2) {
								index = num;
								max = num2;
							}
						}
						return [target, index, max];
					}).sort((a, b) => b[2] - a[2])[0];
					const index = list[1], control = get.event().controls[list[1]];
					return { bool: control !== 'cancel2', targets: [list[0]], control, index };
				},
			}).forResult();
			if (result?.bool && result.targets?.length) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: [result.index],
				};
			}
		},
	});
	//族杨彪
	Object.assign(lib.skill.clanjiannan.subSkill.effect, {
		async cost(event, trigger, player) {
			const map = { '弃牌': 'discard', '摸牌': 'draw', '重铸装备牌': 'recast', '置于牌堆顶': 'put' };
			const result = await player.bilibili_chooseTargetControl({
				prompt: '###间难###<div class="text center">令一名角色执行本回合未执行过的一项</div>',
				controls: ['弃牌', '摸牌', '重铸装备牌', '置于牌堆顶'],
				filterControl(control, player, event) {
					return ui.selected.targets.length > 0 && !player.getStorage('clanjiannan_used').includes(event.map[control]);
				},
				forced: true,
				processAI() {
					const { player, map, controls } = get.event();
					const getNum = function (control) {
						switch (map[control]) {
							case 'discard':
								if (game.hasPlayer(target => {
									const att = get.attitude(player, target);
									return att < 0 && target.countCards('he');
								})) return 2;
								break;
							case 'draw': return 4;
							case 'recast':
								if (player.hasCard(card => get.type(card) === 'equip', 'he')) return 3;
								break;
							case 'put':
								if (game.hasPlayer(target => {
									const att = get.attitude(player, target);
									return att < 0 && target.hp <= 1 && target.countCards('h') <= 3;
								})) return 5;
								break;
						}
						return 1;
					};
					const control = [...controls].sort((a, b) => getNum(b) - getNum(a))[0];
					const getNum2 = function (target) {
						const att = get.attitude(player, target);
						return att * (target === player ? 3 : 1) * (['draw', 'recast'].includes(map[control]) ? 1 : -1);
					};
					const target = game.filterPlayer().sort((a, b) => getNum2(b) - getNum2(a))[0];
					return { bool: true, targets: [target], control, index: controls.indexOf(control) };
				},
				map,
			}).forResult();
			if (result?.bool && result.targets?.length) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: { link: map[result.control] },
				};
			}
		},
	});

	//precT
	//翻译
	//删除翻译
	delete lib.translate.dc_xiahouhui_prefix;
	Object.assign(lib.translate, {
		//修改武将翻译
		//手杀前缀
		re_sunben: '手杀界孙策',
		re_sunben_prefix: '手杀界',
		//新杀前缀
		dc_zhuling: '新杀朱灵',
		dc_zhuling_prefix: '新杀',
		//其他前缀
		jsrg_sunlubansunluyu: '合孙鲁班孙鲁育',
		jsrg_sunlubansunluyu_ab: '合大小虎',
		//取消前缀
		gz_dengzhi: '邓芝',
		gz_miheng: '祢衡',
		dc_xiahouhui: '夏侯徽',
		gz_huangzu: '黄祖',
		gz_liuba: '刘巴',

		//添加武将翻译
		old_clan_xunchen: `${get.poptip('rule_mamba')}荀谌`,
		old_clan_xunchen_prefix: get.poptip('rule_mamba'),
		old_clan_xuncai: `${get.poptip('rule_mamba')}荀采`,
		old_clan_xuncai_prefix: get.poptip('rule_mamba'),
		old_clan_xuncan: `${get.poptip('rule_mamba')}荀粲`,
		old_clan_xuncan_prefix: get.poptip('rule_mamba'),
		old_shen_xunyu: `${get.poptip('rule_mamba')}神荀彧`,
		old_shen_xunyu_prefix: `${get.poptip('rule_mamba')}|神`,
		old_shen_taishici: `${get.poptip('rule_mamba')}神太史慈`,
		old_shen_taishici_prefix: `${get.poptip('rule_mamba')}|神`,
		old_shen_sunce: `${get.poptip('rule_mamba')}神孙策`,
		old_shen_sunce_prefix: `${get.poptip('rule_mamba')}|神`,
		old_zhangyì: `${get.poptip('rule_mamba')}张翼`,
		old_zhangyì_prefix: get.poptip('rule_mamba'),
		old_yanghuiyu: `${get.poptip('rule_mamba')}羊徽瑜`,
		old_yanghuiyu_prefix: get.poptip('rule_mamba'),
		junk_zhangrang: '新杀张让',
		junk_zhangrang_prefix: '新杀',
		bolx_jsp_guanyu: '★SP关羽',
		bolx_jsp_guanyu_prefix: '★SP',
		bol_sunluban: '用间孙鲁班',
		bol_sunluban_prefix: '用间',
		old_yj_ganning: '☆甘宁',
		old_yj_ganning_prefix: '☆',
		old_xunchen: `${get.poptip('rule_mamba')}荀谌`,
		old_xunchen_prefix: get.poptip('rule_mamba'),
		old_liuzhang: `${get.poptip('rule_mamba')}刘璋`,
		old_liuzhang_prefix: get.poptip('rule_mamba'),
		old_sp_sunshao: `${get.poptip('rule_mamba')}孙邵`,
		old_sp_sunshao_prefix: get.poptip('rule_mamba'),
		old_zhaoxiang: `${get.poptip('rule_mamba')}赵襄`,
		old_zhaoxiang_prefix: get.poptip('rule_mamba'),
		old_bulianshi: '手杀步练师',
		old_bulianshi_prefix: '手杀',
		ol_yuanshu: '手杀袁术',
		ol_yuanshu_prefix: '手杀',
		old_yuanshu: '手杀界袁术',
		old_yuanshu_prefix: '手杀界',
		old_wangling: `${get.poptip('rule_mamba')}王淩`,
		old_wangling_prefix: get.poptip('rule_mamba'),
		old_sp_huaxin: `${get.poptip('rule_mamba')}华歆`,
		old_sp_huaxin_prefix: get.poptip('rule_mamba'),
		old_sp_kongrong: `${get.poptip('rule_mamba')}孔融`,
		old_sp_kongrong_prefix: get.poptip('rule_mamba'),
		old_sp_mifuren: `${get.poptip('rule_mamba')}糜夫人`,
		old_sp_mifuren_prefix: get.poptip('rule_mamba'),
		old_zhouchu: `${get.poptip('rule_mamba')}周处`,
		old_zhouchu_prefix: get.poptip('rule_mamba'),
		old_sb_ganning: `${get.poptip('rule_mamba')}甘宁`,
		old_sb_ganning_prefix: get.poptip('rule_mamba'),
		old_zhangbao: `${get.poptip('rule_mamba')}张宝`,
		old_zhangbao_prefix: get.poptip('rule_mamba'),
		old_sunluyu: `${get.poptip('rule_mamba')}孙鲁育`,
		old_sunluyu_prefix: get.poptip('rule_mamba'),
		old_ol_xiaoqiao: `${get.poptip('rule_mamba')}界小乔`,
		old_ol_xiaoqiao_prefix: `${get.poptip('rule_mamba')}|界`,
		old_zhanghe: '张郃',
		old_zhugejin: '诸葛瑾',
		ol_maliang: '手杀马良',
		ol_maliang_prefix: '手杀',
		junk_duanwei: `${get.poptip('rule_mamba')}段煨`,
		junk_duanwei_prefix: get.poptip('rule_mamba'),
		oldx_zhangfei: '张翼德',
		oldx_guanyu: '关云长',
		oldx_zhaoyun: '赵子龙',
		oldx_yujin: '于文则',
		old_yuanji: `${get.poptip('rule_mamba')}袁姬`,
		old_yuanji_prefix: get.poptip('rule_mamba'),
		bfake_yangfu: '杨阜',
		bfake_zuoci: '谋左慈',
		bfake_zuoci_prefix: '谋',
		bfake_chengpu: '程普',
		bfake_sundeng: '孙登',
		old_shen_sunquan: 'OL神孙权',
		old_shen_sunquan_prefix: 'OL|神',
		old_shen_ganning: '神甘宁',
		old_shen_ganning_prefix: '神',
		bol_sp_huaxin: 'TW华歆',
		bol_sp_huaxin_prefix: 'TW',
		bfake_chengui: '陈珪',
		old_zhangzhongjing: `${get.poptip('rule_mamba')}张机`,
		old_zhangzhongjing_prefix: get.poptip('rule_mamba'),
		oldx_zhangzhongjing: `${get.poptip('rule_mamba')}张机`,
		oldx_zhangzhongjing_prefix: get.poptip('rule_mamba'),
		bol_zhangzhongjing: 'TW张机',
		bol_zhangzhongjing_prefix: 'TW',
		ol_shen_dianwei: 'OL神典韦',
		ol_shen_dianwei_prefix: 'OL神',
		old_ol_yuanji: `${get.poptip('rule_mamba')}OL袁姬`,
		old_ol_yuanji_prefix: `${get.poptip('rule_mamba')}|OL`,
		'#ext:活动武将/audio/die/old_xunchen:die': '点击播放阵亡配音',
		old_sp_jianggan: `${get.poptip('rule_mamba')}蒋干`,
		old_sp_jianggan_prefix: get.poptip('rule_mamba'),
		lusu: '鲁肃',
		yuanshao: '袁绍',
		old_wanglang: '手杀王朗',
		old_wanglang_prefix: '手杀',
		old_shixie: '手杀士燮',
		old_shixie_prefix: '手杀',
		old_zhangxingcai: '手杀张星彩',
		old_zhangxingcai_prefix: '手杀',
		old_huatuo: 'OL界华佗',
		old_huatuo_prefix: 'OL|界',
		ol_huaxiong: '手杀界华雄',
		ol_huaxiong_prefix: '手杀|界',
		'#junk_guanyu:die': '点击播放阵亡配音',
		ol_shen_guanyu: 'OL神关羽',
		ol_shen_guanyu_prefix: 'OL|神',
		mb_shen_caocao: '手杀神曹操',
		mb_shen_caocao_prefix: '手杀|神',
		old_sb_zhanghe: `${get.poptip('rule_mamba')}谋张郃`,
		old_sb_zhanghe_prefix: `${get.poptip('rule_mamba')}|谋`,
		old_peixiu: `${get.poptip('rule_mamba')}裴秀`,
		old_peixiu_prefix: get.poptip('rule_mamba'),

		//武将分包翻译
		bilibili_buchong_online: '武将补充·Online',
		bilibili_buchong_yijiang: '武将补充·一将成名',
		bilibili_buchong_mobile: '武将补充·移动服',
		bilibili_buchong_online2: '武将补充·Online',
		bilibili_buchong_yijiang2: '武将补充·一将成名',
		bilibili_buchong_mobile2: '武将补充·移动服',
		bilibili_buchong_shenhua: '武将补充·神话再临',
		bilibili_buchong_menfashizu: '武将补充·门阀士族',

		//技能翻译
		weipo: '横虑',
		dcliuzhuan_tag: '流转',
		dcliuzhuan_info: '锁定技，其他角色的回合内，其于摸牌阶段外获得的牌无法对你使用，这些牌本回合进入弃牌堆后，你获得之。',
		zunwei_info: '出牌阶段限一次，你可以：①将体力值回复至与一名其他角色相同；②将手牌数摸至与一名其他角色相同（至多摸五张）；③为空装备栏使用牌堆中的装备牌直至你装备区里的牌数与一名其他角色相等。（每个选项每局限选择一次）',
		olpaoxiao_info: '锁定技。①你使用【杀】无次数限制。②当你使用的【杀】被【闪】抵消后，你令本回合下一次因【杀】造成的伤害+X（X为造成伤害前的抵消次数）。',
		sbliegong_info: '若你的装备区内没有武器牌，则你手牌区内所有【杀】的属性视为无属性。当你使用牌时或成为其他角色使用牌的目标后，若此牌有花色且你未记录此牌的花色，你记录此牌的花色。当你使用【杀】指定唯一目标后，若〖烈弓〗存在记录花色，则你可亮出牌堆顶的X张牌（X为〖烈弓〗记录过的花色数-1），令此【杀】的伤害值基数+Y（Y为亮出牌中被〖烈弓〗记录过花色的牌的数量），且目标角色不能使用〖烈弓〗记录过花色的牌响应此【杀】。此【杀】使用结算结束后，你清除〖烈弓〗记录的的花色。',
	});

	//precCT
	//武将称号
	Object.assign(lib.characterTitle, {
		bol_sunluban: '测试专用，问题居多<br>仅供参考，娱乐为上',
		old_zhangzhongjing: '第一版张仲景',
		oldx_zhangzhongjing: '第三版张仲景',
		bol_zhangzhongjing: '仁望值弃稿',
		bol_sp_huaxin: '仁望值弃稿',
	});

	//含衍生技的技能翻译优化
	if (game.getExtensionConfig('活动武将', 'showDerivation')) {
		const setSkillDerivation = skills => {
			let skills2 = [], skills3 = skills.slice();
			while (true) {
				let skills4 = skills3
					.filter(skill => lib.skill[skill]?.derivation)
					.map(skill => lib.skill[skill].derivation)
					.flat()
					.filter(skill => !skills3.includes(skill));
				if (skills4.length > 0) {
					skills2.addArray(skills4);
					skills3.addArray(skills4);
				}
				else break;
			}
			if (skills2.length > 0) {
				for (let skill of skills3) {
					let str = lib.translate[`${skill}_info`];
					if (str?.includes('〖')) {
						lib.translate[`${skill}_info`] = str.replace(/〖(.*?)〗/g, (skillString, skillName) => {
							const skill2 = skills2.find(i => {
								if (i === skill) return false;
								return lib.translate[`${i}_info`] && lib.translate[i] === skillName;
							});
							return skill2 ? get.poptip(skill2) : skillString;
						});
					}
				}
			}
		};
		for (const name in lib.character) setSkillDerivation(get.character(name).skills);
		const originConvertedCharacter = get.convertedCharacter;
		get.convertedCharacter = function () {
			const data = originConvertedCharacter.apply(this, arguments);
			setSkillDerivation(data.skills);
			return data;
		};
	}

}