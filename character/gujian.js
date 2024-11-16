import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "gujian",
		character: {
			gjqt_bailitusu: ["male", "shu", 4, ["xuelu", "fanshi", "shahun"], ["name:百里|屠苏"]],
			gjqt_fengqingxue: ["female", "wu", 3, ["qinglan", "yuehua", "swd_wuxie"]],
			gjqt_xiangling: ["female", "wu", 3, ["xlqianhuan", "meihu", "xidie"]],
			gjqt_fanglansheng: ["male", "wu", 3, ["fanyin", "mingkong", "fumo"]],
			gjqt_yinqianshang: ["male", "qun", 4, ["zuiji", "zuizhan"]],
			gjqt_hongyu: ["female", "shu", 4, ["jianwu", "meiying"]],

			gjqt_yuewuyi: ["male", "wei", 4, ["yanjia", "xiuhua", "liuying"]],
			gjqt_wenrenyu: ["female", "shu", 4, ["chizhen", "dangping"], ["name:闻人|羽"]],
			gjqt_xiayize: ["male", "qun", 3, ["xuanning", "liuguang", "yangming"]],
			gjqt_aruan: ["female", "wu", 3, ["zhaolu", "jiehuo", "yuling"]],

			gjqt_xunfang: ["female", "shu", 3, ["manwu", "xfanghua"]],
			gjqt_ouyangshaogong: ["male", "shu", 3, ["yunyin", "shishui", "duhun"], ["name:欧阳|少恭"]],

			gjqt_xieyi: ["male", "qun", 3, ["lingyan", "xunjian", "humeng"]],
			gjqt_yanjiaxieyi: ["male", "qun", 2, ["xianju"], ["unseen"]],
			gjqt_chuqi: ["male", "qun", 2, ["xuanci"], ["unseen"]],

			gjqt_beiluo: ["male", "qun", 4, ["lingnu", "zhenying", "cihong"]],
			gjqt_yunwuyue: ["female", "wei", 3, ["yange", "woxue", "lianjing"]],
			gjqt_cenying: ["female", "shu", 3, ["yunyou", "xuanzhen", "qingshu"]],
		},
		characterIntro: {
			gjqt_bailitusu:
				"原名韩云溪，太子长琴半身。幼时经历灭族之灾，本来已死去，但因体内被封进了太子长琴一半魂魄而得以死而复生。身怀凶剑焚寂的煞气，在某次煞气发作中被紫胤真人所救，后拜入昆仑山天墉城，以“屠绝鬼气，苏醒人魂”之意更名为“百里屠苏”。",
			gjqt_fengqingxue:
				"来自幽暗无边的地界，大哥为幽都娲皇神殿“十巫”之一的巫咸——风广陌。奉命寻兄而来到人间，邂逅百里屠苏，陷入了焚寂的宿命纠葛。后与百里屠苏相知相爱。终局，百里屠苏化为永世无法轮回的荒魂，她为寻找重生之法，放弃自己的轮回，换取下长久的寿命，在人间执着不悔地寻觅了九百年。最后，与重生后的屠苏回到桃花谷相守。",
			gjqt_xiangling:
				"青丘之国国主九尾天狐与人界女子所生，半人半妖。由南疆紫榕林榕爷爷抚养，在山林间无拘无束长大，娇俏可爱。后来下江南寻找生母，却被抓进翻云寨，偶然被百里屠苏相救，为报答救命之恩，便一直跟随百里屠苏。在漫漫征途中成长起来，变得成熟懂事。得知方兰生对自己的感情，十分矛盾，后来终于错过。最后结局，启程前往青丘之国。",
			gjqt_fanglansheng:
				"家住琴川的一介书生，家境殷实，母亲在家常住庵堂，吃斋念佛，父亲虽是琴川附近某间寺庙的住持，但却比商人还会敛财。跟随父亲学过降妖除鬼的佛家法术，并以此自傲。梦想能找一个娇小可爱，温柔美丽的女子共渡此生。对襄铃一见钟情。",
			gjqt_yinqianshang:
				"原名风广陌，是幽都“十巫”之一的巫咸。奉女娲之命前往乌蒙灵谷增强焚寂封印。但因为欧阳少恭与雷严的争夺关系，他受到焚寂之力力量冲击，失去记忆，后为欧阳少恭所救。尹千觞为了报恩，跟随在百里屠苏等人身边监视。在这个过程中，他慢慢恢复过往的记忆。后为阻止欧阳少恭，随众人前往蓬莱决战。最后，对曾给予他一次重生的欧阳少恭以死相陪，一起归于火海。",
			gjqt_hongyu:
				"上古庆枫族族人，紫胤真人的剑灵，宿体为古剑·红玉。在百里屠苏离开昆仑山天墉城后，奉命随行保护。终局之后，她依然回到了天墉城，陪伴在紫胤真人身边。",

			gjqt_yuewuyi:
				"成长于长安富商家庭。其养父曾是战功显赫的将军，退隐后从商，很快就富甲一方；其养母是精擅偃术的南疆天玄教偃女族传人，待无异一如己出般疼爱有加；无异的生父是捐毒大将兀火罗，亡母是一名中原女子，因此他具有一半胡人的血统。",
			gjqt_wenrenyu:
				"出身于百草谷“天罡”部队。从小在军中生活的她见惯生死，拥有超越其年龄的沉着果敢，头脑冷静严谨，洞察力敏锐，性格大方爽快。",
			gjqt_xiayize:
				"本为当朝圣元帝三子李焱，天资聪颖，勤奋好学，于道术一途颇具天赋。幼时体弱，因身世原因被太华山的诀微长老清和真人带走，从此过上了道家清修的生活。",
			gjqt_aruan:
				"千年前，昭明崩裂损毁，剑心为神农所得，其将剑心植入用辟邪之骨所造之人，是为巫山神女。神女爱慕司幽，却始终得不到司幽回应，心绪起伏加速灵力散逸，不久后死去，司幽自责不已，失去踪迹。神女死后，剑心碎片落地生根，吸纳灵气变为露草，露草渐渐化为人形，形貌与巫山神女一样，而且保留了她零散的记忆，阿阮正是这些露草中的一个。当阿阮灵气耗尽就会重新变为露草，并失去人时的记忆，直到重新吸纳足够的灵力才能恢复人形。",

			gjqt_xunfang:
				"蓬莱国公主，美丽善良，为欧阳少恭前世妻子，太子长琴转世后，巽芳为寻找丈夫来到中原。蓬莱人寿命虽长却终有极限，终究躲不过容颜老去。当巽芳找到分离多年后的少恭时，自惭形秽，不愿相认，她希望少恭心中的自己永远都是青春貌美，于是化名“寂桐”守护在其身旁。",
			gjqt_ouyangshaogong:
				"前身为太子长琴，今生只有一半仙灵，另一半仙灵被铸进焚寂之中，成为焚寂剑灵。他在漫长时光中经历太多悲欢离合，渐渐迷失自我。后与蓬莱国公主巽芳相爱，度过一段美好时光。之后蓬莱毁于天灾，他误以为巽芳已死，便不再压抑内心的疯狂与憎恨，为逆天改命不惜一切。",

			gjqt_xieyi:
				"偃术大师，流月城大祭司沈夜之徒。于偃术一途冠绝古今，其制造的偃甲精妙绝伦，为世人所称颂。男主角乐无异对其十分崇拜。曾任流月城破军祭司，精通偃术和法术，在一百年前寻找神剑昭明的西域之行中被沈夜捉拿回流月城，毁去记忆仅靠偃甲和蛊虫心脏跳动，并更名为初七，最终在巫山为抢救昭明剑心、保护乐无异被埋在坍塌的神女墓下。他以自己为原型制作，并放入自己部分记忆的偃甲人谢衣曾收乐无异为徒。",

			gjqt_beiluo:
				"身负辟邪王族之血的大妖，辟邪先王玄戈的孪生兄弟。北洛幼时流落人界，从此便在那里长大。他对自己的血脉并无认同之感，常年抑制妖力，希望以“人”的身份留在人间。后因先王玄戈的逝世，即位为辟邪王",
			gjqt_yunwuyue:
				"本体是一只魇兽，该族喜独居，以人的梦境为食，以精神力为长，被称为“最接近魔的妖族”。云无月幼时居住在有熊城旁的白梦泽，自幼便与轩辕黄帝的大将缙云结识，对缙云有着一种依赖和仰慕，深受缙云的影响，对人族以及其他生灵有感情，不忍看到眼前的生灵遭到痛苦，会加以援手。",
			gjqt_cenying:
				"出身于一个颇有底蕴的大家族，性格开朗随和、温柔坚韧、心如琉璃。岑缨受到开明长辈的影响，自小多思善学，年纪不大却已经加入了博物学会，有时跟随师长在外游历，探寻更广阔的天地。",
		},
		card: {
			yanjiadan_heart: {
				type: "jiguan",
				cardcolor: "heart",
				fullskin: true,
				derivation: "gjqt_xieyi",
				enable: true,
				notarget: true,
				content() {
					"step 0";
					var choice = null;
					var targets = game.filterPlayer(function (current) {
						return get.attitude(player, current) > 0;
					});
					for (var i = 0; i < targets.length; i++) {
						if (targets[i].hp == 1) {
							if (targets[i].hasSkill("yunvyuanshen_skill")) {
								choice = "ziyangdan";
							} else {
								choice = "yunvyuanshen";
								break;
							}
						}
					}
					if (
						!choice &&
						game.hasPlayer(function (current) {
							return (
								current.hp == 1 &&
								get.attitude(player, current) < 0 &&
								get.damageEffect(current, player, player, "fire") > 0
							);
						})
					) {
						choice = "shatang";
					}
					if (!choice) {
						for (var i = 0; i < targets.length; i++) {
							if (!targets[i].hasSkill("yunvyuanshen_skill")) {
								choice = "yunvyuanshen";
								break;
							}
						}
					}
					if (!choice) {
						choice = "ziyangdan";
					}
					player
						.chooseVCardButton("选择一张牌视为使用之", ["yunvyuanshen", "ziyangdan", "shatang"])
						.set("ai", function (button) {
							if (button.link[2] == _status.event.choice) return 2;
							return Math.random();
						})
						.set("choice", choice)
						.set("filterButton", function (button) {
							return _status.event.player.hasUseTarget(button.link[2]);
						});
					"step 1";
					player.chooseUseTarget(true, result.links[0][2]);
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
				},
			},
			yanjiadan_diamond: {
				type: "jiguan",
				cardcolor: "diamond",
				fullskin: true,
				derivation: "gjqt_xieyi",
				enable: true,
				notarget: true,
				content() {
					"step 0";
					var choice = "liufengsan";
					if (
						game.hasPlayer(function (current) {
							var eff = get.effect(current, { name: "shenhuofeiya" }, player, player);
							if (eff >= 0) return false;
							if (current.hp == 1 && eff < 0) return true;
							if (
								get.attitude(player, current) < 0 &&
								get.attitude(player, current.getNext() < 0) &&
								get.attitude(player, current.getPrevious()) < 0
							) {
								return true;
							}
							return false;
						})
					) {
						choice = "shenhuofeiya";
					}
					player
						.chooseVCardButton("选择一张牌视为使用之", [
							"liufengsan",
							"shujinsan",
							"shenhuofeiya",
						])
						.set("ai", function (button) {
							if (button.link[2] == _status.event.choice) return 2;
							return Math.random();
						})
						.set("choice", choice)
						.set("filterButton", function (button) {
							return _status.event.player.hasUseTarget(button.link[2]);
						});
					"step 1";
					player.chooseUseTarget(true, result.links[0][2]);
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
				},
			},
			yanjiadan_club: {
				type: "jiguan",
				cardcolor: "club",
				fullskin: true,
				derivation: "gjqt_xieyi",
				enable: true,
				notarget: true,
				content() {
					"step 0";
					var choice = "liutouge";
					player
						.chooseVCardButton("选择一张牌视为使用之", [
							"bingpotong",
							"liutouge",
							"mianlijinzhen",
						])
						.set("ai", function (button) {
							if (button.link[2] == _status.event.choice) return 2;
							return Math.random();
						})
						.set("choice", choice)
						.set("filterButton", function (button) {
							return _status.event.player.hasUseTarget(button.link[2]);
						});
					"step 1";
					player.chooseUseTarget(true, result.links[0][2]);
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
				},
			},
			yanjiadan_spade: {
				type: "jiguan",
				cardcolor: "spade",
				fullskin: true,
				derivation: "gjqt_xieyi",
				enable: true,
				notarget: true,
				content() {
					"step 0";
					var choice = null;
					if (player.getUseValue("longxugou") > 0) {
						choice = "longxugou";
					} else if (player.getUseValue("qiankunbiao") > 0) {
						choice = "qiankunbiao";
					} else if (player.getUseValue("feibiao") > 0) {
						choice = "qiankunbiao";
					}
					player
						.chooseVCardButton("选择一张牌视为使用之", ["feibiao", "qiankunbiao", "longxugou"])
						.set("ai", function (button) {
							if (button.link[2] == _status.event.choice) return 2;
							return Math.random();
						})
						.set("choice", choice)
						.set("filterButton", function (button) {
							return _status.event.player.hasUseTarget(button.link[2]);
						});
					"step 1";
					player.chooseUseTarget(true, result.links[0][2]);
				},
				ai: {
					order: 5,
					result: {
						player(player) {
							if (player.getUseValue("feibiao") > 0) return 1;
							if (player.getUseValue("qiankunbiao") > 0) return 1;
							if (player.getUseValue("longxugou") > 0) return 1;
							return 0;
						},
					},
				},
			},
		},
		/** @type { importCharacterConfig['skill'] } */
		skill: {
			qingshu: {
				ai: {
					threaten: 1.4,
				},
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					for (var i = 0; i < player.storage.qingshu.length; i++) {
						if (ui.land && ui.land.name == player.storage.qingshu[i]) continue;
						return true;
					}
					return false;
				},
				init(player) {
					player.storage.qingshu = [];
					player.storage.qingshu_all = [];
				},
				content() {
					"step 0";
					player
						.chooseVCardButton(player.storage.qingshu.slice(0), get.prompt("qingshu"))
						.set("ai", function (button) {
							var skill = button.link[2] + "_skill";
							if (lib.skill[skill].ai && lib.skill[skill].ai.mapValue) {
								return Math.abs(lib.skill[skill].ai.mapValue);
							}
							return 0;
						})
						.set("filterButton", function (button) {
							if (ui.land && ui.land.name == button.link[2]) return false;
							return true;
						});
					"step 1";
					if (result.bool) {
						var skill = result.links[0][2];
						event.mapSkill = skill;
						var value = 0;
						if (lib.skill[skill] && lib.skill[skill].ai && lib.skill[skill].ai.mapValue) {
							value = lib.skill[skill].ai.mapValue;
						}
						player
							.chooseTarget(function (card, player, target) {
								return !target.hasSkill(skill + "_skill");
							}, "选择一个目标获得技能" + get.translation(skill))
							.set("ai", function (target) {
								var result = get.sgnAttitude(player, target) * value;
								var num = target.storage.qingshu_gained || 0;
								return result / (num + 1);
							})
							.set("prompt2", lib.translate[skill + "_skill_info"]);
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						var target = result.targets[0];
						var skill = event.mapSkill + "_skill";
						player.logSkill("qingshu", target);
						target.addSkill(skill);
						target.popup(skill);
						game.log(target, "获得了技能", "【" + get.translation(skill) + "】");
						if (!target.storage.qingshu_gained) {
							target.storage.qingshu_gained = 0;
						}
						target.storage.qingshu_gained++;
						player.storage.qingshu.remove(event.mapSkill);
					}
				},
				subSkill: {
					count: {
						trigger: { player: "useCard" },
						silent: true,
						filter(event, player) {
							return (
								get.type(event.card) == "land" &&
								!player.storage.qingshu_all.includes(event.card.name)
							);
						},
						content() {
							player.storage.qingshu.push(trigger.card.name);
							player.storage.qingshu_all.push(trigger.card.name);
						},
					},
				},
				group: "qingshu_count",
			},
			yunyou: {
				enable: "phaseUse",
				round: 2,
				init(player) {
					player.storage.yunyou = [];
				},
				filter(event, player) {
					return (
						!player.hasSkill("land_used") &&
						get.inpile("land").length > player.storage.yunyou.length
					);
				},
				delay: 0,
				content() {
					var list = get.inpile("land");
					for (var i = 0; i < player.storage.yunyou.length; i++) {
						list.remove(player.storage.yunyou[i]);
					}
					player.discoverCard(list, "use");
				},
				ai: {
					order: 6,
					threaten: 1.2,
					result: {
						player: 1,
					},
				},
				group: "yunyou_count",
				subSkill: {
					count: {
						trigger: { player: "useCard" },
						silent: true,
						filter(event, player) {
							return get.type(event.card) == "land";
						},
						content() {
							player.storage.yunyou.add(trigger.card.name);
						},
					},
				},
			},
			xuanzhen: {
				trigger: { global: "useCard1" },
				round: 1,
				filter(event, player) {
					if (event.targets.length != 1) return false;
					if (event.player == player) return false;
					if (player != event.targets[0]) return false;
					for (var i = 0; i < lib.inpile.length; i++) {
						var info = lib.card[lib.inpile[i]];
						if (info.multitarget) continue;
						if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, event.player, player)) {
							return true;
						}
					}
					return false;
				},
				check(event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
				prompt2(event, player) {
					return (
						"发现一张牌代替" +
						get.translation(event.player) +
						"对你使用的" +
						get.translation(event.card)
					);
				},
				autodelay: true,
				content() {
					"step 0";
					var list = [],
						list1 = [],
						list2 = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var info = lib.card[lib.inpile[i]];
						if (info.multitarget) continue;
						if (
							lib.filter.targetEnabled2(
								{ name: lib.inpile[i] },
								trigger.player,
								trigger.targets[0]
							)
						) {
							var cardinfo = [
								trigger.card.suit || "",
								trigger.card.number || "",
								lib.inpile[i],
							];
							list1.push(cardinfo);
							if (info.type != "equip") {
								list2.push(cardinfo);
							}
						}
					}
					var equipped = false;
					for (var i = 0; i < 3; i++) {
						if (equipped && list2.length) {
							list.push(list2.randomRemove());
						} else {
							equipped = true;
							list.push(list1.randomRemove());
						}
					}
					player.chooseButton(true, ["玄阵", [list, "vcard"]]).ai = function (button) {
						var card = {
							suit: trigger.card.suit,
							number: trigger.card.number,
							name: button.link[2],
						};
						return get.effect(trigger.targets[0], card, trigger.player, player);
					};
					"step 1";
					if (result.bool) {
						var card = game.createCard({
							suit: trigger.card.suit || lib.suit.randomGet(),
							number: trigger.card.number || Math.ceil(Math.random() * 13),
							name: result.links[0][2],
						});
						event.card = card;
						game.log(player, "将", trigger.card, "变为", card);
						// if(!event.isMine()) game.delayx();
						trigger.card = get.autoViewAs(card);
						trigger.cards = [card];
						game.cardsGotoOrdering(card).relatedEvent = trigger;
					} else {
						event.finish();
					}
					"step 2";
					player.$throw(event.card, null, null, true);
					if (player == trigger.player) {
						player.line(trigger.targets[0], "green");
					} else {
						player.line(trigger.player, "green");
					}
					game.delayx(0.5);
				},
				ai: {
					threaten(player, target) {
						if (game.roundNumber - target.storage.xuanzhen_roundcount < 1) return 2.2;
						return 0.6;
					},
				},
			},
			xuanci: {
				locked: false,
				mod: {
					targetInRange(card) {
						if (card.name == "feibiao") return true;
					},
				},
				enable: "phaseUse",
				usable: 1,
				viewAs: { name: "feibiao" },
				filterCard: { suit: "club" },
				position: "he",
				filter(event, player) {
					return player.countCards("he", { suit: "club" }) > 0;
				},
				check(card) {
					return 7 - get.value(card);
				},
				group: "xuanci_sha",
				subSkill: {
					sha: {
						trigger: { player: "useCardToAfter" },
						forced: true,
						filter(event, player) {
							if (event.card.name == "feibiao") {
								return event.target.isIn() && player.canUse("sha", event.target, false);
							}
							return false;
						},
						logTarget: "target",
						autodelay: 0.5,
						content() {
							player.useCard(trigger.target, { name: "sha" }, false).line = false;
						},
					},
				},
			},
			xianju: {
				trigger: { global: "roundStart" },
				forced: true,
				init(player) {
					if (game.roundNumber % 2 == 1) {
						player.addTempSkill("qianxing", "roundStart");
					}
				},
				filter(event, player) {
					return game.roundNumber % 2 == 1;
				},
				content() {
					if (game.roundNumber % 2 == 1) {
						player.addTempSkill("qianxing", "roundStart");
					} else {
						var list = get.typeCard("jiguan");
						for (var i = 0; i < list.length; i++) {
							if (lib.card[list[i]].derivation) {
								list.splice(i--, 1);
							}
						}
						if (list.length) {
							player.gain(game.createCard(list.randomGet()), "draw");
						}
					}
				},
				subSkill: {
					gain: {
						trigger: { player: "phaseEnd" },
						forced: true,
						filter(event, player) {
							return game.roundNumber % 2 == 0;
						},
						content() {
							var list = get.typeCard("jiguan");
							for (var i = 0; i < list.length; i++) {
								if (lib.card[list[i]].derivation) {
									list.splice(i--, 1);
								}
							}
							if (list.length) {
								player.gain(game.createCard(list.randomGet()), "draw");
							}
						},
					},
				},
			},
			humeng: {
				init(player) {
					player.storage.humeng = [];
				},
				locked: true,
				group: ["humeng_count", "humeng_call", "humeng_dying"],
				unique: true,
				threaten(player, target) {
					if (target.hasSkill("humeng_sub")) return 1.6;
					return 1;
				},
				subSkill: {
					call: {
						trigger: { player: "humeng_yanjia" },
						forced: true,
						skillAnimation: true,
						animationColor: "water",
						content() {
							player.addSkill("humeng_sub");
						},
					},
					sub: {
						init(player) {
							player.markSkillCharacter(
								"humeng_sub",
								"gjqt_yanjiaxieyi",
								"偃甲谢衣",
								"当你进入濒死状态时激活此替身"
							);
						},
					},
					dying: {
						unique: true,
						skillAnimation: true,
						animationColor: "water",
						trigger: { player: "dying" },
						priority: 10,
						forced: true,
						content() {
							"step 0";
							player.discard(player.getCards("hej"));
							if (player.hasSkill("humeng_sub")) {
								event.yanjia = true;
								player.removeSkill("humeng_sub");
							}
							"step 1";
							player.link(false);
							"step 2";
							player.turnOver(false);
							"step 3";
							player.draw(4);
							player.reinit(get.character(player.name2, 3).includes("humeng") ? player.name2 : player.name1, "gjqt_chuqi");
							player.hp = player.maxHp;
							"step 4";
							if (event.yanjia) {
								var tag = player.addSubPlayer({
									name: "gjqt_yanjiaxieyi",
									skills: ["xianju"],
									hs: get.cards(2),
									hp: 2,
									maxHp: 2,
								});
								player.callSubPlayer(tag);
							}
						},
					},
					count: {
						trigger: { player: "useCardAfter" },
						silent: true,
						filter(event, player) {
							if (player.storage.humeng_yanjia) return false;
							return event.card.name.indexOf("yanjiadan_") == 0;
						},
						content() {
							player.storage.humeng.add(trigger.card.name.slice(10));
							if (player.storage.humeng.length == 4 && !player.hasSkill("humeng_sub")) {
								event.trigger("humeng_yanjia");
							}
						},
					},
				},
			},
			xunjian: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				filter(event, player) {
					if (!player.storage.lingyan) return false;
					if (event.getRand() > player.storage.lingyan.length / 13) return false;
					return get.cardPile2(event.card.name) ? true : false;
				},
				content() {
					var card = get.cardPile2(trigger.card.name);
					if (card) {
						player.gain(card, "gain2");
					}
				},
			},
			lingyan: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					var nums = [];
					for (var i = 0; i < player.storage.lingyan.length; i++) {
						nums.add(player.storage.lingyan[i].number);
					}
					return player.hasCard(function (card) {
						return !nums.includes(card.number);
					}, "h");
				},
				init(player) {
					player.storage.lingyan = [];
				},
				intro: {
					mark(dialog, storage, player) {
						if (Array.isArray(player.storage.humeng) && player.storage.humeng.length) {
							dialog.addText("武将牌");
							dialog.addSmall(storage);
							dialog.addText("偃甲蛋");
							var cards = [];
							for (var i = 0; i < player.storage.humeng.length; i++) {
								var suit = player.storage.humeng[i];
								cards.push(game.createCard("yanjiadan_" + suit, suit, ""));
							}
							dialog.addSmall(cards);
						} else {
							dialog.addAuto(storage);
						}
					},
				},
				filterCard(card, player) {
					var nums = [];
					for (var i = 0; i < player.storage.lingyan.length; i++) {
						nums.add(player.storage.lingyan[i].number);
					}
					return !nums.includes(card);
				},
				check(card) {
					return 8 - get.value(card);
				},
				discard: false,
				prepare(cards, player) {
					player.$give(cards, player, false);
				},
				content() {
					player.storage.lingyan.add(cards[0]);
					player.syncStorage("lingyan");
					player.markSkill("lingyan");
					player.updateMarks();
					var name = "yanjiadan_" + get.suit(cards[0]);
					if (lib.card[name]) {
						player.gain(game.createCard(name), "gain2");
					}
				},
				ai: {
					threaten: 1.4,
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			woxue: {
				trigger: { player: ["useCardAfter", "respondAfter"] },
				filter(event, player) {
					if (
						_status.currentPhase != player &&
						!_status.currentPhase.hasSkill("gw_ciguhanshuang")
					) {
						return true;
					}
					return false;
				},
				check(event, player) {
					return get.attitude(player, _status.currentPhase) < 0;
				},
				logTarget() {
					return _status.currentPhase;
				},
				content() {
					player.useCard({ name: "gw_baishuang" }, _status.currentPhase).animate = false;
				},
				ai: {
					threaten: 0.9,
				},
			},
			yange: {
				trigger: { player: "phaseBeginStart" },
				direct: true,
				init(player) {
					if (player.storage.yange > 0) {
						player.markSkill("yange");
					}
				},
				filter(event, player) {
					return player.storage.yange > 0;
				},
				content() {
					"step 0";
					player
						.chooseTarget(function (card, player, target) {
							return player != target;
						}, get.prompt2("yange"))
						.set("pskill", trigger.skill)
						.set("ai", function (target) {
							if (_status.event.pskill) return 0;
							var player = _status.event.player;
							var nh = player.countCards("h");
							var nh2 = target.countCards("h");
							var num = nh2 - nh;
							if (player.hp == 1) {
								return num;
							}
							if (get.threaten(target) >= 1.5) {
								if (num < 2) return 0;
							} else {
								if (num < 3) return 0;
							}
							return num + Math.sqrt(get.threaten(target));
						});
					"step 1";
					if (result.bool) {
						player.storage.yange--;
						if (player.storage.yange <= 0) {
							player.unmarkSkill("yange");
						} else {
							player.updateMarks();
						}
						var target = result.targets[0];
						player.logSkill("yange", target);
						var clone = function (pos) {
							var cloned = [];
							var cards = target.getCards(pos);
							for (var i = 0; i < cards.length; i++) {
								cloned.push(game.createCard(cards[i]));
							}
							return cloned;
						};
						var tag = player.addSubPlayer({
							name: target.name,
							skills: target.getStockSkills().concat("yange_exit"),
							hs: clone("h"),
							es: clone("e"),
							hp: target.hp,
							maxHp: target.maxHp,
							intro: "回合结束后切换回主武将",
						});
						player.callSubPlayer(tag);
					}
				},
				intro: {
					content: "mark",
				},
				group: "yange_init",
				subSkill: {
					init: {
						trigger: { global: "gameStart", player: "enterGame" },
						forced: true,
						popup: false,
						content() {
							player.storage.yange = game.countPlayer(function (current) {
								return current.isEnemiesOf(player);
							});
							player.markSkill("yange");
						},
					},
					exit: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content() {
							player.exitSubPlayer(true);
							if (lib.filter.filterTrigger(trigger, player, "phaseAfter", "lianjing"))
								game.createTrigger("phaseAfter", "lianjing", player, trigger);
						},
					},
				},
				ai: {
					threaten: 1.5,
				},
			},
			lianjing: {
				unique: true,
				trigger: { player: "phaseAfter" },
				direct: true,
				round: 2,
				filter(event, player) {
					if (event.skill) return false;
					return true;
				},
				content() {
					"step 0";
					player
						.chooseTarget([1, 2], get.prompt2("lianjing"), function (card, player, target) {
							return player != target;
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							var att = get.attitude(player, target);
							var nh = target.countCards("h");
							if (att < 0) {
								for (var i = 0; i < ui.selected.targets.length; i++) {
									if (get.attitude(player, ui.selected.targets[i]) < 0) return 0;
								}
								if (target.hp == 1) {
									if (nh == 0) return 2;
									if (nh == 1) return 1;
								}
							} else if (att > 0) {
								if (target.isTurnedOver()) return 2.5;
								if (target.hp == 1) {
									if (nh == 0) return 2;
									if (nh == 1) return 0.9;
									if (ui.selected.targets.length) return 0.3;
								} else if (target.hp == 2) {
									if (nh == 0) return 1.5;
									if (nh == 1) return 0.5;
									if (ui.selected.targets.length) return 0.2;
								} else if (target.hp == 3) {
									if (nh == 0) return 0.4;
									if (nh == 1) return 0.35;
									if (ui.selected.targets.length) return 0.1;
								}
								if (!target.needsToDiscard(2)) return 0.2;
								if (ui.selected.targets.length || !player.needsToDiscard(2)) return 0.05;
							}
							return 0;
						});
					"step 1";
					if (result.bool) {
						player.logSkill("lianjing", result.targets);
						player.insertEvent("lianjing", lib.skill.lianjing.content_phase);
						player.storage.lianjing_targets = result.targets.slice(0);
						// player.storage.lianjing--;
						// if(player.storage.lianjing<=0){
						// 	player.unmarkSkill('lianjing');
						// }
						game.delay();
					}
				},
				content_phase() {
					"step 0";
					event.forceDie = true;
					event.list = [player].concat(player.storage.lianjing_targets);
					event.exlist = [];
					event.list.sortBySeat();
					delete player.storage.lianjing_targets;
					for (var i = 0; i < game.players.length; i++) {
						if (!event.list.includes(game.players[i])) {
							game.players[i].out("lianjing");
							event.exlist.push(game.players[i]);
						}
					}
					"step 1";
					if (event.list.length) {
						event.list.shift().phase("lianjing");
						event.redo();
					}
					"step 2";
					for (var i = 0; i < event.exlist.length; i++) {
						event.exlist[i].in("lianjing");
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			cihong: {
				round: 3,
				trigger: { player: "phaseEnd" },
				direct: true,
				content() {
					"step 0";
					var goon = false;
					if (
						player.countCards("he", function (card) {
							return get.value(card) < 8 && get.color(card) == "red";
						})
					) {
						goon = true;
					} else if (
						game.hasPlayer(function (current) {
							return (
								current.hp == 1 &&
								player.canUse("sha", current, false) &&
								get.attitude(player, current) < 0 &&
								get.effect(current, { name: "sha" }, player, player) > 0
							);
						})
					) {
						if (player.hp > 1 || !player.isTurnedOver()) {
							goon = true;
						}
					}
					player
						.chooseTarget(get.prompt("cihong"), function (card, playe, target) {
							return player.canUse("sha", target, false);
						})
						.set("ai", function (target) {
							if (!_status.event.goon) return false;
							var player = _status.event.player;
							if (get.attitude(player, target) >= 0) return false;
							if (target.hp > 3) return false;
							return get.effect(target, { name: "sha" }, player, player);
						})
						.set("goon", goon);
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill("cihong", event.target);
					} else {
						event.finish();
					}
					"step 2";
					if (event.target.isAlive() && player.countCards("he", { color: "red" })) {
						player
							.chooseToDiscard(
								"he",
								{ color: "red" },
								"是否弃置一张红色牌视为对" + get.translation(event.target) + "使用一张杀？"
							)
							.set("ai", function (card) {
								return 8 - get.value(card);
							});
					} else {
						event.goto(4);
					}
					"step 3";
					if (result.bool) {
						player.useCard({ name: "sha" }, event.target);
					}
					"step 4";
					if (event.target.isAlive()) {
						player
							.chooseBool(
								"是否失去1点体力并视为对" + get.translation(event.target) + "使用一张杀？"
							)
							.set(
								"choice",
								player.hp > event.target.hp && player.hp > 1 && event.target.hp > 0
							);
					} else {
						event.finish();
					}
					"step 5";
					if (result.bool) {
						player.loseHp();
						player.useCard({ name: "sha" }, event.target);
					}
					"step 6";
					if (event.target.isAlive() && !player.isTurnedOver()) {
						player
							.chooseBool(
								"是将武将牌翻至背面并视为对" + get.translation(event.target) + "使用一张杀？"
							)
							.set("choice", event.target.hp == 1);
					} else {
						event.finish();
					}
					"step 7";
					if (result.bool) {
						player.turnOver(true);
						player.useCard({ name: "sha" }, event.target);
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			zhenying: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				filter(event, player) {
					if (!event.card.isCard) return false;
					if (event.cards[0] && event.cards[0].zhenying_link) return false;
					if (get.color(event.card) != "black") return false;
					if (["delay", "equip"].includes(get.type(event.card))) return false;
					return true;
				},
				content() {
					var fake = game.createCard(trigger.card);
					fake.zhenying_link = true;
					player.gain(fake, "draw")._triggered = null;
					fake.classList.add("glow");
					fake._destroy = "zhenying";
					fake._modUseful = function () {
						return 0.1;
					};
					fake._modValue = function () {
						return 0.1;
					};
				},
				group: ["zhenying_discard", "zhenying_lose"],
				subSkill: {
					discard: {
						trigger: { player: ["useCardAfter", "respondAfter"] },
						forced: true,
						filter(event, player) {
							if (get.is.converted(event)) return false;
							if (!player.countCards("he")) return false;
							if (event.cards[0] && event.cards[0].zhenying_link) return true;
							return false;
						},
						popup: false,
						content() {
							player.chooseToDiscard("he", true);
						},
					},
					lose: {
						trigger: { global: "phaseAfter" },
						silent: true,
						content() {
							var hs = player.getCards("h", function (card) {
								return card.zhenying_link ? true : false;
							});
							if (hs.length) {
								player.lose(hs)._triggered = null;
							}
						},
					},
				},
			},
			lingnu: {
				trigger: { source: "damageEnd" },
				forced: true,
				init(player) {
					player.storage.lingnu = {};
				},
				ai: {
					threaten: 1.3,
				},
				filter(event, player) {
					var num = 0;
					for (var i in player.storage.lingnu) {
						num++;
						if (num >= 3) return false;
					}
					return event.num > 0;
				},
				content() {
					var check = function (list) {
						for (var i = 0; i < list.length; i++) {
							var info = lib.skill[list[i]];
							if (!info) continue;
							if (info.shaRelated) return true;
							if (info.shaRelated === false) return false;
							if (get.skillInfoTranslation(list[i], player).includes("【杀】")) return true;
						}
						return false;
					};
					var list = get.gainableSkills(function (info, skill) {
						if (player.storage.lingnu[list]) return false;
						var list = [skill];
						game.expandSkills(list);
						return check(list);
					}, player);
					var num = 0;
					for (var i in player.storage.lingnu) {
						num++;
					}
					for (var i = 0; i < trigger.num; i++) {
						if (num >= 3) break;
						if (list.length) {
							var skill = list.randomGet();
							player.addAdditionalSkill("lingnu", skill, true);
							player.storage.lingnu[skill] = 3;
							player.popup(skill);
							game.log(player, "获得了技能", "【" + get.translation(skill) + "】");
							player.markSkill("lingnu");
							num++;
						}
					}
				},
				intro: {
					content(storage) {
						var str = '<ul style="padding-top:0;margin-top:0">';
						for (var i in storage) {
							str += "<li>" + get.translation(i) + "：剩余" + storage[i] + "回合";
						}
						str += "</ul>";
						return str;
					},
					markcount(storage) {
						var num = 0;
						for (var i in storage) {
							num++;
						}
						return num;
					},
				},
				group: "lingnu_remove",
				subSkill: {
					remove: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content() {
							var clear = true;
							for (var i in player.storage.lingnu) {
								player.storage.lingnu[i]--;
								if (player.storage.lingnu[i] <= 0) {
									delete player.storage.lingnu[i];
									player.removeAdditionalSkill("lingnu", i);
								} else {
									clear = false;
								}
							}
							if (clear) {
								player.unmarkSkill("lingnu");
							} else {
								player.updateMarks();
							}
						},
					},
				},
			},
			zuiji: {
				enable: "phaseUse",
				filterCard: true,
				position: "he",
				viewAs: { name: "jiu" },
				viewAsFilter(player) {
					if (!player.countCards("he")) return false;
				},
				prompt: "将一张手牌或装备牌当酒使用",
				check(card) {
					return 5 - get.value(card);
				},
				ai: {
					threaten: 1.2,
				},
			},
			manwu: {
				trigger: { global: "phaseEnd" },
				check(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				filter(event, player) {
					return event.player.isMinHandcard();
				},
				logTarget: "player",
				content() {
					trigger.player.draw();
				},
				ai: {
					expose: 0.1,
				},
			},
			xfanghua: {
				trigger: { target: "useCardToBegin" },
				priority: -1,
				filter(event, player) {
					return get.color(event.card) == "red" && player.isDamaged();
				},
				frequent: true,
				content() {
					player.recover();
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.color(card) == "red" && target.isDamaged()) return [1, 1];
						},
					},
				},
			},
			duhun: {
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type != "dying") return false;
					if (player != event.dying) return false;
					if (player.maxHp <= 1) return false;
					if (player.countCards("h") == 0) return false;
					return true;
				},
				// alter:true,
				filterTarget(card, player, target) {
					return (
						target != player &&
						target.countCards("h") > 0 &&
						target.hp > 0 &&
						target.hp <= player.maxHp
					);
				},
				content() {
					"step 0";
					player.chooseToCompare(target);
					"step 1";
					if (!result.bool) {
						player.die();
						event.finish();
					} else {
						event.num = target.hp - player.hp;
						player.loseMaxHp();
					}
					"step 2";
					player.changeHp(event.num);
					if (get.is.altered("duhun")) {
						event.finish();
					}
					"step 3";
					event.target.changeHp(-event.num);
					"step 4";
					if (event.target.hp <= 0) {
						event.target.dying({ source: player });
					}
				},
				ai: {
					order: 1,
					skillTagFilter(player) {
						if (player.maxHp <= 1) return false;
						if (player.hp > 0) return false;
						if (player.countCards("h") == 0) return false;
					},
					save: true,
					result: {
						target: -1,
						player: 1,
					},
					threaten: 2,
				},
			},
			yunyin: {
				trigger: { player: "phaseEnd" },
				direct: true,
				subSkill: {
					count: {
						trigger: { player: "useCard" },
						silent: true,
						filter(event, player) {
							return _status.currentPhase == player;
						},
						content() {
							if (!player.storage.yunyin) {
								player.storage.yunyin = [];
							}
							var suit = get.suit(trigger.card);
							if (suit) {
								player.storage.yunyin.add(suit);
							}
						},
					},
					set: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content() {
							delete player.storage.yunyin;
						},
					},
				},
				filter(event, player) {
					if (!player.storage.yunyin) return true;
					var hs = player.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						if (!player.storage.yunyin.includes(get.suit(hs[i]))) return true;
					}
					return false;
				},
				group: ["yunyin_count", "yunyin_set"],
				content() {
					"step 0";
					player
						.chooseToDiscard(get.prompt("yunyin"), function (card) {
							if (!player.storage.yunyin) return true;
							return !player.storage.yunyin.includes(get.suit(card));
						})
						.set("logSkill", "yunyin").ai = function (card) {
						return 9 - get.value(card);
					};
					"step 1";
					if (!result.bool) {
						event.finish();
						return;
					}
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var name = lib.inpile[i];
						var type = get.type(name);
						if (type == "trick" || type == "basic") {
							if (lib.filter.cardEnabled({ name: name }, player)) {
								list.push([get.translation(type), "", name]);
							}
						}
					}
					var dialog = ui.create.dialog("云音", [list, "vcard"]);
					var taoyuan = 0,
						nanman = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						var eff1 = get.effect(players[i], { name: "taoyuan" }, player, player);
						var eff2 = get.effect(players[i], { name: "nanman" }, player, player);
						if (eff1 > 0) {
							taoyuan++;
						} else if (eff1 < 0) {
							taoyuan--;
						}
						if (eff2 > 0) {
							nanman++;
						} else if (eff2 < 0) {
							nanman--;
						}
					}
					player.chooseButton(dialog).ai = function (button) {
						var name = button.link[2];
						if (Math.max(taoyuan, nanman) > 1) {
							if (taoyuan > nanman) return name == "taoyuan" ? 1 : 0;
							return name == "nanman" ? 1 : 0;
						}
						if (player.countCards("h") < player.hp && player.hp >= 2) {
							return name == "wuzhong" ? 1 : 0;
						}
						if (player.hp < player.maxHp && player.hp < 3) {
							return name == "tao" ? 1 : 0;
						}
						return name == "zengbin" ? 1 : 0;
					};
					"step 2";
					if (result.bool) {
						player.chooseUseTarget(true, result.links[0][2]);
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			shishui: {
				trigger: { player: "useCardToBegin" },
				filter(event, player) {
					return event.target && get.color(event.card) == "red";
				},
				forced: true,
				check(event, player) {
					return get.attitude(player, event.player) < 0;
				},
				content() {
					"step 0";
					if (get.info(trigger.card).multitarget) {
						event.list = trigger.targets.slice(0);
					} else {
						trigger.target.loseHp();
						event.finish();
					}
					"step 1";
					if (event.list.length) {
						event.list.shift().loseHp();
						event.redo();
					}
				},
				ai: {
					halfneg: true,
					effect: {
						player(card, player, target, current) {
							if (get.color(card) == "red") return [1, 0, 1, -2];
						},
					},
				},
			},
			chizhen: {
				trigger: { player: "phaseUseBegin" },
				frequent: true,
				content() {
					"step 0";
					event.num = Math.max(1, player.maxHp - player.hp);
					player.draw(event.num);
					"step 1";
					player.chooseToDiscard("he", event.num, true);
					"step 2";
					var useCard = false;
					if (result.bool && result.cards) {
						for (var i = 0; i < result.cards.length; i++) {
							if (result.cards[i].name == "sha") {
								useCard = true;
								break;
							}
						}
					}
					if (useCard) {
						player
							.chooseTarget("是否视为使用一张决斗？", function (card, player, target) {
								return lib.filter.targetEnabled({ name: "juedou" }, player, target);
							})
							.set("ai", function (target) {
								return get.effect(target, { name: "juedou" }, _status.event.player);
							});
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool) {
						player.useCard({ name: "juedou" }, result.targets);
					}
				},
				ai: {
					threaten(player, target) {
						return Math.sqrt(Math.max(1, target.maxHp - target.hp));
					},
				},
			},
			xiuhua: {
				trigger: { global: ["loseEnd", "discardAfter"] },
				filter(event, player) {
					if (event.player == player) return false;
					if (event.name == "lose" && event.parent.name != "equip") return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) == "equip" && get.position(event.cards[i]) == "d") {
							return true;
						}
					}
				},
				frequent: true,
				content() {
					"step 0";
					if (trigger.delay == false) game.delay();
					"step 1";
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) == "equip" && get.position(trigger.cards[i]) == "d") {
							cards.push(trigger.cards[i]);
						}
					}
					if (cards.length) {
						player.gain(cards, "gain2", "log");
					}
				},
			},
			liuying: {
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (!player.storage.liuying) player.storage.liuying = [];
					return (
						event.card &&
						event.card.name == "sha" &&
						game.hasPlayer(function (current) {
							return (
								!player.storage.liuying.includes(current) &&
								player.canUse("sha", current, false)
							);
						})
					);
				},
				direct: true,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("liuying"), function (card, player, target) {
						return (
							!player.storage.liuying.includes(target) && player.canUse("sha", target, false)
						);
					}).ai = function (target) {
						return get.effect(target, { name: "sha" }, player, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("liuying", result.targets);
						event.target = result.targets[0];
						var cards = get.cards();
						player.showCards(
							cards,
							get.translation(player) +
								"对" +
								get.translation(result.targets) +
								"发动了【流影】"
						);
						event.bool = get.color(cards[0]) == "black";
					} else {
						event.finish();
					}
					"step 2";
					if (event.bool) {
						player.useCard({ name: "sha" }, event.target, false).animate = false;
					}
				},
				group: ["liuying_count1", "liuying_count2"],
				subSkill: {
					count1: {
						trigger: { player: "shaAfter" },
						silent: true,
						content() {
							if (!player.storage.liuying) player.storage.liuying = [];
							player.storage.liuying.add(trigger.target);
						},
					},
					count2: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content() {
							delete player.storage.liuying;
						},
					},
				},
			},
			yanjia: {
				enable: "phaseUse",
				filter(event, player) {
					var he = player.getCards("he");
					var num = 0;
					for (var i = 0; i < he.length; i++) {
						var info = lib.card[he[i].name];
						if (
							info.type == "equip" &&
							!info.nomod &&
							!info.unique &&
							lib.inpile.includes(he[i].name)
						) {
							num++;
							if (num >= 2) return true;
						}
					}
				},
				filterCard(card) {
					if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) return false;
					var info = get.info(card);
					return (
						info.type == "equip" && !info.nomod && !info.unique && lib.inpile.includes(card.name)
					);
				},
				selectCard: 2,
				position: "he",
				check(card) {
					return get.value(card);
				},
				content() {
					var name = cards[0].name + "_" + cards[1].name;
					var info1 = get.info(cards[0]),
						info2 = get.info(cards[1]);
					if (!lib.card[name]) {
						var info = {
							enable: true,
							type: "equip",
							subtype: get.subtype(cards[0]),
							vanish: true,
							cardimage: info1.cardimage || cards[0].name,
							filterTarget(card, player, target) {
								return target == player;
							},
							selectTarget: -1,
							modTarget: true,
							content: lib.element.content.equipCard,
							legend: true,
							source: [cards[0].name, cards[1].name],
							onEquip: [],
							onLose: [],
							skills: [],
							distance: {},
							ai: {
								order: 8.9,
								equipValue: 10,
								useful: 2.5,
								value(card, player) {
									var value = 0;
									var info = get.info(card);
									var current = player.getEquip(info.subtype);
									if (current && card != current) {
										value = get.value(current, player);
									}
									var equipValue = info.ai.equipValue || info.ai.basic.equipValue;
									if (typeof equipValue == "function")
										return equipValue(card, player) - value;
									return equipValue - value;
								},
								result: {
									target(player, target) {
										return get.equipResult(player, target, name);
									},
								},
							},
						};
						for (var i in info1.distance) {
							info.distance[i] = info1.distance[i];
						}
						for (var i in info2.distance) {
							if (typeof info.distance[i] == "number") {
								info.distance[i] += info2.distance[i];
							} else {
								info.distance[i] = info2.distance[i];
							}
						}
						if (info1.skills) {
							info.skills = info.skills.concat(info1.skills);
						}
						if (info2.skills) {
							info.skills = info.skills.concat(info2.skills);
						}
						if (info1.onEquip) {
							if (Array.isArray(info1.onEquip)) {
								info.onEquip = info.onEquip.concat(info1.onEquip);
							} else {
								info.onEquip.push(info1.onEquip);
							}
						}
						if (info2.onEquip) {
							if (Array.isArray(info2.onEquip)) {
								info.onEquip = info.onEquip.concat(info2.onEquip);
							} else {
								info.onEquip.push(info2.onEquip);
							}
						}
						if (info1.onLose) {
							if (Array.isArray(info1.onLose)) {
								info.onLose = info.onLose.concat(info1.onLose);
							} else {
								info.onLose.push(info1.onLose);
							}
						}
						if (info2.onLose) {
							if (Array.isArray(info2.onLose)) {
								info.onLose = info.onLose.concat(info2.onLose);
							} else {
								info.onLose.push(info2.onLose);
							}
						}
						if (info.onEquip.length == 0) delete info.onEquip;
						if (info.onLose.length == 0) delete info.onLose;
						lib.card[name] = info;
						lib.translate[name] =
							get.translation(cards[0].name, "skill") + get.translation(cards[1].name, "skill");
						var str = lib.translate[cards[0].name + "_info"];
						if (str[str.length - 1] == "." || str[str.length - 1] == "。") {
							str = str.slice(0, str.length - 1);
						}
						lib.translate[name + "_info"] = str + "；" + lib.translate[cards[1].name + "_info"];
						try {
							game.addVideo("newcard", null, {
								name: name,
								translate: lib.translate[name],
								info: lib.translate[name + "_info"],
								card: cards[0].name,
								legend: true,
							});
						} catch (e) {
							console.log(e);
						}
					}
					player.gain(
						game.createCard({ name: name, suit: cards[0].suit, number: cards[0].number }),
						"gain2"
					);
				},
				ai: {
					order: 9.5,
					result: {
						player: 1,
					},
				},
			},
			meiying: {
				globalSilent: true,
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return (
						event.player != player &&
						event.player.isAlive() &&
						player.countCards("he", { color: "red" }) > 0 &&
						event.player.getHistory("useCard", (evt) => {
							return evt.targets && evt.targets.some((i) => i !== event.player);
						}).length === 0
					);
				},
				direct: true,
				content() {
					"step 0";
					var next = player.chooseToDiscard(
						"he",
						"魅影：是否弃置一张红色牌视为对" + get.translation(trigger.player) + "使用一张杀？"
					);
					next.logSkill = ["meiying", trigger.player];
					var eff = get.effect(trigger.player, { name: "sha" }, player, player);
					next.ai = function (card) {
						if (eff > 0) {
							return 7 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						player.useCard({ name: "sha" }, trigger.player).animate = false;
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			jianwu: {
				trigger: { player: "shaBegin" },
				forced: true,
				filter(event, player) {
					return get.distance(event.target, player, "attack") > 1;
				},
				content() {
					trigger.directHit = true;
				},
			},
			zuizhan: {
				trigger: { player: "useCard" },
				popup: false,
				filter(event, player) {
					if (event.card.name != "sha") return false;
					return game.hasPlayer(function (current) {
						return (
							event.targets.includes(current) == false &&
							current != player &&
							lib.filter.targetEnabled(event.card, player, current)
						);
					});
				},
				content() {
					var list = game.filterPlayer(function (current) {
						return (
							trigger.targets.includes(current) == false &&
							current != player &&
							lib.filter.targetEnabled(trigger.card, player, current)
						);
					});
					if (list.length) {
						event.target = list.randomGet();
						player.line(event.target, "green");
						game.log(event.target, "被追加为额外目标");
						trigger.targets.push(event.target);
						player.draw();
					}
				},
			},
			xidie: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter(event, player) {
					return player.countCards("h") > player.hp;
				},
				content() {
					"step 0";
					var next = player.chooseToDiscard(get.prompt("xidie"), [
						1,
						Math.min(3, player.countCards("h") - player.hp),
					]);
					next.ai = function (card) {
						return 6 - get.value(card);
					};
					next.logSkill = "xidie";
					"step 1";
					if (result.bool) {
						player.storage.xidie = result.cards.length;
					}
				},
				group: "xidie2",
			},
			xidie2: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.storage.xidie > 0;
				},
				content() {
					player.draw(player.storage.xidie);
					player.storage.xidie = 0;
				},
			},
			meihu: {
				trigger: { player: "damageEnd" },
				check(event, player) {
					return get.attitude(player, event.source) < 4;
				},
				filter(event, player) {
					return event.source && event.source != player && event.source.countCards("h") > 0;
				},
				logTarget: "source",
				content() {
					"step 0";
					trigger.source.chooseCard("交给" + get.translation(player) + "一张手牌", true).ai =
						function (card) {
							return -get.value(card);
						};
					"step 1";
					if (result.bool) {
						player.gain(result.cards[0], trigger.source);
						trigger.source.$give(1, player);
					}
				},
				ai: {
					maixie_defend: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
								return [1, 0, 0, -0.5];
							}
						},
					},
				},
			},
			xlqianhuan: {
				trigger: { player: "phaseAfter" },
				check(event, player) {
					return player.hp == 1 || player.isTurnedOver();
				},
				filter(event, player) {
					return player.hp < player.maxHp;
				},
				content() {
					"step 0";
					player.recover();
					"step 1";
					player.turnOver();
				},
				mod: {
					targetEnabled(card, player, target) {
						if (target.isTurnedOver()) return false;
					},
					cardEnabled(card, player) {
						if (player.isTurnedOver()) return false;
					},
				},
			},
			fumo: {
				trigger: { player: "damageAfter" },
				filter(event, player) {
					return (
						(event.source &&
							event.source.isAlive() &&
							player.countCards("h", { color: "red" }) > 1) ||
						player.countCards("h", { color: "black" }) > 1
					);
				},
				direct: true,
				content() {
					"step 0";
					var next = player
						.chooseToDiscard(get.prompt("fumo", trigger.source), 2, function (card) {
							if (get.damageEffect(trigger.source, player, player, "thunder") <= 0) return 0;
							if (ui.selected.cards.length) {
								return get.color(card) == get.color(ui.selected.cards[0]);
							}
							return player.countCards("h", { color: get.color(card) }) > 1;
						})
						.set("complexCard", true);
					next.ai = function (card) {
						if (get.damageEffect(trigger.source, player, player, "thunder") > 0) {
							return 8 - get.value(card);
						}
						return 0;
					};
					next.logSkill = ["fumo", trigger.source, "thunder"];
					"step 1";
					if (result.bool) {
						trigger.source.damage("thunder");
					}
				},
				ai: {
					maixie_defend: true,
					threaten: 0.8,
				},
			},
			fanyin: {
				trigger: { player: "phaseEnd" },
				direct: true,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("fanyin"), function (card, player, target) {
						// if(player==target) return false;
						if (target.isLinked()) return true;
						if (target.isTurnedOver()) return true;
						if (target.countCards("j")) return true;
						if (target.isMinHp() && target.isDamaged()) return true;
						return false;
					}).ai = function (target) {
						var num = 0;
						var att = get.attitude(player, target);
						if (att > 0) {
							if (target.isMinHp()) {
								num += 5;
							}
							if (target.isTurnedOver()) {
								num += 5;
							}
							if (target.countCards("j")) {
								num += 2;
							}
							if (target.isLinked()) {
								num++;
							}
							if (num > 0) {
								return num + att;
							}
						}
						return num;
					};
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill("fanyin", event.target);
					} else {
						event.finish();
					}
					"step 2";
					if (event.target.isLinked()) {
						event.target.link();
					}
					"step 3";
					if (event.target.isTurnedOver()) {
						event.target.turnOver();
					}
					"step 4";
					var cards = event.target.getCards("j");
					if (cards.length) {
						event.target.discard(cards);
					}
					"step 5";
					if (event.target.isMinHp()) {
						event.target.recover();
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.3,
				},
			},
			mingkong: {
				trigger: { player: "damageBegin" },
				forced: true,
				filter(event, player) {
					return player.countCards("h") == 0 && event.num >= 1;
				},
				content() {
					if (trigger.num >= 1) {
						trigger.num--;
					}
					if (trigger.source) {
						trigger.source.storage.mingkong = true;
						trigger.source.addTempSkill("mingkong2");
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage") && target.countCards("h") == 0) {
								if (player.hasSkillTag("jueqing", false, target)) return;
								return 0.1;
							}
						},
					},
				},
			},
			mingkong2: {
				trigger: { source: ["damageEnd", "damageZero"] },
				forced: true,
				popup: false,
				audio: false,
				vanish: true,
				filter(event, player) {
					return player.storage.mingkong ? true : false;
				},
				content() {
					player.draw();
					player.storage.mingkong = false;
					player.removeSkill("mingkong2");
				},
			},
			yuehua: {
				trigger: { player: ["useCardAfter", "respondAfter", "discardAfter"] },
				frequent: true,
				filter(event, player) {
					if (player == _status.currentPhase) return false;
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.color(event.cards[i]) == "red" && event.cards[i].original != "j")
								return true;
						}
					}
					return false;
				},
				content() {
					player.draw();
				},
				ai: {
					threaten: 0.7,
				},
			},
			qinglan: {
				trigger: { global: "damageBefore" },
				filter(event, player) {
					return Boolean(event.nature) && player.countCards("he") > 0;
				},
				direct: true,
				priority: -5,
				content() {
					"step 0";
					var next = player.chooseToDiscard(get.prompt("qinglan", trigger.player), "he");
					next.logSkill = ["qinglan", trigger.player];
					next.ai = function (card) {
						if (trigger.num > 1 || !trigger.source) {
							if (get.attitude(player, trigger.player) > 0) {
								return 9 - get.value(card);
							}
							return -1;
						} else if (get.attitude(player, trigger.player) > 0) {
							if (trigger.player.hp == 1) {
								return 8 - get.value(card);
							}
							if (trigger.source.hp == trigger.source.maxHp) {
								return 6 - get.value(card);
							}
						} else if (
							get.attitude(player, trigger.source) > 0 &&
							trigger.source.hp < trigger.source.maxHp &&
							trigger.num <= 1 &&
							trigger.player.hp > 1
						) {
							if (get.color(card) == "red") return 5 - get.value(card);
						}
						return -1;
					};
					"step 1";
					if (result.bool) {
						trigger.cancel();
						if (trigger.source) {
							trigger.source.recover();
						}
					} else {
						event.finish();
					}
					"step 2";
					if (trigger.source) {
						trigger.source.draw();
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			fanshi: {
				trigger: { player: "phaseDiscardAfter" },
				forced: true,
				filter(event, player) {
					return player.getStat("damage") > 0;
				},
				check(event, player) {
					return player.hp == player.maxHp;
				},
				content() {
					"step 0";
					player.loseHp();
					"step 1";
					player.draw();
				},
			},
			xuelu: {
				unique: true,
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return player.maxHp > player.hp && player.countCards("he", { color: "red" }) > 0;
				},
				// alter:true,
				content() {
					"step 0";
					player.chooseCardTarget({
						position: "he",
						filterTarget(card, player, target) {
							return player != target;
						},
						filterCard(card, player) {
							return get.color(card) == "red" && lib.filter.cardDiscardable(card, player);
						},
						ai1(card) {
							return 9 - get.value(card);
						},
						ai2(target) {
							return get.damageEffect(target, player, player, "fire");
						},
						prompt: get.prompt("xuelu"),
					});
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill("xuelu", event.target, "fire");
						if (get.is.altered("xuelu")) {
							event.num = 1;
						} else {
							event.num = Math.min(2, Math.ceil((player.maxHp - player.hp) / 2));
						}
						player.discard(result.cards);
					} else {
						event.finish();
					}
					"step 2";
					if (event.target) {
						event.target.damage(event.num, "fire");
					}
				},
				ai: {
					maixie: true,
					expose: 0.2,
					threaten(player, target) {
						if (target.hp == 1) return 3;
						if (target.hp == 2) return 1.5;
						return 0.5;
					},
					effect: {
						target(card, player, target) {
							if (!target.hasFriend()) return;
							if (get.tag(card, "damage")) {
								if (target.hp == target.maxHp) return [0, 1];
							}
							if (get.tag(card, "recover") && player.hp >= player.maxHp - 1) return [0, 0];
						},
					},
				},
			},
			shahun: {
				enable: "chooseToUse",
				skillAnimation: true,
				animationColor: "fire",
				derivation: "juejing",
				// alter:true,
				filter(event, player) {
					return !player.storage.shahun && player.hp <= 0;
				},
				content() {
					"step 0";
					var cards = player.getCards("hej");
					player.discard(cards);
					"step 1";
					if (player.isLinked()) player.link();
					"step 2";
					if (player.isTurnedOver()) player.turnOver();
					"step 3";
					player.draw(3);
					"step 4";
					player.recover(1 - player.hp);
					player.removeSkill("fanshi");
					player.addSkill("juejing");
					player.storage.shahun = 2;
					player.markSkill("shahun");
					game.addVideo("storage", player, ["shahun", player.storage.shahun]);
				},
				group: "shahun2",
				intro: {
					content: "turn",
				},
				ai: {
					save: true,
					skillTagFilter(player) {
						if (player.storage.shahun) return false;
						if (player.hp > 0) return false;
					},
					result: {
						player: 3,
					},
				},
			},
			shahun2: {
				trigger: { player: "phaseAfter" },
				forced: true,
				filter(event, player) {
					return player.storage.shahun ? true : false;
				},
				content() {
					if (player.storage.shahun > 1) {
						player.storage.shahun--;
						game.addVideo("storage", player, ["shahun", player.storage.shahun]);
					} else {
						player.die();
					}
				},
			},
			xuanning: {
				group: ["xuanning1", "xuanning2"],
				intro: {
					content: "mark",
				},
				ai: {
					threaten: 0.9,
				},
			},
			xuanning1: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.countCards("h", { type: "basic" }) > 0 && player.storage.xuanning != 3;
				},
				filterCard(card) {
					return get.type(card) == "basic";
				},
				check(card) {
					return 7 - get.useful(card);
				},
				content() {
					player.storage.xuanning = 3;
					player.markSkill("xuanning");
					game.addVideo("storage", player, ["xuanning", player.storage.xuanning]);
				},
				ai: {
					result: {
						player(player) {
							var num = player.countCards("h");
							if (num > player.hp + 1) return 1;
							if (player.storage.xuanning >= 2) return 0;
							if (num > player.hp) return 1;
							if (player.storage.xuanning >= 1) return 0;
							return 1;
						},
					},
					order: 5,
				},
			},
			xuanning2: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					if (player.storage.xuanning) {
						return event.source && event.source.countCards("he") > 0;
					}
					return false;
				},
				logTarget: "source",
				content() {
					var he = trigger.source.getCards("he");
					if (he.length) {
						trigger.source.discard(he.randomGet());
					}
					player.storage.xuanning--;
					if (!player.storage.xuanning) {
						player.unmarkSkill("xuanning");
					}
					game.addVideo("storage", player, ["xuanning", player.storage.xuanning]);
				},
				ai: {
					maixie_defend: true,
				},
			},
			liuguang: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter(event, player) {
					if (player.storage.xuanning) return true;
					return false;
				},
				content() {
					"step 0";
					player.chooseTarget(
						function (card, player, target) {
							return player != target;
						},
						get.prompt("liuguang"),
						[1, 3]
					).ai = function (target) {
						return get.damageEffect(target, player, player);
					};
					"step 1";
					if (result.bool) {
						player.storage.xuanning--;
						if (!player.storage.xuanning) {
							player.unmarkSkill("xuanning");
						}
						event.targets = result.targets.slice(0);
						event.targets.sort(lib.sort.seat);
						player.logSkill("liuguang", result.targets);
						game.addVideo("storage", player, ["xuanning", player.storage.xuanning]);
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets.length) {
						var target = event.targets.shift();
						var next = target.chooseToDiscard("流光：弃置一张牌或受到1点伤害", "he");
						next.ai = function (card) {
							if (get.damageEffect(_status.event.player, player, _status.event.player) >= 0)
								return -1;
							if (_status.event.player.hp == 1) return 9 - get.value(card);
							return 8 - get.value(card);
						};
						next.autochoose = function () {
							return this.player.countCards("he") == 0;
						};
						event.current = target;
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool && result.cards && result.cards.length) {
						event.goto(2);
					} else {
						event.current.damage();
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.3,
				},
			},
			yangming: {
				enable: "phaseUse",
				filter(event, player) {
					if (player.storage.yangming2 > 0) return false;
					return player.countCards("h", { color: "red" }) > 0;
				},
				filterCard(card) {
					return get.color(card) == "red";
				},
				content() {
					player.storage.yangming2 = 2;
					player.addSkill("yangming2");
					game.addVideo("storage", player, ["yangming2", player.storage.yangming2]);
				},
				check(card) {
					return 6 - get.value(card);
				},
				ai: {
					result: {
						player(player) {
							if (player.countCards("h") <= player.hp && player.hp == player.maxHp) {
								return 0;
							}
							return 1;
						},
					},
					order: 6,
					threaten: 1.3,
				},
			},
			yangming2: {
				trigger: { player: "phaseUseEnd" },
				direct: true,
				mark: true,
				content() {
					"step 0";
					player.storage.yangming2--;
					game.addVideo("storage", player, ["yangming2", player.storage.yangming2]);
					if (player.storage.yangming2 > 0) {
						event.finish();
					} else {
						player.removeSkill("yangming2");
						var num = game.countPlayer(function (current) {
							return get.distance(player, current) <= 1 && current.isDamaged();
						});
						if (num == 0) {
							event.finish();
						} else {
							player.chooseTarget(
								function (card, player, target) {
									return get.distance(player, target) <= 1 && target.hp < target.maxHp;
								},
								"请选择目标回复体力",
								[1, num]
							);
						}
					}
					"step 1";
					if (result.bool) {
						player.logSkill("yangming", result.targets);
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].recover();
						}
					}
				},
				intro: {
					content: "turn",
				},
			},
			zhaolu: {
				unique: true,
				mark: true,
				check() {
					return false;
				},
				init(player) {
					player.storage.zhaolu = Math.min(5, game.players.length);
					game.addVideo("storage", player, ["zhaolu", player.storage.zhaolu]);
				},
				trigger: { player: ["phaseEnd", "damageEnd"], global: "dieAfter" },
				forced: true,
				content() {
					var num = 2;
					if (typeof trigger.num == "number") num = 2 * trigger.num;
					if (trigger.name == "phase") num = 1;
					if (trigger.name == "die") num = 2;
					player.storage.zhaolu -= num;
					if (player.storage.zhaolu <= 0) {
						player.loseMaxHp(true);
						player.storage.zhaolu = Math.min(5, game.players.length);
					}
					game.addVideo("storage", player, ["zhaolu", player.storage.zhaolu]);
				},
				intro: {
					content: "turn",
				},
				ai: {
					neg: true,
					mingzhi: false,
					threaten: 0.8,
				},
			},
			jiehuo: {
				unique: true,
				skillAnimation: true,
				animationColor: "fire",
				enable: "phaseUse",
				line: "fire",
				filterTarget(card, player, target) {
					return player != target;
				},
				content() {
					"step 0";
					target.damage(2, "fire");
					player.awakenSkill("jiehuo");
					"step 1";
					player.die();
				},
				ai: {
					order: 1,
					result: {
						player(player, target) {
							if (player.hp > 1) return false;
							if (target.hp > 2) return false;
							if (get.attitude(player, target) >= 0) return false;
							return get.damageEffect(target, player, player, "fire");
						},
					},
				},
			},
			jiehuo2: {
				trigger: { player: "phaseUseEnd" },
				forced: true,
				popup: false,
				content() {
					player.die();
				},
			},
			yuling: {
				unique: true,
				locked: true,
				group: ["yuling1", "yuling2", "yuling3", "yuling4", "yuling5", "yuling6"],
				intro: {
					content: "time",
				},
				// alter:true,
				ai: {
					noh: true,
					threaten: 0.8,
					effect: {
						target(card, player, target) {
							if (card.name == "bingliang") return [0, 0];
							if (card.name == "lebu") return 1.5;
							if (card.name == "guohe") {
								if (!target.countCards("e")) return 0;
								return 0.5;
							}
							if (card.name == "liuxinghuoyu") return 0;
						},
					},
				},
			},
			yuling1: {
				trigger: { player: ["phaseDrawBefore", "phaseDiscardBefore"] },
				priority: 10,
				forced: true,
				popup: false,
				check() {
					return false;
				},
				content() {
					trigger.cancel();
				},
			},
			yuling2: {
				trigger: { player: ["loseEnd", "drawEnd"], global: "gameDrawAfter" },
				check(event, player) {
					return player.countCards("h") < 2;
				},
				priority: 10,
				forced: true,
				filter(event, player) {
					return player.countCards("h") < 5;
				},
				content() {
					player.draw(5 - player.countCards("h"));
				},
			},
			yuling3: {
				trigger: { player: "gainEnd" },
				priority: 10,
				forced: true,
				filter(event, player) {
					return player.countCards("h") > 5;
				},
				check(event, player) {
					return player.countCards("h") < 2;
				},
				content() {
					player.chooseToDiscard(true, player.countCards("h") - 5);
				},
			},
			yuling4: {
				mod: {
					cardEnabled(card, player) {
						if (_status.currentPhase != player) return;
						var num = 2;
						if (get.is.altered("yuling")) num = 1;
						if (player.countUsed() >= player.maxHp + num) return false;
					},
				},
			},
			yuling5: {
				trigger: { player: ["useCardAfter", "phaseBegin"] },
				silent: true,
				content() {
					player.storage.yuling = player.maxHp + 2 - player.countUsed();
				},
			},
			yuling6: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					delete player.storage.yuling;
				},
			},
		},
		translate: {
			gjqt_bailitusu: "百里屠苏",
			gjqt_fengqingxue: "风晴雪",
			gjqt_fanglansheng: "方兰生",
			gjqt_xiangling: "襄铃",
			gjqt_yinqianshang: "尹千觞",
			gjqt_hongyu: "红玉",
			gjqt_ouyangshaogong: "欧阳少恭",
			gjqt_xunfang: "巽芳",

			gjqt_yuewuyi: "乐无异",
			gjqt_wenrenyu: "闻人羽",
			gjqt_xiayize: "夏夷则",
			gjqt_aruan: "阿阮",
			gjqt_xieyi: "谢衣",
			gjqt_yanjiaxieyi: "偃甲谢衣",
			gjqt_chuqi: "初七",

			gjqt_beiluo: "北洛",
			gjqt_yunwuyue: "云无月",
			gjqt_cenying: "岑缨",

			yunyou: "云游",
			yunyou_info: "每两轮限一次，出牌阶段，你可以发现一张地图牌本局未使用过的地图牌并使用之。",
			xuanzhen: "玄阵",
			// xuanzhen_bg:'阵',
			xuanzhen_info: "每轮限一次，当你成为一名其他角色的卡牌惟一目标时，你可以发现一张牌代替此牌。",
			qingshu: "青书",
			qingshu_info:
				"结束阶段，你可以令一名角色永久获得一个你使用过且不是当前地图的地图牌效果（每个地图最多发动一次）。",
			yanjiadan_heart: "偃甲蛋",
			yanjiadan_heart_info: "可以当作紫阳丹、玉女元参或沙棠使用。",
			yanjiadan_diamond: "偃甲蛋",
			yanjiadan_diamond_info: "可以当作流风散、舒筋散或神火飞鸦使用。",
			yanjiadan_club: "偃甲蛋",
			yanjiadan_club_info: "可以当作天女散花、六骰格或锦里针使用。",
			yanjiadan_spade: "偃甲蛋",
			yanjiadan_spade_info: "可以当作飞镖、乾坤镖或龙须钩使用。",
			lingyan: "灵偃",
			lingyan_bg: "偃",
			lingyan_info:
				"出牌阶段限一次，你可以将一张点数与武将牌上的牌均不同的手牌置于武将牌上，然后获得与其花色对应的一枚偃甲蛋。",
			xunjian: "寻剑",
			xunjian_info:
				"锁定技，每当你使用或打出一张牌，若牌堆中有同名牌，你有X的机率获得之，X为你的“灵偃”牌数/13。",
			xianju: "仙居",
			xianju_info:
				"锁定技，奇数游戏轮次开始时，你获得潜行直到下一轮开始；偶数游戏轮次开始时，你随机获得一张机关牌。",
			xuanci: "旋刺",
			xuanci_info:
				"出牌阶段限一次，你可以将一张梅花牌当作飞镖使用；锁定技，你使用飞镖无距离限制，你使用飞镖后对目标结算后视为对目标使用一张【杀】。",
			humeng: "湖梦",
			humeng_sub: "偃甲谢衣",
			humeng_info:
				"觉醒技，当你使用过4种不同的偃甲蛋后，你获得替身偃甲谢衣；觉醒技，当你进入濒死状态时，你弃置所有牌，摸四张牌，变身为初七并激活偃甲谢衣。",
			yange: "魇歌",
			yange_info:
				"游戏开始时，你获得数量等于敌方角色数的“魇”标记；准备阶段开始时，你可以移去一枚“魇”标记并变为一名其他存活角色的复制，此回合结束后你变回原角色。",
			woxue: "卧雪",
			woxue_info: "每当你于回合外使用或打出一张牌，你可以视为对当前回合角色使用【白霜】。",
			lingnu: "灵怒",
			lingnu_info:
				"锁定技，每当你造成1点伤害，你随机获得一个与杀相关的技能，技能在你行动3回合后消失（同一时间最多拥有3个以此法获得的技能）。",
			zhenying: "振影",
			zhenying_info:
				"每当你使用或打出一张非转化的黑色牌（装备或延时锦囊牌除外），你可以获得一张此牌的“替身”；你使用或打出“替身”牌后需弃置一张牌（没有则不弃）；当前回合结束后，“替身”牌消失。",
			cihong: "刺鸿",
			cihong_bg: "鸿",
			cihong_info:
				"每三轮限一次，结束阶段，你可以指定一名其他角色并可以依次选择：1. 弃置一张红色牌；2. 失去1点体力；3. 将武将牌翻至背面；每选择一项，视为对目标使用一张【杀】。",
			lianjing: "莲境",
			lianjing_info:
				"每两轮限一次，回合结束后，你可以选择至多2名其他角色，将其他角色移出游戏，然后你与所选的角色依次进行一个回合。",
			zuiji: "醉饮",
			zuiji_info: "出牌阶段，你可以将一张手牌或装备牌当作酒使用。",
			manwu: "曼舞",
			manwu_info: "在一名角色的结束阶段，若其手牌数为全场最少或之一，你可以令其摸一张牌。",
			xfanghua: "芳华",
			xfanghua_info: "在你成为红色牌的目标后，你可以回复1点体力。",
			yunyin: "云音",
			yunyin_info:
				"结束阶段，你可以弃置一张与本回合使用过的卡牌花色均不相同的手牌，视为使用一张基本牌或普通锦囊牌。",
			shishui: "逝水",
			shishui_info: "锁定技，每当你使用一张红色牌，你令目标失去1点体力。",
			duhun: "渡魂",
			duhun_info:
				"濒死阶段，你可以与一名体力值不超过你的体力上限的角色拼点，若你赢，你失去1点体力上限并与该角色交换体力值；若你没赢，你立即死亡。",
			duhun_info_alter:
				"濒死阶段，你可以与一名体力值不超过你的体力上限的角色拼点，若你赢，你失去1点体力上限并将体力值回复至与该角色相同；若你没赢，你立即死亡。",
			chizhen: "驰阵",
			chizhen_info:
				"出牌阶段开始时，你可以摸X张牌并弃置X张牌，若你弃置了【杀】，可以视为使用一张决斗（X为你已损失的体力值且至少为1）。",
			xidie: "戏蝶",
			xidie2: "戏蝶",
			xidie_info:
				"准备阶段，若你的手牌数大于体力值，可以弃置至多X张牌，并于结束阶段摸等量的牌，X为你的体力值与手牌数之差且不超过3。",
			meihu: "魅狐",
			meihu2: "魅狐",
			meihu_info: "当你受到伤害后，可令伤害来源交给你一张手牌。",
			jianwu: "剑舞",
			jianwu_info: "锁定技，攻击范围不含你的角色无法闪避你的【杀】。",
			meiying: "魅影",
			meiying_info:
				"一名其他角色的回合结束时，若其未于此回合内使用过指定另一名角色为目标的牌，你可以弃置一张红色牌视为对其使用一张【杀】。",
			zuizhan: "乱斩",
			zuizhan_info: "每当你使用一张【杀】，可以摸一张牌，然后此【杀】随机增加一个额外目标。",
			xlqianhuan: "千幻",
			xlqianhuan_info:
				"回合结束后，若你已受伤，你可以回复1点体力并将武将牌翻面。若你的武将牌背面朝上，你不能使用卡牌，也不能成为卡牌的目标。",
			fumo: "伏魔",
			fumo_info: "每当你受到一次伤害，可以弃置两张颜色相同的手牌并对伤害来源造成1点雷电伤害。",
			fanyin: "梵音",
			fanyin_info:
				"结束阶段，你可以令一名角色复原武将牌并移除判定区内的牌；若其体力值是全场最少的之一，其回复1点体力。",
			mingkong: "明空",
			mingkong_info: "锁定技，若你没有手牌，你受到的伤害-1，然后伤害来源摸一张牌。",
			qinglan: "晴岚",
			qinglan_info:
				"每当有一名角色即将受到属性伤害，你可以弃置一张牌令其防止此伤害，然后伤害来源摸一张牌并回复1点体力。",
			yuehua: "月华",
			yuehua_info: "每当你于回合外使用、打出或弃置红色牌，你可以摸一张牌。",
			xuelu: "血戮",
			xuelu_info:
				"结束阶段，若你已受伤，你可以弃置一张红色牌并对一名其他角色造成1点火焰伤害；若你已损失体力值不少于3，改为造成2点火焰伤害。",
			xuelu_info_alter: "结束阶段，若你已受伤，你可以弃置一张红色牌并对一名其他角色造成1点火焰伤害。",
			fanshi: "反噬",
			fanshi_info: "锁定技，弃牌阶段结束时，若你本回合内造成过伤害，你失去1点体力并摸一张牌。",
			shahun: "煞魂",
			shahun2: "煞魂",
			shahun_info:
				"限定技，濒死阶段，你可以复原武将牌，弃置所有牌并摸三张牌，然后将体力回复至1；若如此做，你失去技能〖反噬〗，获得技能〖绝境〗，并于两回合后立即死亡。",
			shahun_info_alter:
				"限定技，濒死阶段，你可以复原武将牌，弃置所有牌并摸三张牌，然后将体力回复至1；若如此做，你失去技能〖反噬〗，获得技能〖绝境〗，并于两回合后立即死亡。",

			yanjia: "偃甲",
			yanjia_info: "出牌阶段，你可以将两张非特殊装备牌合成为一张强化装备。",
			xiuhua: "袖花",
			xiuhua_info: "每当一件其他角色的装备因被替换或弃置进入弃牌堆，你可以获得之。",
			liuying: "流影",
			liuying_info:
				"每当你使用一张【杀】结算完毕后，你可以指定一名本回合未成为过你的【杀】的目标的角色，并亮出牌堆顶的一张牌，若为黑色，你对该角色使用一张【杀】。",
			boyun: "拨云",
			boyun1: "拨云",
			boyun2: "拨云",
			boyun_info:
				"在你的回合内，你可以弃置一张装备牌，并展示牌堆顶的一张牌，若其为装备牌，你须将其交给任意一张角色并对其造成1点伤害，否则你摸一张牌。",
			xuanning: "玄凝",
			xuanning1: "玄凝",
			xuanning2: "玄凝",
			liuguang: "流光",
			yangming: "养命",
			yangming2: "养命",
			xuanning_info:
				"出牌阶段，你可以弃置一基本牌，获得至多3个玄凝标记。当你受到伤害时，你失去一枚玄凝标记，伤害来源随机弃置一张牌。",
			liuguang_info:
				"准备阶段，若你有玄凝标记，你可以弃置一枚玄凝标记，选择至多三名角色依次令其选择一项：弃置一张牌，或受到1点伤害，并终止流光结算。",
			yangming_info:
				"出牌阶段，你可以弃置一张红色牌，并在下个出牌阶段结束时令距离1以内的任意名角色回复1点体力，在此之前不可再次发动。",
			zhaolu: "朝露",
			jiehuo: "劫火",
			yuling: "御灵",
			yuling1: "御灵",
			yuling2: "御灵",
			yuling3: "御灵",
			yuling4: "御灵",
			zhaolu_info:
				"锁定技，每隔X回合，你失去1点体力上限，每当你受到1点伤害或有人死亡，视为减少两个回合，X为现存角色数且至多为5。",
			jiehuo_info: "限定技，出牌阶段，你可以对一名其他角色造成2点火焰伤害，然后死亡。",
			yuling_info:
				"锁定技，你没有摸牌和弃牌阶段，你的手牌数始终为5，你在一个出牌阶段最多使用X+2张牌，X为你的体力上限。",
			yuling_info_alter:
				"锁定技，你没有摸牌和弃牌阶段，你的手牌数始终为5，你在一个出牌阶段最多使用X+1张牌，X为你的体力上限。",
		},
	};
});
