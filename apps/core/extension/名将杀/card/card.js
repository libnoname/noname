import { lib, game, ui, get, ai, _status } from "noname";

const card = {
	//龙泉剑：武器，攻击范围2，当你受到伤害后，可以削弱伤害来源的2张牌。
	mjslongquanjian: {
		fullskin: true,
	    derivation: "mjs_zhanghua",
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -1,
	    },
	    skills: ["mjslongquanjian_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 4.5,
	    	},
	    },
	},
	//太阿剑：武器，攻击范围2，当你造成伤害后，可以削弱目标的2张牌。
	mjstaiejian: {
		fullskin: true,
	    derivation: "mjs_zhanghua",
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -1,
	    },
	    skills: ["mjstaiejian_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 4.5,
	    	},
	    },
	},
	//渠
	mjsqu: {
		fullskin: true,
		derivation: "mjs_zhengguo",
		global: ["g_mjsqu"],
		ai: {
	        value: 0,
	        useful: 0,
	    },
	},
	//义兵
	mjsyibing: {
		fullskin: true,
		derivation: "mjs_weijiu",
	    global: ["g_mjsyibing", "g_mjsyibing_use"],
	    ai: {
	        basic: {
	            useful: [5,3,1],
	            value: [5,3,1],
	        },
	    },
	},
	//玉钩
	mjsyugou: {
		fullskin: true,
	    derivation: "mjs_zhaojieyu",
	    global: ["g_mjsyugou"],
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjsyugou_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	    onLose() {
	    	if (player.storage?.counttrigger?.mjsyugou_skill) {
	    		delete player.storage.counttrigger.mjsyugou_skill;
	    	}
	    },
	},
	//虎
	mjshu: {
		fullskin: true,
	    derivation: "mjs_menghuo",
	    type: "equip",
	    subtype: "equip3",
	    skills: ["mjshu_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	},
	//蛇
	mjsshe: {
		fullskin: true,
	    derivation: "mjs_menghuo",
	    type: "equip",
	    subtype: "equip3",
	    skills: ["mjsshe_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	},
	//鳄
	mjse: {
		fullskin: true,
	    derivation: "mjs_menghuo",
	    type: "equip",
	    subtype: "equip3",
	    skills: ["mjse_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	},
	//鹰
	mjsying: {
		fullskin: true,
	    derivation: "mjs_menghuo",
	    type: "equip",
	    subtype: "equip3",
	    skills: ["mjsying_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	},
	//象
	mjsxiang: {
		fullskin: true,
	    derivation: "mjs_menghuo",
	    type: "equip",
	    subtype: "equip3",
	    skills: ["mjsxiang_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 10,
	    	},
	    },
	    onLose() {
	    	//player.mjsContractEquip(2);
	    	const next = game.createEvent("mjsContractEquipLose");
    		next.player = player;
    		next.setContent("mjsContractEquipLose");
	    },
	},
	//丹砂
	mjsdansha: {
	    fullskin: true,
	    derivation: "mjs_baqing",
	    enable: true,
	    usable: 1,
	    selectTarget: 1,
	    filterTarget(card, player, target) {
	        return target !== player;
	    },
	    async content(event, trigger, player) {
	    	const target = event.target;
	    	if (event.cards?.length) {
	            await target.gain(event.cards, "gain2");
	        }
	        if (target.countGainableCards(player, "he")) {
	        	await player.gainPlayerCard(target, "hej", true);
	        }
	    },
	    get ai() {
	    	return lib.card.shunshou.ai;
	    },
	},
	//传国玉玺
	mjschuanguoyuxi: {
	    fullskin: true,
	    derivation: "mjs_yuanshu",
	    global: ["g_mjschuanguoyuxi"],
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjschuanguoyuxi_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 15,
	    	},
	    },
	},
	//吕氏春秋
	mjslvshichunqiu: {
	    fullskin: true,
	    derivation: "mjs_lvbuwei",
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjslvshichunqiu_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 4,
	    	},
	    },
	},
	//徐夫人匕首
	mjsxufurenbishou: {
	    fullskin: true,
	    derivation: "mjs_jingke",
	    global: ["g_mjsxufurenbishou"],
	    type: "equip",
	    subtype: "equip1",
	    skills: ["mjsxufurenbishou_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 2,
	    	},
	    },
	    onEquip() {
	    	player.addSkill("mjsxufurenbishou_sha");
            player.addMark("mjsxufurenbishou_sha", 1, false);
            game.log(player, "的", "#g出杀次数", "#y+" + 1);
	    },
	},
	//笞
	mjschi: {
		fullskin: true,
		derivation: "mjs_caoren",
	    enable: true,
    	notarget: true,
	    global: "g_mjschi",
	    async content(event, trigger, player) {
	        if (player.countCards("he")) {
	        	const cards = player.getCards("he", card => lib.filter.cardDiscardable(card, player, "mjschi"));
	            if (cards.length) {
	                await player.discard(cards.randomGets(1));
	            }
	        }
	    },
	    ai: {
	        value: -5,
	        useful: 0.1,
	        order: 1,
	        result: {
	            player(player, target) {
	            	if (player.countCards("he") >= 6) return 1;
	                return -1;
	            },
	        },
	    },
    },
	//武刚车
	mjswugangche: {
		fullskin: true,
		derivation: "mjs_weiqing",
		type: "equip",
	    subtype: "equip4",
	    distance: {
	        globalFrom: -1,
	    },
	    skills: ["mjswugangche_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 4.5,
	    	},
	    },
	    cardPrompt(card) {
	        if (!card?.skills?.length) {
	            return "应战，目标需要弃置1张手牌，否则令其此杀无效。";
	        }
	        var str = "应战，目标需要弃置1张手牌，否则令其此杀无效。";
	        const skills = card.skills.slice()
	        	.removeArray(lib.card.mjswugangche.skills)
	        	.reduce((list, skill) => list.add(get.sourceSkillFor(skill)), []);
	        for (const skill of skills) {
	        	str += `<br><li>${get.translation(skill)}：${get.skillInfoTranslation(skill)}`;
	        }
	        return str;
	    },
	    /*onEquip() {
	    	if (!card.storage) card.storage = {};
            if (!card.storage?.mjscheqihezhan) card.storage.mjscheqihezhan = [];
            lib.skill.mjscheqihezhan.update(player);
	    },
	    onLose() {
	    	//delete card.storage?.mjscheqihezhan;
	        lib.skill.mjscheqihezhan.update(player);
	    },
	    cardPrompt(card) {
	        if (!card.storage?.mjscheqihezhan) {
	            return "应战，目标需要弃置1张手牌，否则令其此杀无效。";
	        }
	        var str = "应战，目标需要弃置1张手牌，否则令其此杀无效。";
	        card.storage.mjscheqihezhan.forEach(info => {
	        	str += `<br><li>你视为拥有【${get.translation(info)}】的效果。`;
	        });
	        return str;
	    },*/
	},
	//六出奇计
	mjsjuanjinfanjian: {
		cardAudio: {
			mjs_chenping: "ext:名将杀/audio/skill/mjsliuchuqiji3.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_chenping",
	    destroy: true,
	    enable() {
	        return game.countPlayer() > 2;
	    },
	    singleCard: true,
	    filterTarget(card, player, target) {
	        return target !== player;
	    },
	    complexTarget: true,
    	targetprompt: ["受伤角色", "伤害来源"],
    	filterAddedTarget(card, player, target, preTarget) {
	        return target !== preTarget && target !== player;
	    },
	    async content(event, trigger, player) {
	        const target1 = event.target;
	        const target2 = event.addedTarget;
	        if (event.cards?.length) {
	        	await target1.gain(event.cards, "gain2");
	        }
	        await target1.damage(target2);
	    },
	    ai: {
	        order: 10,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	    },
	},
	mjsecaojinshi: {
		cardAudio: {
			mjs_chenping: "ext:名将杀/audio/skill/mjsliuchuqiji4.mp3",
		},
		fullskin: true,
	    type: "trick",
	    enable: true,
	    derivation: "mjs_chenping",
	    destroy: true,
	    filterTarget(card, player, target) {
	        return target != player;
	    },
	    async content(event, trigger, player) {
	        const target = event.target;
	        const cards = target.getCards("h", card => {
                return card.name == "shan" && lib.filter.cardDiscardable(card, target, "mjsyejiexingyang");
            });
            if (cards.length > 0) {
                await target.discard(cards.randomGets(2)).set("discarder", target);
            }
	    },
	    ai: {
	        order: 10,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	    },
	},
	mjsyejiexingyang: {
		cardAudio: {
			mjs_chenping: "ext:名将杀/audio/skill/mjsliuchuqiji5.mp3",
		},
		fullskin: true,
	    type: "trick",
	    enable: true,
	    derivation: "mjs_chenping",
	    destroy: true,
	    filterTarget(card, player, target) {
	        return target != player;
	    },
	    async content(event, trigger, player) {
	        const target = event.target;
	        const cards = target.getCards("h", card => {
                return card.name == "sha" && lib.filter.cardDiscardable(card, target, "mjsyejiexingyang");
            });
            if (cards.length > 0) {
                await target.discard(cards.randomGets(2)).set("discarder", target);
            }
	    },
	    ai: {
	        order: 10,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	    },
	},
	mjsniezuwenxin: {
		cardAudio: {
			mjs_chenping: "ext:名将杀/audio/skill/mjsliuchuqiji6.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_chenping",
	    destroy: true,
	    enable() {
	        return game.countPlayer() > 2;
	    },
	    singleCard: true,
	    filterTarget(card, player, target) {
	        return target !== player && target.countCards("he");
	    },
	    complexTarget: true,
    	targetprompt: ["交出牌", "获得牌"],
    	filterAddedTarget(card, player, target, preTarget) {
	        return target !== preTarget && target !== player;
	    },
	    async content(event, trigger, player) {
	        const target1 = event.target;
	        const target2 = event.addedTarget;
	        if (!target2?.isIn()) {
	        	return;
	        }
	        if (target1.countCards("he")) {
	        	//如果不交出牌的话，将不执行“回复体力”动作
	        	const result = await target1
	        		.chooseToGive(target2, "he")
	        		.set("prompt", "是否交给" + get.translation(target2) + "一张牌" + (target1.isDamaged() ? "并回复1点体力" : "") + "？")
                    .set("ai", card => {
                        const target1 = get.event().player,
                            target2 = get.event().target;
                        const att = get.attitude(target1, target2);
                        if (get.recoverEffect(target1, target1, target1) <= 0) {
                            if (att <= 0) {
                                return -get.value(card);
                            }
                            return 0;
                        }
                        return 7 - get.value(card);
                    })
                    .set("target", target2)
	        		.forResult();
	        	if (result?.bool) {
	        		await target1.recover();
	        	}
	        }
	    },
	    ai: {
	        order: 10,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	    },
	},
	mjsyouyunmengze: {
		cardAudio: {
			mjs_chenping: "ext:名将杀/audio/skill/mjsliuchuqiji7.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_chenping",
	    destroy: true,
	    enable() {
	        return game.countPlayer() > 2;
	    },
	    singleCard: true,
	    filterTarget(card, player, target) {
	        return target !== player && target.countCards("he");
	    },
	    complexTarget: true,
    	targetprompt: ["失去牌", "获得牌"],
    	filterAddedTarget(card, player, target, preTarget) {
	        return target !== preTarget && target !== player;
	    },
	    async content(event, trigger, player) {
	        const target1 = event.target;
	        const target2 = event.addedTarget;
	        const cards = target1.getCards("h", card => lib.filter.canBeGained(card, target1, target2));
	    	if (cards.length) {
	    		await target2.gain(cards.randomGet(), target1, "giveAuto");
	    	}
	    },
	    ai: {
	        order: 10,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	    },
	},
	mjsbaidengjiewei: {
		cardAudio: {
			mjs_chenping: "ext:名将杀/audio/skill/mjsliuchuqiji8.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_chenping",
	    destroy: true,
	    enable: true,
	    filterTarget(card, player, target) {
	        if (player === target) {
	            return false;
	        }
	        return true;
	    },
	    ignoreTarget(card, player, target) {
	        return target.hasSkill("mjsbaidengjiewei_effect");
	    },
	    async content(event, trigger, player) {
	        const target = event.target;
	        target.addTempSkill("mjsbaidengjiewei_effect", { player: "phaseBegin" });
	    },
	    ai: {
	        basic: {
	            order: 7.2,
	            useful: 4.5,
	            value: 9.2,
	        },
	        result: {
	            target(player, target) {
	            	return target.hasSkill("mjsbaidengjiewei_effect") ? 1 : 2;
	            },
	        },
	    },
	},
	//太公六韬
	mjswentao: {
		cardAudio: {
			mjs_zhangliang: "ext:名将杀/audio/skill/mjsyiqiaoshoushu3.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhangliang",
	    enable: true,
	    filterTarget(card, player, target) {
	        return target.countCards("h") < target.getHandcardLimit();
	    },
	    async content(event, trigger, player) {
	        const target = event.target;
	        await target.drawTo(target.getHandcardLimit());
	    },
	    ai: {
	        basic: {
	            order: 7.2,
	            useful: 4.5,
	            value: 9.2,
	        },
	        result: {
	            target(player, target) {
	            	return get.effect(target, { name: "draw" }, target) * Math.max(0, target.getHandcardLimit() - target.countCards("h"));
	            },
	        },
	        tag: {
	            draw: 2,
	        },
	    },
	},
	mjswutao: {
		cardAudio: {
			mjs_zhangliang: "ext:名将杀/audio/skill/mjsyiqiaoshoushu4.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhangliang",
	    enable: true,
	    filterTarget(card, player, target) {
	        return player != target && target.countCards("h");
	    },
	    async content(event, trigger, player) {
	    	const cards = event.target.getCards("h");
	    	const types = cards
	    		.reduce((list, card) => list.add(get.type2(card)), []);
	    	await player.viewHandcards(event.target);
	    	const list = ["basic", "trick", "equip"].slice().removeArray(types);
	    	if (list.length) {
	    		const result = await player
	    			.chooseTarget(`令一名角色随机获得${get.translation(list)}类型的各1张牌`)
	    			.set("ai", target => {
	    				const player = get.player();
	    				return Math.max(1, 2 - target.countCards("h") / 10);
	    			})
	    			.forResult();
	    		if (result?.bool) {
	    			const target = result.targets[0];
	    			player.line(target);
	    			const cards = [];
			        for (const type of list) {
			        	const card = get.cardPile(card => {
			        		return get.type2(card) == type && !cards.includes(card);
			        	}, null, "random");
			            if (card) {
			                cards.push(card);
			            }
			        }
			        if (cards.length) {
			            await target.gain(cards, "gain2");
			        }
	    		}
	    	}
	    },
	    ai: {
	        order: 7,
	        useful: 3.5,
	        value: 8,
	        tag: {
	            draw: 1,
	        },
	        result: {
	            target(player, target) {
	                return Math.max(1, 2 - target.countCards("h") / 10);
	            },
	        },
	    },
	},
	mjslongtao: {
		cardAudio: {
			mjs_zhangliang: "ext:名将杀/audio/skill/mjsyiqiaoshoushu5.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhangliang",
	    enable: true,
	    filterTarget(card, player, target) {
	        return player != target;
	    },
	    modTarget: true,
	    async content(event, trigger, player) {
	    	const target = event.target;
	        const card = get.cardPile(card => {
	        	return get.type(card) == "equip";
	        }, null, "random");
            if (card) {
                await target.gain(card, "gain2");
                await target.chooseUseTarget(card, true, "nopopup");
            }
            target.addSkill("mjslongtao_effect");
            player.addMark("mjslongtao_effect", 1, false);
	    },
	    ai: {
	        order: 7,
	        useful: 3.5,
	        value: 8,
	        tag: {
	            draw: 1,
	        },
	        result: {
	            target(player, target) {
	                if (target.hasJudge("lebu")) {
	                    return 0.5;
	                }
	                return Math.max(1, 2 - target.countCards("h") / 10);
	            },
	        },
	    },
	},
	mjshutao: {
		cardAudio: {
			mjs_zhangliang: "ext:名将杀/audio/skill/mjsyiqiaoshoushu6.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhangliang",
	    enable: true,
    	notarget: true,
    	async content(event, trigger, player) {
	        player.addTempSkill("mjshutao_effect");
	        player.addMark("mjshutao_effect", 1, false);
	    },
	    ai: {
	        order: 10,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	    },
	},
	mjsbaotao: {
		cardAudio: {
			mjs_zhangliang: "ext:名将杀/audio/skill/mjsyiqiaoshoushu7.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhangliang",
	    enable: true,
	    filterTarget(card, player, target) {
	        return true;
	    },
	    selectTarget: 2,
	    complexSelect: true,
	    complexTarget: true,
	    multitarget: true,
	    async content(event, trigger, player) {
	        const { targets } = event;
	        if (targets.length < 2) {
	            return;
	        }
	        game.broadcastAll(
	            function (target1, target2) {
	                game.swapSeat(target1, target2);
	            },
	            targets[0],
	            targets[1]
	        );
	    },
	    ai: {
	        order: 1,
	        useful: 1.2,
	        value: 5,
	        result: {
	            target(player, target) {
	                if (player.hasUnknown() && target != player.next && target != player.previous) {
	                    return 0;
	                }
	                var distance = Math.pow(get.distance(player, target, "absolute"), 2);
	                if (!ui.selected.targets.length) {
	                    return distance;
	                }
	                var distance2 = Math.pow(get.distance(player, ui.selected.targets[0], "absolute"), 2);
	                return Math.min(0, distance - distance2);
	            },
	        },
	        tag: {
	            multitarget: 1,
	            norepeat: 1,
	        },
	    },
	},
	mjsquantao: {
		cardAudio: {
			mjs_zhangliang: "ext:名将杀/audio/skill/mjsyiqiaoshoushu8.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhangliang",
	    enable: true,
    	selectTarget: -1,
    	toself: true,
    	filterTarget(card, player, target) {
	        return target === player;
	    },
    	modTarget: true,
    	async content(event, trigger, player) {
	        player.addTempSkill("mjsquantao_effect");
	        player.addMark("mjsquantao_effect", 1, false);
	    },
	    ai: {
	        order: 10,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	    },
	},
	//狐鸣
	mjshuming: {
		fullskin: true,
	    derivation: "mjs_chensheng",
	    enable: true,
	    notarget: true,
	    wuxieable: false,
	    vanish: true,
	    destroy: true,
	    global: "g_mjshuming",
		async content(event, trigger, player) {
			await game.delayx();
			const source = event.cards?.[0]?._mjsgouhuohuming_owner;
			if (source?.isIn()) {
				if (source == player) return;
                const cards = player.getGainableCards(source, "he");
                if (cards.length) {
                    await player.give(cards.randomGets(2), source);
                }
            } else {
                const cards = player.getCards("h", card => {
                    return lib.filter.cardDiscardable(card, player, "mjshuming");
                });
                if (cards.length > 0) {
                    await player.discard(cards.randomGets(1)).set("discarder", source);
                }
            }
		},
	},
	//魏虎符
	mjsweihufu: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip5",
	    derivation: "mjs_ruji",
	    ignoreEquip: true,
	    destroy: true,
	    ai: {
	        order: 9.5,
	        basic: {
	            equipValue: 2,
	        },
	    },
	    skills: ["mjsweihufu_skill"],
	    onLose() {
	    	const next = game.createEvent("mjsContractEquipLose");
    		next.player = player;
    		next.setContent("mjsContractEquipLose");
	    },
	},
	//锦囊妙计
	mjsshezhanqunru: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji3.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhugeliang",
	    enable: true,
	    selectTarget: -1,
	    toself: true,
    	filterTarget(card, player, target) {
	        return target == player;
	    },
	    modTarget: true,
	    async content(event, trigger, player) {
	    	const target = event.target;
	        target.addTempSkill("mjsshezhanqunru_effect");
	        target.addMark("mjsshezhanqunru_effect", 1, false);
	    },
	    ai: {
	    	wuxie(target, card, player, viewer) {
	            if (target.countCards("h") * Math.max(target.hp, 5) > 6) {
	                return 0;
	            }
	        },
	        basic: {
	            order: 2.2,
	            useful: 4.5,
	            value(card, player) {
	                if (player.hp > 2) {
	                    return 9.2;
	                }
	                return 9.2 - 0.7 * Math.min(3, player.countCards("hs"));
	            },
	        },
	        result: {
	            target(player, target) {
	            	const num = target.getHistory("useCard", evt => get.type2(evt.card) == "trick").length;
	            	return get.effect(target, { name: "draw" }, target) * num;
	            },
	        },
	        tag: {
	            draw: 2,
	        },
	    },
	},
	mjscaochuanjiejian: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji4.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhugeliang",
	    wuxieable: true,
	    notarget: true,
	    global: "g_mjscaochuanjiejian",
	    async content(event, trigger, player) {
	        var evt2 = event.getParent(3)._trigger;
	        evt2.cancel();
	        var evt = evt2.getParent();
	        var next = game.createEvent("mjscaochuanjiejian_gain");
	        _status.event.next.remove(next);
	        evt.after.unshift(next);
	        next.player = player;
	        next.setContent(function () {
	            var cards = event.getParent()?.cards?.filterInD();
	            if (cards?.length) {
	                player.gain(cards, "gain2", "log");
	            }
	        });
	    },
	    ai: {
	        basic: {
	            useful: [6,4],
	            value: [6,4],
	        },
	        result: {
	            player: 1,
	        },
	    },
	},
	mjsqixingjifeng: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji5.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhugeliang",
	    enable: true,
	    notarget: true,
	    async content(event, trigger, player) {
	    	player.addTempSkill("mjsqixingjifeng_effect", { player: "phaseBeginStart" });
	        player.addMark("mjsqixingjifeng_effect", 1, false);
	    },
	    ai: {
	        order: 1,
	        useful: 2.5,
	        value: 6,
	        result: {
	            player: 1,
	        },
	        tag: {
	            multitarget: 1,
	            multineg: 1,
	        },
	    },
	},
	mjszhiquhuarong: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji6.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhugeliang",
	    enable: true,
	    filterTarget: true,
	    async content(event, trigger, player) {
	        const target = event.target;
	        player.addTempSkill("mjszhiquhuarong_skill", { player: "phaseBegin" });
	        player.markAuto("mjszhiquhuarong_skill", [target]);
	    },
	    ai: {
	        wuxie() {
	            return Math.random() > 0.5;
	        },
	        order: 7,
	        useful: 1.5,
	        value: 6.5,
	        result: {
	            target(player, target) {
	            	return player.hasStorage("mjszhiquhuarong_skill", target) ? -1 : -2;
	            },
	        },
	    },
	},
	mjsqiqinqizong: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji7.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhugeliang",
	    wuxieable: true,
	    notarget: true,
	    global: "g_mjsqiqinqizong",
	    async content(event, trigger, player) {
	    	var evt = event.getParent(3)._trigger;
	    	evt.cancel();
	        if (evt.player.countGainableCards(player, "he")) {
	            await player.gainPlayerCard(evt.player, "he", 2, true);
	        }
	    },
	    ai: {
	        basic: {
	            useful: [3,4],
	            value: [3,4],
	        },
	        result: {
	            player: 1,
	        },
	    },
	},
	mjskongchengji: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji8.mp3",
		},
        fullskin: true,
        type: "trick",
        derivation: "mjs_zhugeliang",
        enable: true,
	    filterTarget: true,
	    async content(event, trigger, player2) {
	        const target = event.target;
	        target.addAdditionalSkill(`mjskongchengji_${player2.playerid}`, "mjskongchengji_skill");
        	target.markAuto("mjskongchengji_skill", [player2]);
        	player2.addTempSkill("mjskongchengji_clear", { player: "phaseBeginStart" });
	    },
	    ai: {
	        wuxie() {
	            return Math.random() > 0.5;
	        },
	        order: 7,
	        useful: 1.5,
	        value: 6.5,
	        result: {
	            target(player, target) {
	            	return 1;
	            },
	        },
	    },
    },
	mjsshangfangyonghuo: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji9.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhugeliang",
	    enable: true,
        filterTarget(card, player, target) {
            return true;
        },
        async content(event, trigger, player) {
            const target = event.target;
            const next = target.judge(card => {
                if (get.suit(card) == "spade") {
                    return 1;
                }
                return -4;
            });
            next.judge2 = result => !result.bool;
            const result = await next.forResult();
            if (!result?.bool) {
                await target.damage("fire");
            }
        },
        ai: {
            basic: {
                order: 9.2,
                value: [3,1],
                useful: 4.6,
            },
            wuxie(target, card, player, viewer, status) {
                if (get.attitude(viewer, player._trueMe || player) > 0) {
                    return 0;
                }
                if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) {
                    return 0;
                }
            },
            result: {
                target(player, target) {
                    return get.damageEffect(target, player, target, "fire");
                },
            },
            tag: {
                damage: 1,
                fireDamage: 1,
                natureDamage: 1,
            },
        },
	},
	mjsjieshihuanhun: {
		cardAudio: {
			mjs_zhugeliang: "ext:名将杀/audio/skill/mjsjinnangmiaoji10.mp3",
		},
		fullskin: true,
	    type: "trick",
	    derivation: "mjs_zhugeliang",
	    enable: true,
	    filterTarget(card, player, target) {
	    	if (!target.isDead()) {
	    		return false;
	    	}
	    	return target.getSkills(null, false, false).some(skill => {
	            const info = get.info(skill);
	            if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
	                return false;
	            }
	            return true;
	        });
	    },
	    deadTarget: true,
	    async content(event, trigger, player) {
	        const target = event.target;
			const skills = target.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, target).length) {
					return false;
				}
				return true;
			});
			if (!skills.length) return;
			const list = [target.name];
			let num = 0,
				skillMap = {};
			for (const i of list) {
				if (skills.length > num) {
					num = skills.length;
				}
				skillMap[i] = skills;
			}
			if (num == 0) {
				return;
			}
			const result = await player
				.chooseButton(
					[
						[[`###借尸还魂###选择一个技能获得`], "addNewRow"],
						[
							dialog => {
								dialog.css({
									top: get.is.phoneLayout() ? "5%" : "45%",
								});
								const { list, skillMap } = get.event();
								//算出来需要多少列，最多八列
								const num = 8;
								const column = Math.min(list.length, num);
								if (column > 6) {
									dialog.css({
										width: "100%",
										left: 0,
									});
								}
								//重新创建一个容器，不然css之后会导致dialog.content内的其他元素也加入到布局中
								const contentx = ui.create.div(".content", dialog.content);
								contentx.css({
									display: "grid",
									gridTemplateColumns: `repeat(${column}, 1fr)`,
									width: "fit-content",
									margin: "auto",
								});
								//一个一个塞进去
								for (const i of list) {
									const div = ui.create.div(".buttons", contentx);
									const button = ui.create.button(i, "character", div);
									const skills = skillMap[i];
									//让角色和技能按钮水平居中垂直排列
									div.css({
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									});
									//角色因为不是可选按钮所以需要调整一下透明度
									button.style.setProperty("opacity", "1", "important");
									if (skills.length) {
										//创建技能按钮
										const buttons = ui.create.buttons(
											skills.map(i => [i, get.translation(i)]),
											"tdnodes",
											div
										);
										//丢进可选按钮中
										dialog.buttons = dialog.buttons.concat(buttons);
									}
								}
							},
							"handle",
						],
					],
				)
				.set("list", list.slice())
				.set("skillMap", skillMap)
				.forResult();
	        if (result?.bool && result.links?.length) {
	            await player.addTempSkills(result.links, { player: "phaseBegin" });
	        }
	    },
	    ai: {
	        basic: {
	            useful: [3,4],
	            value: [3,4],
	        },
	        result: {
	            player: 1,
	        },
	    },
	},
	//桃花
	mjstaohua: {
		fullskin: true,
	    derivation: "mjs_xiaoqiao",
	    enable(card, player) {
	        return game.hasPlayer(target => target.isDamaged());
	    },
	    savable: true,
	    filterTarget(card, player, target) {
	        return target.isDamaged();
	    },
	    modTarget(card, player, target) {
	        return target.isDamaged();
	    },
	    vanish: true,
	    destroy: true,
	    global: "g_mjstaohua",
		async content(event, trigger, player) {
			const target = event.target;
			target.recover();
		},
		ai: {
			basic: {
	            order: (card, player) => {
	                if (player.hasSkillTag("pretao")) {
	                    return 9;
	                }
	                return 2;
	            },
	        },
	        order: 2.2,
	        result: {
	        	target(player, target) {
	        		return get.recoverEffect(target, player, player);
	        	},
	        	target_use(player, target, card) {
	        		return lib.card.tao.ai.result.target_use(player, target, card);
	        	},
	        },
	        tag: {
	            recover: 1,
	        },
		},
	},
	//符水
	mjsfushui: {
		fullskin: true,
	    derivation: "mjs_zhangjiao",
	    enable: true,
	    notarget: true,
	    wuxieable: false,
	    vanish: true,
	    destroy: true,
	    global: "g_mjsfushui",
		async content(event, trigger, player) {
			const source = event.cards?.[0]?._mjstaipingyaoshu_owner;
			if (source?.isIn()) {
                if (!game.hasPlayer(target => target.isDamaged())) return;
	            const result = await source
	                .chooseTarget("符水：选择令1名角色回复1点体力")
	                .set("filterTarget", (card, player, target) => {
	                    return target.isDamaged();
	                })
	                .set("ai", target => {
	                    const player = get.player();
	                    if (target.isHealthy()) {
	                        return get.attitude(player, target) / (target.maxHp || 1);
	                    }
	                    return get.recoverEffect(target, player, player);
	                })
	                .forResult();
	            if (result.bool && result.targets?.length) {
	                const target = result.targets[0];
	                source.line(target);
	                await target.recover(source);
	            }
            } else {
                await player.loseHp();
            }
		},
	},

	//巫蛊人偶
	mjswugurenou: {
		fullskin: true,
		type: "basic",
	    derivation: "mjs_jiangchong",
	    global: "g_mjswugurenou",
	    ai: {
	        value: -5,
	        useful: 0,
	    },
	},
};

