import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    return {
        name: "界周妃",
        content: function (config, pack) {

        },
        precontent: function () {

        },
        config: {},
        help: {},
        package: {
            character: {
                character: {
                    mb_zhoufei: ['female', 'wu', 3, ['mbliangyin', 'mbkongsheng']],
                },
                translate: {
                    mb_zhoufei: '界周妃',
                    mb_zhoufei_prefix: '界',
                },
            },
            card: {
                card: {},
                translate: {},
                list: [],
            },
            skill: {
                skill: {
				mbliangyin: {
				audio: 2,
					group: ['mbliangyin_put', 'mbliangyin_gain', 'mbliangyin_round'],
					getTargets: function (player) {
						var ids = player.storage.mbliangyin_targets;
						if (!Array.isArray(ids)) return [];
						return game.filterPlayer(function (current) {
							return ids.contains(current.playerid);
						});
					},
					recordTarget: function (player, target) {
						if (!Array.isArray(player.storage.mbliangyin_targets)) {
							player.storage.mbliangyin_targets = [];
						}
						player.storage.mbliangyin_targets.add(target.playerid);
						if (player.syncStorage) player.syncStorage('mbliangyin_targets');
					},
					clearTargets: function (player) {
						delete player.storage.mbliangyin_targets;
						if (player.syncStorage) player.syncStorage('mbliangyin_targets');
					},
					isInsideLoseAsync: function (event) {
						var current = event;
						for (var i = 0; i < 8; i++) {
							if (!current || !current.getParent) break;
							current = current.getParent();
							if (!current) break;
							if (current.name == 'loseAsync') return true;
						}
						return false;
					},
					getExpansionGainCards: function (event) {
						if (!event || !event.getl) return [];
						var lost = [];
						var gained = [];
						var list = game.players.slice(0).concat(game.dead || []);
						for (var i = 0; i < list.length; i++) {
							var loseInfo = event.getl(list[i]);
							if (loseInfo && loseInfo.xs && loseInfo.xs.length) lost.addArray(loseInfo.xs);
						}
						if (event.name == 'gain') {
							if (event.cards && event.cards.length) gained.addArray(event.cards);
						}
						else if (event.getg) {
							for (var j = 0; j < list.length; j++) {
								var gainCards = event.getg(list[j]);
								if (gainCards && gainCards.length) gained.addArray(gainCards);
							}
						}
						return lost.filter(function (card) {
							return gained.contains(card);
						});
					}
				},

				mbliangyin_put: {
					trigger: { global: 'addToExpansionAfter' },
					direct: true,
					filter: function (event, player) {
						if (!event.cards || !event.cards.length) return false;
						return event.cards.some(function (card) {
							return get.position(card, true) == 'x';
						});
					},
					content: function () {
						'step 0'
						player.chooseTarget(get.prompt('mbliangyin'), '令一名角色摸一张牌').set('ai', function (target) {
							return get.attitude(_status.event.player, target);
						});
						'step 1'
						if (result.bool) {
							var target = result.targets[0];
							player.logSkill('mbliangyin', target);
							lib.skill.mbliangyin.recordTarget(player, target);
							target.draw();
						}
					}
				},

				mbliangyin_gain: {
					trigger: { global: ['gainAfter', 'loseAsyncAfter'] },
					direct: true,
					filter: function (event, player) {
						if (event.name == 'gain' && lib.skill.mbliangyin.isInsideLoseAsync(event)) return false;
						return lib.skill.mbliangyin.getExpansionGainCards(event).length > 0 && game.hasPlayer(function (current) {
							return current.countCards('he') > 0;
						});
					},
					content: function () {
						'step 0'
						player.chooseTarget(get.prompt('mbliangyin'), '令一名角色弃置一张牌', function (card, player, target) {
							return target.countCards('he') > 0;
						}).set('ai', function (target) {
							return -get.attitude(_status.event.player, target) * Math.sqrt(Math.max(1, target.countCards('he')));
						});
						'step 1'
						if (result.bool) {
							var target = result.targets[0];
							player.logSkill('mbliangyin', target);
							lib.skill.mbliangyin.recordTarget(player, target);
							target.chooseToDiscard('he', true);
						}
					}
				},

				mbliangyin_round: {
					trigger: { global: 'roundFinish' },
					direct: true,
					filter: function (event, player) {
						return Array.isArray(player.storage.mbliangyin_targets);
					},
					content: function () {
						'step 0'
						var ids = player.storage.mbliangyin_targets || [];
						var alive = game.filterPlayer();
						event.targeted = alive.filter(function (current) {
							return ids.contains(current.playerid);
						});
						event.untargeted = alive.filter(function (current) {
							return !ids.contains(current.playerid);
						});
						lib.skill.mbliangyin.clearTargets(player);
						event.controls = [];
						event.promptText = '良姻：';
						if (event.targeted.length == 1) {
							event.controls.push('回复体力');
							event.promptText += '令' + get.translation(event.targeted[0]) + '回复1点体力';
						}
						if (event.untargeted.length == 1) {
							if (event.controls.length) event.promptText += '，或';
							event.controls.push('失去体力');
							event.promptText += '令' + get.translation(event.untargeted[0]) + '失去1点体力';
						}
						if (!event.controls.length) {
							event.finish();
							return;
						}
						event.controls.push('cancel2');
						player.chooseControl(event.controls).set('prompt', event.promptText).set('ai', function () {
							var evt = _status.event.getParent();
							var best = 'cancel2';
							var value = 0;
							if (evt.targeted.length == 1) {
								var recoverValue = get.attitude(player, evt.targeted[0]) * (evt.targeted[0].isDamaged() ? 2 : 0.1);
								if (recoverValue > value) {
									value = recoverValue;
									best = '回复体力';
								}
							}
							if (evt.untargeted.length == 1) {
								var loseValue = -get.attitude(player, evt.untargeted[0]) * 2;
								if (loseValue > value) best = '失去体力';
							}
							return best;
						});
						'step 1'
						if (result.control == 'cancel2') return;
						if (result.control == '回复体力' && event.targeted.length == 1) {
							player.logSkill('mbliangyin', event.targeted[0]);
							event.targeted[0].recover();
						}
						else if (result.control == '失去体力' && event.untargeted.length == 1) {
							player.logSkill('mbliangyin', event.untargeted[0]);
							event.untargeted[0].loseHp();
						}
					}
				},

				mbkongsheng: {
				audio: 2,
					group: ['mbkongsheng_place', 'mbkongsheng_resolve'],
					canUseCard: function (player, card) {
						if (!card || !get.info(card)) return false;
						if (!lib.filter.cardEnabled(card, player) || !lib.filter.cardUsable(card, player)) return false;
						if (get.info(card).notarget) return true;
						return player.hasUseTarget(card, null, true);
					},
					addBatch: function (target, owner, cards) {
						if (!Array.isArray(target.storage.mbkongsheng_batches)) {
							target.storage.mbkongsheng_batches = [];
						}
						target.storage.mbkongsheng_batches.push({
							owner: owner.playerid,
							cards: cards.map(function (card) { return card.cardid; })
						});
						if (target.syncStorage) target.syncStorage('mbkongsheng_batches');
					},
					getBatchCards: function (target, batch) {
						var expansions = target.getExpansions('mbkongsheng_card');
						return expansions.filter(function (card) {
							return batch.cards.contains(card.cardid);
						});
					},
					removeOwnerBatches: function (target, owner) {
						var storage = target.storage.mbkongsheng_batches;
						if (!Array.isArray(storage)) return [];
						var result = storage.filter(function (batch) {
							return batch.owner == owner.playerid;
						});
						target.storage.mbkongsheng_batches = storage.filter(function (batch) {
							return batch.owner != owner.playerid;
						});
						if (target.syncStorage) target.syncStorage('mbkongsheng_batches');
						return result;
					},
					clearMarkIfEmpty: function (target) {
						if (!target.getExpansions('mbkongsheng_card').length) {
							target.unmarkSkill('mbkongsheng_card');
						}
					}
				},

				mbkongsheng_place: {
					sourceSkill: 'mbkongsheng',
					trigger: { player: ['phaseZhunbeiBegin', 'recoverAfter', 'loseHpAfter'] },
					direct: true,
					filter: function (event, player) {
						var current = _status.currentPhase;
						return current && current.isIn() && current.countCards('he') > 0;
					},
					content: function () {
						'step 0'
						event.current = _status.currentPhase;
						var prompt = get.prompt('mbkongsheng') + '：将' + get.translation(event.current) + '任意张牌扣置于其武将牌上';
						if (event.current == player) {
							player.chooseCard('he', [1, Infinity], prompt).set('ai', function (card) {
								var player = _status.event.player;
								if (get.type(card) == 'equip' && player.hasUseTarget(card)) return 4 - get.value(card);
								return 6 - get.value(card);
							});
						}
						else {
							player.choosePlayerCard(event.current, 'he', [1, Infinity], prompt).set('ai', function (button) {
								var owner = get.owner(button.link);
								var attitude = get.attitude(_status.event.player, owner);
								return attitude > 0 ? 6 - get.value(button.link, owner) : get.value(button.link, owner);
							});
						}
						'step 1'
						var selected = result.cards || result.links;
						if (!result.bool || !selected || !selected.length) return;
						event.cards = selected.slice(0);
						player.logSkill('mbkongsheng', event.current);
						lib.skill.mbkongsheng.addBatch(event.current, player, event.cards);
						var next = event.current.addToExpansion(event.cards, 'giveAuto');
						next.gaintag.add('mbkongsheng_card');
					}
				},

				mbkongsheng_resolve: {
					sourceSkill: 'mbkongsheng',
					trigger: { global: 'phaseJieshuBegin' },
					direct: true,
					filter: function (event, player) {
						var storage = event.player.storage.mbkongsheng_batches;
						if (!Array.isArray(storage)) return false;
						return storage.some(function (batch) {
							return batch.owner == player.playerid;
						});
					},
					content: function () {
						'step 0'
						event.current = trigger.player;
						event.batches = lib.skill.mbkongsheng.removeOwnerBatches(event.current, player);
						event.index = 0;
						'step 1'
						if (event.index >= event.batches.length) {
							lib.skill.mbkongsheng.clearMarkIfEmpty(event.current);
							event.finish();
							return;
						}
						event.batch = event.batches[event.index++];
						event.batchCards = lib.skill.mbkongsheng.getBatchCards(event.current, event.batch);
						if (!event.batchCards.length) {
							event.goto(1);
							return;
						}
						event.usableCards = event.batchCards.filter(function (card) {
							return lib.skill.mbkongsheng.canUseCard(player, card);
						});
						if (!event.usableCards.length) {
							event.goto(4);
							return;
						}
						player.chooseButton(['箜声：你可以使用其中一张牌', event.usableCards], [0, 1]).set('filterButton', function (button) {
							return lib.skill.mbkongsheng.canUseCard(_status.event.player, button.link);
						}).set('ai', function (button) {
							return _status.event.player.getUseValue(button.link);
						});
						'step 2'
						if (result.bool && result.links && result.links.length) {
							event.useCard = result.links[0];
							player.logSkill('mbkongsheng', event.current);
							player.chooseUseTarget(event.useCard, true);
						}
						else {
							event.goto(4);
						}
						'step 3'
						'step 4'
						var remaining = lib.skill.mbkongsheng.getBatchCards(event.current, event.batch);
						if (remaining.length) event.current.gain(remaining, 'gain2', 'log');
						'step 5'
						lib.skill.mbkongsheng.clearMarkIfEmpty(event.current);
						event.goto(1);
					}
				},

				mbkongsheng_card: {
					charlotte: true,
					mark: true,
					marktext: '箜',
					intro: {
						content: function (storage, player) {
							return '共有' + get.cnNumber(player.getExpansions('mbkongsheng_card').length) + '张扣置的“箜声”牌';
						},
						markcount: function (storage, player) {
							return player.getExpansions('mbkongsheng_card').length;
						}
					}
				}
                },
                translate: {
                    mbliangyin: '良姻',
                    mbliangyin_info: '当有牌被置于武将牌上时，你可以令一名角色摸一张牌；当任意角色获得一名角色武将牌上的牌时，你可以令一名角色弃置一张牌。每轮结束时，你可以令本轮内：唯一成为“良姻”目标的角色回复1点体力，或唯一未成为“良姻”目标的角色失去1点体力。',
                    mbkongsheng: '箜声',
                    mbkongsheng_place: '箜声',
                    mbkongsheng_resolve: '箜声',
                    mbkongsheng_info: '准备阶段，或你回复或失去体力后，你可以将当前回合角色任意张牌扣置于其武将牌上；其结束阶段，你可以使用其中一张牌，其获得其余的牌。',
                    mbkongsheng_card: '箜声',
                },
            },
            intro: '适用于无名杀十周年β版的三国杀移动版界周妃武将拓展。',
            author: 'soyo',
            diskURL: '',
            forumURL: '',
            version: '1.0.2',
        },
        files: {
            character: ['mb_zhoufei.jpg'],
            card: [],
            skill: [],
        },
    };
};