const equip = {
	mjschitu: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip4",
	    distance: {
	        globalFrom: -1,
	    },
	    skills: ["mjschitu_skill"],
	    ai: {
	    	basic: {
	    		equipValue: 4,
	    	},
	    },
	    mjsStrengthenedSkills: ["mjschitu_skill_strengthen"],
	    mjsWeakenedSkills: ["mjschitu_skill_weaken"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "回合开始时，摸2张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "回合开始时，摸1张牌，然后选择弃置1张牌。";
	        }
	        return "回合开始时，摸1张牌。";
	    },
	    cardsuit: "heart",
	    cardnumber: 5,
	},
	mjsdaoli: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip4",
	    distance: {
	        globalFrom: -1,
	    },
	    skills: ["mjsdaoli_skill"],
	    mjsStrengthenedSkills: ["mjsdaoli_skill_strengthen"],
	    mjsWeakenedSkills: ["mjsdaoli_skill_weaken"],
	    /*onEquip() {
	    	//player.addTempSkill("mjsdaoli_skill");
	    	const num = get.is.mjsStrengthenedCard(card) ? 3 : 2;
	    	player.draw(num);
	    },*/
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "装备，摸3张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "装备，摸1张牌。";
	        }
	        return "装备，摸2张牌。";
	    },
	    ai: {
	    	equipValue(card, player) {
	            return 0;
	        },
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	    cardsuit: "club",
	    cardnumber: 5,
	},
	mjsbaitiwu: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip4",
	    distance: {
	        globalFrom: -1,
	    },
	    skills: ["mjsbaitiwu_skill"],
	    mjsStrengthenedSkills: ["mjsbaitiwu_skill_strengthen"],
	    mjsWeakenedSkills: ["mjsbaitiwu_skill_weaken"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "击杀，摸5张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "击杀，摸2张牌。";
	        }
	        return "击杀，摸3张牌。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 2,
	    	},
	    },
	    cardsuit: "club",
	    cardnumber: 5,
	},
	mjssaluzi: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip3",
	    distance: {
	        globalTo: 1,
	    },
	    skills: ["mjssaluzi_skill"],
	    mjsStrengthenedSkills: ["mjssaluzi_skill_strengthen"],
	    mjsWeakenedSkills: ["mjssaluzi_skill_weaken"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "每回合限1次，重伤，回复全部体力，摸3张牌，然后销毁此牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "每回合限1次，重伤，回复1点体力，摸2张牌，然后销毁此牌。";
	        }
	        return "每回合限1次，重伤，回复体力至1点，摸3张牌，然后销毁此牌。";
	    },
	    ai: {
	    	equipValue(card, player) {
	            if (player.hp == 1) {
	                return 5;
	            }
	            return 2;
	        },
	    	basic: {
	    		equipValue: 2,
	    	},
	    },
	    cardsuit: "club",
	    cardnumber: 7,
	},
	mjszhuahuangfeidian: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip3",
	    distance: {
	        globalTo: 1,
	    },
	    skills: ["mjszhuahuangfeidian_skill"],
	    mjsStrengthenedSkills: ["mjszhuahuangfeidian_skill_strengthen"],
	    mjsWeakenedSkills: ["mjszhuahuangfeidian_skill_weaken"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "回合结束时，摸2张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "回合结束时，摸1张牌，然后选择弃置1张牌。";
	        }
	        return "回合结束时，摸1张牌。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 4,
	    	},
	    },
	    cardsuit: "club",
	    cardnumber: 1,
	},
	mjsjueying: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip3",
	    distance: {
	        globalTo: 1,
	    },
	    skills: ["mjsjueying_skill"],
	    mjsStrengthenedSkills: ["mjsjueying_skill_strengthen"],
	    mjsWeakenedSkills: ["mjsjueying_skill_weaken"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "应战，摸2张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "每回合限1次，应战，摸1张牌。";
	        }
	        return "应战，摸1张牌。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 5,
	    	},
	    },
	    cardsuit: "club",
	    cardnumber: 5,
	},
	mjsdilu: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip3",
	    distance: {
	        globalTo: 1,
	    },
	    skills: ["mjsdilu_skill"],
	    mjsStrengthenedSkills: ["mjsdilu_skill_strengthen"],
	    mjsWeakenedSkills: ["mjsdilu_skill_weaken"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "受伤，摸2张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "受伤，卜卦，若结果点数为1~7，摸1张牌，若结果点数为8，弃置所有手牌和装备。";
	        }
	        return "受伤，卜卦，若结果点数为1~7，摸2张牌，若结果点数为8，弃置所有手牌和装备，并销毁此牌。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 5,
	    	},
	    },
	    cardsuit: "club",
	    cardnumber: 6,
	},
	mjswuzhui: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip4",
	    distance: {
	        globalFrom: -1,
	    },
	    skills: ["mjswuzhui_skill"],
	    mjsStrengthenedSkills: ["mjswuzhui_skill_strengthen"],
	    mjsWeakenedSkills: ["mjswuzhui_skill_weaken"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "出杀，摸2张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "每回合限1次，出杀，摸1张牌。";
	        }
	        return "出杀，摸1张牌。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 8,
	    	},
	    },
	    cardsuit: "club",
	    cardnumber: 6,
	},
	mjsyinshikui: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjsyinshikui_skill"],
	    onEquip() {
	    	player.addTempSkill("mjsyinshikui_equip");
	        //player.recover(get.is.mjsStrengthenedCard(card) ? 2 : 1);
	    },
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "装备，回复2点体力；当你受到大于1点的伤害时，抵消此伤害，然后销毁此牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "装备，回复1点体力。";
	        }
	        return "装备，回复1点体力；当你受到大于1点的伤害时，将此伤害改为1点，然后销毁此牌。";
	    },
	    ai: {
	    	equipValue(card, player) {
	            if (player.isDamaged()) {
	                return 5;
	            }
	            if (player.countCards("h", "mjsyinshikui")) {
	                return 6;
	            }
	            return 0;
	        },
	    	basic: {
	    		equipValue: 4,
	    	},
	    },
	    tag: {
	        recover: 1,
	    },
	    cardsuit: "diamond",
	    cardnumber: 1,
	},
	mjsfengyukui: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjsfengyukui_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "手牌上限+4。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "手牌上限+1。";
	        }
	        return "手牌上限+2。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 2,
	    	},
	    },
	    cardsuit: "heart",
	    cardnumber: 1,
	},
	mjsxuanwudun: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjsxuanwudun_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "应战，你可以打出任意牌抵消此杀。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "应战，你可以打出冲杀抵消此杀。";
	        }
	        return "应战，你可以打出杀抵消此杀。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	    cardsuit: "heart",
	    cardnumber: 6,
	},
	mjsbaguadun: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjsbaguadun_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "应战，你可以卜卦，若结果花色为♣或♠，并抵消此杀。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "应战，你可以卜卦，若结果花色为♣，你回复1点体力；若结果花色为♠，则抵消此杀。";
	        }
	        return "应战，你可以卜卦，若结果花色为♠，则抵消此杀。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 4,
	    	},
	    },
	    cardsuit: "heart",
	    cardnumber: 1,
	},
	mjsyunjinpao: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip2",
	    ignoreEquip: true,
	    skills: ["mjsyunjinpao_skill"],
	    onEquip() {
	    	//player.mjsExpandEquip(2);
	    },
	    onLose() {
	    	//player.mjsContractEquip(2);
	    	const next = game.createEvent("mjsContractEquipLose");
    		next.player = player;
    		next.setContent("mjsContractEquipLose");
	    },
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "装备上限+3。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "装备上限+1。";
	        }
	        return "装备上限+2。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 20,
	    	},
	    },
	    cardsuit: "spade",
	    cardnumber: 8,
	},
	mjstengjia: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip2",
	    skills: ["mjstengjia_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "防止你即将受到的所有无属性伤害，当你受到火焰伤害时，烧毁此牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "防止你即将受到的所有无属性伤害，当你受到火焰伤害时，令此伤害+1，然后烧毁此牌。";
	        }
	        return "防止你即将受到的所有无属性伤害，当你受到火焰伤害时，令此伤害+1。";
	    },
	    get ai() {
	    	return lib.card.tengjia.ai;
	    },
	    cardsuit: "club",
	    cardnumber: 3,
	},
	mjsliangyinqiang: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -2,
	    },
	    skills: ["mjsliangyinqiang_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "应战，你可以立即对目标打出1张杀，且此杀强命。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "当你受到杀的伤害后，你可以立即对目标打出1张杀。";
	        }
	        return "应战，你可以立即对目标打出1张杀。";
	    },
	    cardsuit: "diamond",
	    cardnumber: 2,
	},
	mjszhugeliannu: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    skills: ["mjszhugeliannu_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "出杀，你可以对其依次打出手牌中的所有杀。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "出杀，你可以对其依次打出手牌中的2张杀。";
	        }
	        return "出杀，你可以对其依次打出手牌中的所有杀，直到有目标因此重伤。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	    cardsuit: "diamond",
	    cardnumber: 2,
	},
	mjsyushan: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -3,
	    },
	    skills: ["mjsyushan_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "你造成的火焰伤害+1。你造成火焰伤害后，令目标下回合开始时受到1点火焰伤害。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "你每回合首次造成的火焰伤害+1。";
	        }
	        return "你造成的火焰伤害+1。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	    cardsuit: "heart",
	    cardnumber: 3,
	},
	mjszhangbashemao: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -2,
	    },
	    onEquip() {
	    	const cards = [];
	    	while (cards.length < 2) {
	    		const card = game.createCard2("sha", mjs.suits.randomGet(), get.rand(1, 8));
	    		if (card) cards.push(card);
	    		else break;
	    	}
        	if (cards.length) {
        		player.gain(cards);
        		if (get.is.mjsStrengthenedCard(card)) {
        			player.mjsStrengthenCards(cards);
        		}
        	}
	    },
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "装备，添加2张随机花色的杀到你的手牌，然后增强这2张杀。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "装备，添加1张随机花色的杀到你的手牌。";
	        }
	        return "装备，添加2张随机花色的杀到你的手牌。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 3,
	    	},
	    },
	    cardsuit: "diamond",
	    cardnumber: 2,
	},
	mjsqinglongyanyuedao: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -2,
	    },
	    skills: ["mjsqinglongyanyuedao_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "当你的杀被抵消时，你本回合的出杀次数+2。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "当你的杀被抵消时，你可以立即对目标打出1张杀。";
	        }
	        return "当你的杀被抵消时，你本回合的出杀次数+1。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 4,
	    	},
	    },
	    cardsuit: "diamond",
	    cardnumber: 4,
	},
	mjsfangtianhuaji: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -3,
	    },
	    skills: ["mjsfangtianhuaji_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "当你选择杀的目标时，你可以令此杀的目标+1或+2。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "当你选择杀的目标时，你可以弃置1张牌，令此杀的目标+1。";
	        }
	        return "当你选择杀的目标时，你可以弃置1或2张牌，令此杀的目标+1或+2。";
	    },
	    cardsuit: "diamond",
	    cardnumber: 1,
	},
	mjsganjiangmoye: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -1,
	    },
	    skills: ["mjsganjiangmoye_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "其他角色打出杀时，若此杀的目标也在你的攻击范围内，你可以对相同目标打出1张杀。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "每个回合限1次，其他角色打出杀时，若此杀的目标也在你的攻击范围内，你可以弃置1张牌，对相同目标打出1张杀。";
	        }
	        return "每个回合限1次，其他角色打出杀时，若此杀的目标也在你的攻击范围内，你可以对相同目标打出1张杀。";
	    },
	    cardsuit: "diamond",
	    cardnumber: 2,
	},
	mjslongshegong: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -4,
	    },
	    skills: ["mjslongshegong_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "出杀，你可以选择弃置目标任意区域的1张牌。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "杀伤，随机弃置目标任意区域的1张牌。";
	        }
	        return "杀伤，你可以选择弃置目标任意区域的1张牌。";
	    },
	    cardsuit: "heart",
	    cardnumber: 1,
	},
	mjsjingyugong: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -4,
	    },
	    skills: ["mjsjingyugong_skill"],
	    onEquip() {
	    	if (
	    		player.hasHistory("useCard", evt => {
	    			if (get.is.mjsStrengthenedCard(card)) {
	    				return card.name == "sha";
	    			}
	    			return get.type(card) == "basic";
	    		})
	    	) {
	    		player.addTempSkill("mjsjingyugong_skill_unCheck");
	    	}
	    },
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "出杀，若此杀是你本回合打出的第1张杀，则此杀获得强命。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "出杀，若此杀是你本回合打出的第1张牌，则此杀获得强命。";
	        }
	        return "出杀，若此杀是你本回合打出的第1张行动牌，则此杀获得强命。";
	    },
	    cardsuit: "diamond",
	    cardnumber: 5,
	},
	mjsminghongdao: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -1,
	    },
	    skills: ["mjsminghongdao_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "你打出的杀需要2张闪才能抵消。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "你打出的杀需要2张闪才能抵消，当你打出的杀被抵消时，你随机弃置1张牌，然后销毁此牌。";
	        }
	        return "你打出的杀需要2张闪才能抵消，当你打出的杀被抵消时，你随机弃置1张牌。";
	    },
	    cardsuit: "diamond",
	    cardnumber: 8,
	},
	mjskaishanfu: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -2,
	    },
	    skills: ["mjskaishanfu_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "出杀，你可以令此杀的伤害+1。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "出杀，你可以弃置2张牌，令此杀的伤害+1。";
	        }
	        return "出杀，你可以弃置1张牌，令此杀的伤害+1。";
	    },
	    cardsuit: "diamond",
	    cardnumber: 8,
	},
	mjsxuanyuanjian: {
		fullskin: true,
	    type: "equip",
	    subtype: "equip1",
	    distance: {
	        attackFrom: -1,
	    },
	    skills: ["mjsxuanyuanjian_skill"],
	    cardPrompt(card) {
	        if (get.is.mjsStrengthenedCard(card)) {
	            return "你对目标打出的杀获得贯穿和封禁，此杀的封禁效果持续道目标的下个回合开始。";
	        } else if (get.is.mjsWeakenedCard(card)) {
	        	return "你对目标打出的杀获得贯穿。";
	        }
	        return "你对目标打出的杀获得贯穿和封禁。";
	    },
	    ai: {
	    	basic: {
	    		equipValue: 4,
	    	},
	    },
	    cardsuit: "diamond",
	    cardnumber: 1,
	},
};
for (let i in equip) {
	//equip[i].audio = "ext:名将杀/audio/card";
	equip[i].affectable = true;
}

const trick = {
	mjsjianyuqishe: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    selectTarget: -1,
	    reverseOrder: true,
	    defaultYingbianEffect: "remove",
	    filterTarget(card, player, target) {
	        return target !== player;
	    },
	    async content(event, trigger, player) {
	        const target = event.target;
	        if (typeof event.shanRequired !== "number" || !event.shanRequired || event.shanRequired < 0) {
	            event.shanRequired = 1;
	        }
	        if (get.is.mjsStrengthenedCard(event.card)) {
	        	event.shanRequired++;
	        }
	        if (typeof event.baseDamage !== "number") {
	            event.baseDamage = 1;
	        }
	        while (event.shanRequired > 0) {
	            let result = { bool: false };
	            if (!event.directHit) {
	                const next = target.chooseToRespond();
	                next.set("filterCard", function (card, player) {
	                    if (get.name(card) !== "shan") {
	                        return false;
	                    }
	                    return lib.filter.cardRespondable(card, player);
	                });
	                if (event.shanRequired > 1) {
	                    next.set("prompt2", "共需打出" + event.shanRequired + "张闪");
	                }
	                next.set("ai", function (card) {
	                    if (get.event().toRespond) {
	                        return get.order(card);
	                    }
	                    return -1;
	                });
	                next.set(
	                    "toRespond",
	                    (() => {
	                        if (target.hasSkillTag("noShan", null, "respond")) {
	                            return false;
	                        }
	                        if (target.hasSkillTag("useShan", null, "respond")) {
	                            return true;
	                        }
	                        if (event.baseDamage <= 0 || player.hasSkillTag("notricksource", null, event) || target.hasSkillTag("notrick", null, event)) {
	                            return false;
	                        }
	                        if (event.baseDamage >= target.hp + (player.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
	                            return true;
	                        }
	                        const damage = get.damageEffect(target, player, target);
	                        if (damage >= 0) {
	                            return false;
	                        }
	                        if (
	                            event.shanRequired > 1 &&
	                            !target.hasSkillTag("freeShan", null, {
	                                player: player,
	                                card: event.card,
	                                type: "respond",
	                            }) &&
	                            event.shanRequired > target.mayHaveShan(target, "respond", null, "count")
	                        ) {
	                            return false;
	                        }
	                        return true;
	                    })()
	                );
	                next.set("respondTo", [player, event.card]);
	                next.autochoose = lib.filter.autoRespondShan;
	                result = await next.forResult();
	            }
	            if (result.bool === false) {
	                await target.damage();
	                break;
	            } else {
	                event.shanRequired--;
	            }
	        }
	    },
	    get ai() {
	    	return lib.card.wanjian.ai;
	    },
	    cardsuit: "diamond",
	    cardnumber: 1,
	},
	mjsdiaobingqianjiang: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    singleCard: true,
	    complexSelect: true,
	    complexTarget: true,
	    multicheck() {
	        var card = { name: "sha", isCard: true };
	        return game.hasPlayer(function (current) {
	            if (current.countCards("he") > 0) {
	                return game.hasPlayer(function (current2) {
	                    return current.inRange(current2) && lib.filter.targetEnabled(card, current, current2);
	                });
	            }
	        });
	    },
	    filterTarget(card, player, target) {
	        var card = { name: "sha", isCard: true };
	        return (
	            player !== target &&
	            target.countCards("he") > 0 &&
	            game.hasPlayer(function (current) {
	                return target !== current && target.inRange(current) && lib.filter.targetEnabled(card, target, current);
	            })
	        );
	    },
	    filterAddedTarget(card, player, target, preTarget) {
	        var card = { name: "sha", isCard: true };
	        return target !== preTarget && preTarget.inRange(target) && lib.filter.targetEnabled(card, preTarget, target);
	    },
	    async content(event, trigger, player) {
	    	const target = event.target;
	    	const result = await target
                .chooseToUse("对" + get.translation(event.addedTarget) + "使用一张杀，或交给" + get.translation(player) + "一张牌", function (card, player) {
                    if (get.name(card) !== "sha") {
                        return false;
                    }
                    return lib.filter.filterCard.apply(this, arguments);
                })
                .set("targetRequired", true)
                .set("complexSelect", true)
                .set("complexTarget", true)
                .set("filterTarget", function (card, player, target) {
                    if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
                        return false;
                    }
                    return lib.filter.filterTarget.apply(this, arguments);
                })
                .set("sourcex", event.addedTarget)
                .set("addCount", false)
                .set("respondTo", [player, card])
                .forResult();
            if (event.isFake || get.is.mjsWeakenedCard(event.card)) {
            	return;
            }
            if (!result.bool) {
            	if (get.is.mjsStrengthenedCard(card)) {
            		await player.gainPlayerCard(target, "he", true);
            	} else {
            		await target.chooseToGive(player, "he", true);
            	}
            }
	    },
	    get ai() {
	    	return lib.card.jiedao.ai;
	    },
	    cardsuit: "heart",
	    cardnumber: 5,
	},
	mjsshipo: {
		fullskin: true,
	    type: "trick",
	    cardsuit: "spade",
	    cardnumber: 1,
	},
	mjspozhenxiejia: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    selectTarget: 1,
	    postAi(targets) {
	        return targets.length === 1 && targets[0].countCards("j");
	    },
	    filterTarget(card, player, target) {
	        if (player === target) {
	            return false;
	        }
	        return target.hasCard(card => lib.filter.canBeDiscarded(card, player, target), get.is.single() ? "he" : "hej");
	    },
	    defaultYingbianEffect: "add",
	    async content(event, trigger, player) {
	        const target = event.target;
	        if (target.countDiscardableCards(player, "hej")) {
	        	if (event.isFake) {
	        		await player.choosePlayerCard("hej", target, true).set("target", target).set("complexSelect", false).set("ai", lib.card.guohe.ai.button);
	        	} else {
	        		await player.discardPlayerCard("hej", target, true).set("target", target).set("complexSelect", false).set("ai", lib.card.guohe.ai.button);
	        	}
	        }
	    },
	    get ai() {
	    	return lib.card.guohe.ai;
	    },
	    cardsuit: "spade",
	    cardnumber: 6,
	},
	mjsduoliangjieying: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    range: {
	        global: 1,
	    },
	    selectTarget: 1,
	    postAi(targets) {
	        return targets.length === 1 && targets[0].countCards("j");
	    },
	    filterTarget(card, player, target) {
	        if (player === target) {
	            return false;
	        }
	        return target.hasCard(card => lib.filter.canBeGained(card, player, target), get.is.single() ? "he" : "hej");
	    },
	    async content(event, trigger, player) {
	        const target = event.target;
	        if (target.countGainableCards(player, "hej")) {
	        	if (event.isFake) {
	        		await player.choosePlayerCard("hej", target, true).set("target", target).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
	        		return;
	        	}
	            await player.gainPlayerCard("hej", target, true).set("target", target).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
	        }
	    },
	    get ai() {
	    	return lib.card.shunshou.ai;
	    },
	    cardsuit: "spade",
	    cardnumber: 5,
	},
	//久旱
	mjsjiuhan: {
		fullskin: true,
	    type: "delay",
	    filterTarget(card, player, target) {
	        return lib.filter.judge(card, player, target) && player != target;
	    },
	    judge(card) {
	        if (get.color(card) != "red") {
	            return 1;
	        }
	        return -2;
	    },
	    judge2(result) {
	        if (result.bool == false) {
	            return true;
	        }
	        return false;
	    },
	    effect() {
	        if (result.bool == false) {
	            player.skip("phaseDraw");
	        }
	    },
	    get ai() {
	    	return lib.card.bingliang.ai;
	    },
	    cardsuit: "club",
	    cardnumber: 3,
	},
	//霜冻
	mjsshuangdong: {
		fullskin: true,
	    type: "delay",
	    filterTarget(card, player, target) {
	        return lib.filter.judge(card, player, target) && player != target;
	    },
	    judge(card) {
	        if (get.color(card) != "red") {
	            return 1;
	        }
	        return -2;
	    },
	    judge2(result) {
	        if (result.bool == false) {
	            return true;
	        }
	        return false;
	    },
	    effect() {
	        if (result.bool == false) {
	            player.addTempSkill("mjsshuangdong_debuff");
	        }
	    },
	    get ai() {
	    	return lib.card.lebu.ai;
	    },
	    cardsuit: "spade",
	    cardnumber: 8,
	},
	//地火
	mjsdihuo: {
		fullskin: true,
	    type: "delay",
	    cardnature: "fire",
	    filterTarget(card, player, target) {
	        return lib.filter.judge(card, player, target) && player != target;
	    },
	    judge(card) {
	        if (get.number(card) == 3) {
	            return -4;
	        }
	        return 1;
	    },
	    judge2(result) {
	        if (result.bool === false) {
	            return true;
	        }
	        return false;
	    },
	    effect() {
	        if (result.bool === false) {
	            player.damage(3, "fire", "nosource");
	            const targets = game.filterPlayer(target => {
		            return target != player && get.distance(player, target, "pure") <= 1;
		        });
		        for (const target of targets) {
	            	target.damage(2, "fire", "nosource");
	            }
	        } else {
	            player.addJudgeNext(card);
	        }
	    },
	    cancel() {
	        player.addJudgeNext(card);
	    },
	    ai: {
	        basic: {
	            order: 1,
	            useful: 0,
	            value: 0,
	        },
	        result: {
	            target(player, target) {
	                var num = game.countPlayer(function (current) {
	                    //var skills=current.getSkills();
	                    for (var j = 0; j < current.skills.length; j++) {
	                        var rejudge = get.tag(current.skills[j], "rejudge", current);
	                        if (rejudge !== undefined) {
	                            if (get.attitude(target, current) > 0 && get.attitude(current, target) > 0) {
	                                return rejudge;
	                            } else {
	                                return -rejudge;
	                            }
	                        }
	                    }
	                });
	                if (num > 0) {
	                    return num;
	                }
	                if (num === 0) {
	                    var mode = get.mode();
	                    if (mode === "identity") {
	                        if (target.identity === "nei") {
	                            return 1;
	                        }
	                        var situ = get.situation();
	                        if (target.identity === "fan") {
	                            if (situ > 1) {
	                                return 1;
	                            }
	                        } else {
	                            if (situ < -1) {
	                                return 1;
	                            }
	                        }
	                    } else if (mode === "guozhan") {
	                        if (target.identity === "ye") {
	                            return 1;
	                        }
	                        if (
	                            game.hasPlayer(function (current) {
	                                return current.identity === "unknown";
	                            })
	                        ) {
	                            return -1;
	                        }
	                        if (get.population(target.identity) === 1) {
	                            if (target.maxHp > 2 && target.hp < 2) {
	                                return 1;
	                            }
	                            if (game.countPlayer() < 3) {
	                                return -1;
	                            }
	                            if (target.hp <= 2 && target.countCards("he") <= 3) {
	                                return 1;
	                            }
	                        }
	                    }
	                }
	                return -1;
	            },
	        },
	        tag: {
	            damage: 0.16,
	            natureDamage: 0.16,
	            fireDamage: 0.16,
	        },
	    },
	    cardsuit: "heart",
	    cardnumber: 8,
	},
	//天雷
	mjstianlei: {
		fullskin: true,
	    type: "delay",
	    cardnature: "thunder",
	    filterTarget(card, player, target) {
	        return lib.filter.judge(card, player, target) && player != target;
	    },
	    judge(card) {
	        if (get.number(card) == 4) {
	            return -5;
	        }
	        return 1;
	    },
	    judge2(result) {
	        if (result.bool === false) {
	            return true;
	        }
	        return false;
	    },
	    effect() {
	        if (result.bool === false) {
	            player.damage(4, "thunder", "nosource");
	        } else {
	            player.addJudgeNext(card);
	        }
	    },
	    cancel() {
	        player.addJudgeNext(card);
	    },
	    get ai() {
	    	return lib.card.shandian.ai;
	    },
	    cardsuit: "club",
	    cardnumber: 1,
	},
	mjsxianbatouchou: {
        fullskin: true,
        type: "trick",
        enable: true,
	    filterTarget(card, player, target) {
	        return target == player;
	    },
	    selectTarget: -1,
	    toself: true,
	    modTarget: true,
        async content(event, trigger, player) {
        	let target = event.target;
        	let card = event.card;
        	if (target != player) {
        		return;
        	}
            let targets = game.filterPlayer();
            let num = targets.length;
            if (typeof card.storage?.extraCardsNum === "number") {
                num += card.storage.extraCardsNum;
            }
            let cards = get.cards(num);
            let next = game.cardsGotoOrdering(cards);
            next.relatedEvent = event.getParent();
            await next;
            if (!cards) return;
            event.videoId = lib.status.videoId++;
            game.broadcastAll(
                (id, cards) => {
                    const dialog = ui.create.dialog("先拔头筹", cards, true);
                    dialog.videoId = id;
                },
                event.videoId,
                cards
            );
            game.log(event.card, "亮出了", cards);
            await game.delay(2);
            for (const target of event.targets.sortBySeat(player)) {
            	if (!cards.length) break;
            	const result = await target
	                .chooseButton(get.idDialog(event.videoId), true)
	                .set("ai", button => {
	                    let player = _status.event.player,
	                        card = button.link,
	                        val = get.value(card, player);
	                    if (get.tag(card, "recover")) {
	                        val += game.countPlayer(target => {
	                            return target.hp < 2 && get.attitude(player, target) > 0 && lib.filter.cardSavable(card, player, target);
	                        });
	                        if (player.hp <= 2 && game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
	                            val *= 2;
	                        }
	                    }
	                    return val;
	                })
	                .set("closeDialog", false)
	                .set("dialogdisplay", true)
	                .forResult();
	            if (result?.bool && result.links?.length) {
	                await target.gain(result.links, "gain2");
	                cards.removeArray(result.links);
	                const dialog = get.idDialog(event.videoId);
	                game.broadcastAll(
	                	(dialog, result) => {
	                		for (const button of dialog.buttons) {
			                    if (result.links.includes(button.link)) {
			                        button.remove();
			                        break;
			                    }
			                }
	                	},
	                	dialog,
	                	result
	                );
	                await game.delay();
	            }
            }
            game.broadcastAll("closeDialog", event.videoId);
            if (cards.length) {
            	const list = [];
            	const targets2 = targets.removeArray(event.targets);
                for (const target of targets2) {
                    const card = cards.randomRemove();
                    if (card) {
                        list.push([target, [card]]);
                    }
                }
                if (list.length) {
                	await game.loseAsync({
	                    gain_list: list,
	                    giver: player,
	                    animate: "draw",
	                }).setContent("gaincardMultiple");
                }
            }
        },
        ai: {
	        wuxie() {
	            if (Math.random() < 0.5) {
	                return 0;
	            }
	        },
	        basic: {
	            order: 3,
	            useful: 0.5,
	        },
	        result: {
	            target(player, target) {
	                var sorter = _status.currentPhase || player;
	                let opt = 6 + 0.75 * (game.countPlayer() - 2 * get.distance(sorter, target, "absolute"));
	                if (get.is.versus()) {
	                    if (target !== sorter && get.attitude(player, player.next) < get.attitude(player, player.previous)) {
	                        opt = 6 + 0.75 * (2 * get.distance(sorter, target, "absolute") - game.countPlayer());
	                    }
	                }
	                if (player.hasUnknown(2)) {
	                    return 0;
	                }
	                return opt / 6;
	            },
	        },
	        tag: {
	            draw: 1,
	        },
	    },
	    cardsuit: "club",
	    cardnumber: 5,
    },
	mjsliehuofencheng: {
        fullskin: true,
        type: "trick",
        enable: true,
        filterTarget(card, player, target) {
            return target != player && target.countCards("he") > 0;
        },
        async content(event, trigger, player) {
            const target = event.target;
            if (get.is.mjsStrengthenedCard(event.card)) {
            	event.result = await player
	            	.chooseControl(mjs.suits.slice(0))
	            	.set("prompt", `发动了烈火焚城，请选择令${get.translation(target)}弃置一种属性的手牌`)
		            .set("ai", () => {
		                return "taiji";
		            })
		            .forResult();
            } else {
            	event.result = await player
	                .chooseToDiscard("he", `发动了烈火焚城，请选择弃置1张牌，令${get.translation(target)}弃置1张相同花色的手牌`)
	                .set("ai", card => {
	                    const player = get.player();
	                    const evt = _status.event.getParent();
	                    if (evt.isFake) {
	                    	return 0;
	                    }
	                    const target = _status.event.getParent().target;
	                    if (!target.countCards("he")) {
	                    	return 0;
	                    }
	                    return 8 - get.value(card);
	                })
	                .forResult();
            }
            const suits = [];
            if (event?.result?.cards?.length) {
            	const list2 = event.result.cards.reduce((list, card) => list.add(get.suit(card)), []);
            	suits.addArray(list2);
            } else if (event.result.control) {
            	suits.push(event.result.control);
            }
            if (!suits.length) {
            	return;
            }
            const pos = "h" + (get.is.mjsWeakenedCard(event.card) ? "e" : "");
            const result2 = await target
                .chooseToDiscard("成为烈火焚城目标，请选择弃置1张手牌，否则随机烧毁1张牌并受到1点火焰伤害", pos, card => {
                    return get.event().suits.includes(get.suit(card))
                })
                .set("ai", card => {
                    var evt = _status.event.getParent();
                    if (evt.isFake) {
                    	return 0;
                    }
                    if (get.damageEffect(evt.target, evt.player, evt.player, "fire") > 0) {
                        return 10 + Math.min(4, evt.player.hp) - get.value(card, evt.player);
                    }
                    return 20 - get.value(card);
                })
                .set("suits", suits)
                .forResult();
            if (event.isFake) {
            	return;
            }
            if (!result2?.bool || !result2?.cards.length || !suits.includes(get.suit(result2.cards[0]))) {
                const cards = target.getCards("he").randomGets(1);
                if (cards.length) {
                	game.log(cards, "被烧毁了");
                	await target.lose(cards, "toBurnDown", ui.special);
                }
                await target.damage("fire");
            }
        },
        ai: {
            basic: {
                order: 9,
                value: [3,1],
                useful: 2.6,
            },
            wuxie(target, card, player, viewer, status) {
                if (get.attitude(viewer, player._trueMe || player) > 0) {
                    return 0;
                }
                if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) {
                    return 0;
                }
                if (_status.event.getRand("mjsliehuofencheng_wuxie") * 4 > player.countCards("h")) {
                    return 0;
                }
            },
            result: {
                target(player, target) {
                    if (target.hasSkill("mjsliehuofencheng2") || target.countCards("he") == 0) {
                        return 0;
                    }
                    if (player.countCards("h") <= 1) {
                        return 0;
                    }
                    if (_status.event.player == player) {
                        if (target.isAllCardsKnown(player)) {
                            if (
                                !target.countCards("h", card => {
                                    return player.countCards("h", card2 => {
                                        return get.suit(card2) == get.suit(card);
                                    });
                                })
                            ) {
                                return 0;
                            }
                        }
                    }
                    if (target == player) {
                        if (typeof _status.event.filterCard == "function" && _status.event.filterCard(new lib.element.VCard({ name: "mjsliehuofencheng" }), player, _status.event)) {
                            return -1.15;
                        }
                        if (_status.event.skill) {
                            var viewAs = get.info(_status.event.skill).viewAs;
                            if (viewAs == "mjsliehuofencheng") {
                                return -1.15;
                            }
                            if (viewAs && viewAs.name == "mjsliehuofencheng") {
                                return -1.15;
                            }
                        }
                        return 0;
                    }
                    return -1.15;
                },
            },
            tag: {
                damage: 1,
                fireDamage: 1,
                natureDamage: 1,
                norepeat: 1,
            },
        },
        cardsuit: "heart",
	    cardnumber: 3,
    },
	mjszhenqianduijue: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    filterTarget(card, player, target) {
	        return target !== player;
	    },
	    async content(event, trigger, player) {
	        const target = event.target;
	        if (event.turn === undefined) {
	            event.turn = target;
	        }
	        event.source = player;
	        if (typeof event.baseDamage !== "number") {
	            event.baseDamage = 1;
	        }
	        if (typeof event.extraDamage !== "number") {
	            event.extraDamage = 0;
	        }
	        if (!event.shaReq) {
	            event.shaReq = {};
	        }
	        if (typeof event.shaReq[player.playerid] !== "number") {
	            event.shaReq[player.playerid] = 1;
	        }
	        if (typeof event.shaReq[target.playerid] !== "number") {
	            event.shaReq[target.playerid] = 1;
	        }
	        event.playerCards = [];
	        event.targetCards = [];
	        while (true) {
	            await event.trigger("mjszhenqianduijue");
	            event.shaRequired = event.shaReq[event.turn.playerid];
	            let damaged = false;
	            while (event.shaRequired > 0) {
	                let result = { bool: false };
	                if (!event.directHit) {
	                    const next = event.turn.chooseToRespond();
	                    next.set("filterCard", function (card, player) {
	                        if (get.name(card) !== "sha") {
	                            return false;
	                        }
	                        return lib.filter.cardRespondable(card, player);
	                    });
	                    if (event.shaRequired > 1) {
	                        next.set("prompt2", "共需打出" + event.shaRequired + "张杀");
	                    }
	                    next.set("ai", function (card) {
	                        if (get.event().toRespond) {
	                            return get.order(card);
	                        }
	                        return -1;
	                    });
	                    next.set("shaRequired", event.shaRequired);
	                    next.set(
	                        "toRespond",
	                        (() => {
	                            const responder = event.turn;
	                            const opposite = event.source;
	                            if (responder.hasSkillTag("noSha", null, "respond")) {
	                                return false;
	                            }
	                            if (responder.hasSkillTag("useSha", null, "respond")) {
	                                return true;
	                            }
	                            if (event.baseDamage + event.extraDamage <= 0 || player.hasSkillTag("notricksource", null, event) || responder.hasSkillTag("notrick", null, event)) {
	                                return false;
	                            }
	                            if (event.baseDamage + event.extraDamage >= responder.hp + (opposite.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
	                                return true;
	                            }
	                            const damage = get.damageEffect(responder, opposite, responder);
	                            if (damage >= 0) {
	                                return false;
	                            }
	                            if (
	                                event.shaRequired > 1 &&
	                                !target.hasSkillTag("freeSha", null, {
	                                    player: player,
	                                    card: event.card,
	                                    type: "respond",
	                                }) &&
	                                event.shaRequired > responder.mayHaveSha(responder, "respond", null, "count")
	                            ) {
	                                return false;
	                            }
	                            if (get.attitude(responder, opposite._trueMe || opposite) > 0 && damage >= get.damageEffect(opposite, responder, responder)) {
	                                return false;
	                            }
	                            // if (responder.hasSkill("naman")) {
	                            //     return true;
	                            // }
	                            return true;
	                        })()
	                    );
	                    next.set("respondTo", [player, event.card]);
	                    next.autochoose = lib.filter.autoRespondSha;
	                    if (event.turn === target) {
	                        next.source = player;
	                    } else {
	                        next.source = target;
	                    }
	                    result = await next.forResult();
	                }
	                if (result?.bool) {
	                    event.shaRequired--;
	                    if (result.cards?.length) {
	                        if (event.turn === target) {
	                            event.targetCards.addArray(result.cards);
	                        } else {
	                            event.playerCards.addArray(result.cards);
	                        }
	                    }
	                } else {
	                    if (!event.isFake) {
	                    	await event.turn.damage(event.source);
	                    }
	                    damaged = true;
	                    break;
	                }
	            }
	            if (damaged) {
	                break;
	            }
	            [event.source, event.turn] = [event.turn, event.source];
	        }
	    },
	    get ai() {
	    	return lib.card.juedou.ai;
	    },
	    cardsuit: "diamond",
	    cardnumber: 5,
	},
	mjsxiuyangshengxi: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    selectTarget: -1,
	    cardcolor: "red",
	    reverseOrder: true,
	    filterTarget(card, player, target) {
	        return true;
	    },
	    ignoreTarget(card, player, target) {
	        return target.isHealthy();
	    },
	    content() {
	        target.recover();
	    },
	    ai: {
	        basic: {
	            order: (item, player) => {
	                if (game.hasPlayer(current => current.hp <= 1 && get.recoverEffect(current, player, _status.event.player) < 0)) {
	                    return 1;
	                }
	                return 10;
	            },
	            useful: [3,1],
	            value: 0,
	        },
	        result: {
	            target(player, target) {
	                return target.hp < target.maxHp ? 2 : 0;
	            },
	        },
	        tag: {
	            recover: 0.5,
	            multitarget: 1,
	        },
	    },
	    cardsuit: "club",
	    cardnumber: 1,
	},
	mjslianhuan: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    filterTarget: true,
	    selectTarget: [1, 2],
	    complexTarget: true,
	    content() {
	        target.link();
	    },
	    recastable: true,
	    get ai() {
	    	return lib.card.tiesuo.ai;
	    },
	},
	mjsduoduoyishan: {
		fullskin: true,
	    type: "trick",
	    enable: true,
	    selectTarget: -1,
	    cardcolor: "red",
	    toself: true,
	    filterTarget(card, player, target) {
	        return target === player;
	    },
	    modTarget: true,
	    async content(event, trigger, player) {
	    	const num = get.is.mjsStrengthenedCard(event.card) ? 3 : get.is.mjsWeakenedCard(event.card) ? 1 : 2;
	        event.target.draw(num);
	    },
	    get ai() {
	    	return lib.card.wuzhong.ai;
	    },
	    cardsuit: "club",
	    cardnumber: 2,
	},
	mjsfenghuolangyan: {
	    fullskin: true,
	    type: "trick",
	    enable: true,
	    selectTarget: -1,
	    defaultYingbianEffect: "remove",
	    filterTarget(card, player, target) {
	        return target !== player;
	    },
	    reverseOrder: true,
	    async content(event, trigger, player) {
	        const target = event.target;
	        if (typeof event.shaRequired !== "number" || !event.shaRequired || event.shaRequired < 0) {
	            event.shaRequired = 1;
	        }
	        if (get.is.mjsStrengthenedCard(event.card)) {
	        	event.shaRequired++;
	        }
	        if (typeof event.baseDamage !== "number") {
	            event.baseDamage = 1;
	        }
	        while (event.shaRequired > 0) {
	            let result = { bool: false };
	            if (!event.directHit) {
	                const next = target.chooseToRespond();
	                next.set("filterCard", function (card, player) {
	                    if (get.name(card) !== "sha") {
	                        return false;
	                    }
	                    return lib.filter.cardRespondable(card, player);
	                });
	                if (event.shaRequired > 1) {
	                    next.set("prompt2", "共需打出" + event.shaRequired + "张【杀】");
	                }
	                next.set("ai", function (card) {
	                    if (get.event().toRespond) {
	                        return get.order(card);
	                    }
	                    return -1;
	                });
	                next.set(
	                    "toRespond",
	                    (() => {
	                        if (target.hasSkillTag("noSha", null, "respond")) {
	                            return false;
	                        }
	                        if (target.hasSkillTag("useSha", null, "respond")) {
	                            return true;
	                        }
	                        if (event.baseDamage <= 0 || player.hasSkillTag("notricksource", null, event) || target.hasSkillTag("notrick", null, event)) {
	                            return false;
	                        }
	                        if (event.baseDamage >= target.hp + (player.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
	                            return true;
	                        }
	                        const damage = get.damageEffect(target, player, target);
	                        if (damage >= 0) {
	                            return false;
	                        }
	                        if (
	                            event.shaRequired > 1 &&
	                            !target.hasSkillTag("freeSha", null, {
	                                player: player,
	                                card: event.card,
	                                type: "respond",
	                            }) &&
	                            event.shaRequired > target.mayHaveSha(target, "respond", null, "count")
	                        ) {
	                            return false;
	                        }
	                        // if (target.hasSkill("naman")) {
	                        //     return true;
	                        // }
	                        return true;
	                    })()
	                );
	                next.set("respondTo", [player, event.card]);
	                next.autochoose = lib.filter.autoRespondSha;
	                result = await next.forResult();
	            }
	            if (result.bool === false) {
	                await target.damage();
	                break;
	            } else {
	                event.shaRequired--;
	            }
	        }
	    },
	    get ai() {
	    	return lib.card.nanman.ai;
	    },
	    cardsuit: "heart",
	    cardnumber: 5,
	},
};

for (let i in trick) {
	//trick[i].audio = "ext:名将杀/audio/card";
	trick[i].affectable = true;
}

const basic = {
	nu: {
		audio: "ext:名将杀/audio/card",
		fullskin: true,
	    type: "basic",
	    toself: true,
	    enable(event, player) {
	        return true;
	    },
	    logv: false,
	    savable(card, player, dying) {
	        return dying == player;
	    },
	    selectTarget: -1,
	    modTarget: true,
	    filterTarget(card, player, target) {
	        return target == player;
	    },
	    content() {
	        if (typeof event.baseDamage != "number") {
	            event.baseDamage = 1;
	        }
	        if (target.isDying() || event.getParent(2).type == "dying") {
	        	const num = get.is.mjsStrengthenedCard(card) ? 2 : 1;
	            target.recover(num);
	        } else {
	            game.addVideo("jiuNode", target, true);
	            if (cards && cards.length) {
	                card = cards[0];
	            }
	            if (!target.storage.nu) {
	                target.storage.nu = 0;
	            }
	            target.storage.nu += event.baseDamage;
	            game.broadcastAll(
	                function (target, card, gain2) {
	                    target.addSkill("nu");
	                    if (!target.node.nu && lib.config.jiu_effect) {
	                        target.node.nu = ui.create.div(".playerjiu", target.node.avatar);
	                        target.node.nu2 = ui.create.div(".playerjiu", target.node.avatar2);
	                    }
	                    if (gain2 && card.clone && (card.clone.parentNode == target.parentNode || card.clone.parentNode == ui.arena)) {
	                        card.clone.moveDelete(target);
	                    }
	                },
	                target,
	                card,
	                target == targets[0] && cards.length == 1
	            );
	            if (target == targets[0] && cards.length == 1) {
	                if (card.clone && (card.clone.parentNode == target.parentNode || card.clone.parentNode == ui.arena)) {
	                    game.addVideo("gain2", target, get.cardsInfo([card]));
	                }
	            }
	            if (target.getHistory("useCard", evt => evt.card.name == "nu").length > 1) {
	            	const cards = target.getCards("he", card => {
						return lib.filter.cardDiscardable(card, target, "nu");
					});
					if (cards.length > 0) {
						target.discard(cards.randomGets(1));
					}
	            }
	        }
	    },
	    get ai() {
	    	return lib.card.jiu.ai;
	    },
	},
	yi: {
		fullskin: true,
	    type: "basic",
	    enable: false,
	    /*enable(event, player) {
	    	return false;
	    },*/
	    modTarget: true,
	    content() {},
	    global: ["g_yi"],
	    ai: {
	    	order: 7,
	        useful: 9,
	        value: 12.5,
	        result: {
	            player: 1,
	        },
	        tag: {
	            recover: 1,
	            save: 1,
	        },
	    },
	    cardsuit: "taiji",
	    cardnumber: 8,
	},
};
for (let i in basic) {
	//basic[i].audio = "ext:名将杀/audio/card";
	basic[i].affectable = true;
}

Object.assign(card, equip);
Object.assign(card, trick);
Object.assign(card, basic);

for (let i in card) {
	//card[i].audio = "ext:名将杀/audio/card";
	card[i].image = "ext:名将杀/image/card/" + i + ".png";
}


export default card;
