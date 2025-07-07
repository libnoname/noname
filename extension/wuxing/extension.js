import { lib, game, ui, get, ai, _status } from "../../noname.js";
import html from "../../game/dedent.js";

game.import("play", function () {
	return {
		name: "wuxing",
		arenaReady() {
			if (_status.connectMode) {
				return;
			}
			lib.card.list.splice(Math.floor(lib.card.list.length * Math.random()), 0, ["spade", 5, "wuxingpan"]);
			if (!_status.video) {
				lib.video.push({
					type: "play",
					name: "wuxing",
				});
			}
		},
		video() {
			for (const i in this.translate) {
				lib.translate[i] = this.translate[i];
			}
			for (const i in this.card) {
				lib.card[i] = this.card[i];
			}
			for (const i in this.skill) {
				lib.skill[i] = this.skill[i];
			}
		},
		element: {
			player: {
				init(player) {
					if (player.node.wuxing) {
						player.node.wuxing.remove();
					}
					if (_status.video || _status.connectMode) {
						return;
					}
					let node = ui.create.div(".wunature", player);
					let nature = ["metal", "wood", "water", "fire", "soil"].randomGet();
					player.wunature = nature;
					node.dataset.nature = nature;
					node.innerHTML = get.translation(nature);
					player.node.wuxing = node;
				},
			},
			card: {
				init(card) {
					if (_status.video || _status.connectMode) {
						return;
					}
					if (card.name == "wuxingpan") {
						return;
					}
					if (card.wunature) {
						return;
					}
					if (Math.random() > (parseFloat(lib.config.wuxing_num_playpackconfig) || 0)) {
						return;
					}
					let node = ui.create.div(".wunature", card);
					let nature = ["metal", "wood", "water", "fire", "soil"].randomGet();
					card.wunature = nature;
					node.dataset.nature = nature;
					node.innerHTML = get.translation(nature);
					card.node.wuxing = node;
					if (!card.suit || !card.number) {
						card.node.wuxing.style.display = "none";
					}
				},
			},
		},
		skill: {
			_shengke: {
				trigger: {
					target: "useCardToBegin"
				},
				forced: true,
				popup: false,
				filter(event, player) {
					if (_status.connectMode) {
						return false;
					}
					return event.card.wunature && player.wunature;
				},
				content() {
					switch (trigger.card.wunature) {
						case "metal":
							switch (player.wunature) {
								case "wood":
									if (player.countCards("he")) {
										game.log(player, `被${get.translation(trigger.card.wunature)}属性的卡牌克制`);
										player.chooseToDiscard("你被金属性卡牌克制，需弃置一张牌", true, "he").ai = get.disvalue;
										player.popup("金克木");
									}
									return;
								case "water":
									game.log(player, `得到${get.translation(trigger.card.wunature)}属性卡牌的加成`);
									player.draw();
									player.popup("金生水");
									return;
							}
							return;
						case "wood":
							switch (player.wunature) {
								case "soil":
									if (player.countCards("he")) {
										game.log(player, `被${get.translation(trigger.card.wunature)}属性的卡牌克制`);
										player.chooseToDiscard("你被木属性卡牌克制，需弃置一张牌", true, "he").ai = get.disvalue;
										player.popup("木克土");
									}
									return;
								case "fire":
									game.log(player, `得到${get.translation(trigger.card.wunature)}属性卡牌的加成`);
									player.draw();
									player.popup("木生火");
									return;
							}
							return;
						case "water":
							switch (player.wunature) {
								case "fire":
									if (player.countCards("he")) {
										game.log(player, `被${get.translation(trigger.card.wunature)}属性的卡牌克制`);
										player.chooseToDiscard("你被水属性卡牌克制，需弃置一张牌", true, "he").ai = get.disvalue;
										player.popup("水克火");
									}
									return;
								case "wood":
									game.log(player, `得到${get.translation(trigger.card.wunature)}属性卡牌的加成`);
									player.draw();
									player.popup("水生木");
									return;
							}
							return;
						case "fire":
							switch (player.wunature) {
								case "metal":
									if (player.countCards("he")) {
										game.log(player, `被${get.translation(trigger.card.wunature)}属性的卡牌克制`);
										player.chooseToDiscard("你被火属性卡牌克制，需弃置一张牌", true, "he").ai = get.disvalue;
										player.popup("火克金");
									}
									return;
								case "soil":
									game.log(player, `得到${get.translation(trigger.card.wunature)}属性卡牌的加成`);
									player.draw();
									player.popup("火生土");
									return;
							}
							return;
						case "soil":
							switch (player.wunature) {
								case "water":
									if (player.countCards("he")) {
										game.log(player, `被${get.translation(trigger.card.wunature)}属性的卡牌克制`);
										player.chooseToDiscard("你被土属性卡牌克制，需弃置一张牌", true, "he").ai = get.disvalue;
										player.popup("土克水");
									}
									return;
								case "metal":
									game.log(player, `得到${get.translation(trigger.card.wunature)}属性卡牌的加成`);
									player.draw();
									player.popup("土生金");
									return;
							}
							return;
					}
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							switch (card.wunature) {
								case "metal":
									switch (target.wunature) {
										case "wood":
											if (current != 0) {
												return [1, -0.3];
											}
											return;
										case "water":
											if (current != 0) {
												return [1, 0.3];
											}
											return;
									}
									return;
								case "wood":
									switch (target.wunature) {
										case "soil":
											if (current != 0) {
												return [1, -0.3];
											}
											return;
										case "fire":
											if (current != 0) {
												return [1, 0.3];
											}
											return;
									}
									return;
								case "water":
									switch (target.wunature) {
										case "fire":
											if (current != 0) {
												return [1, -0.3];
											}
											return;
										case "wood":
											if (current != 0) {
												return [1, 0.3];
											}
											return;
									}
									return;
								case "fire":
									switch (target.wunature) {
										case "metal":
											if (current != 0) {
												return [1, -0.3];
											}
											return;
										case "soil":
											if (current != 0) {
												return [1, 0.3];
											}
											return;
									}
									return;
								case "soil":
									switch (target.wunature) {
										case "water":
											if (current != 0) {
												return [1, -0.3];
											}
											return;
										case "metal":
											if (current != 0) {
												return [1, 0.3];
											}
											return;
									}
									return;
							}
						},
					},
				},
			},
			wuxingpan_skill: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				lose: false,
				prompt: "选择一张手牌永久改变其五行属性",
				content() {
					"step 0";
					player.chooseControl("metal", "wood", "water", "fire", "soil");
					"step 1";
					let card = cards[0];
					if (!card.node.wuxing) {
						card.node.wuxing = ui.create.div(".wunature", card);
					}

					card.wunature = result.control;
					card.node.wuxing.dataset.nature = result.control;
					card.node.wuxing.innerHTML = get.translation(result.control);
				},
			},
		},
		card: {
			wuxingpan: {
				type: "equip",
				subtype: "equip5",
				skills: ["wuxingpan_skill"],
				fullskin: true,
			},
		},
		translate: {
			metal: "金",
			wood: "木",
			water: "水",
			soil: "土",
			goldColor: "rgb(236,236,130)",
			woodColor: "rgb(149,202,147)",
			waterColor: "rgb(150,88,201)",
			fireColor: "rgb(236,132,106)",
			soilColor: "rgb(201,159,98)",
			goldColor2: "rgba(236,236,57,0.3)",
			woodColor2: "rgba(33,155,10,0.3)",
			waterColor2: "rgba(29,156,255,0.3)",
			fireColor2: "rgba(255,51,0,0.3)",
			soilColor2: "rgba(163,98,0,0.3)",
			wuxingpan: "五行盘",
			wuxingpan_skill: "五行",
			wuxingpan_skill_info: "出牌阶段限一次，你可以永久改变一张手牌的五行属性",
			wuxingpan_info: "出牌阶段限一次，你可以永久改变一张手牌的五行属性",
		},
		help: {
			"五行生克": {
				/**
				 * “五行生克”模式的帮助信息。
				 * @type {string}
				 */
				template: html`
					<div style="margin: 20px; font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6;">
						<h3 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; margin-bottom: 15px;">
							五行生克 规则说明
						</h3>
		
						<div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 5px; border-left: 4px solid #4CAF50;">
							<h4 style="margin-top: 0; margin-bottom: 10px; color: #4CAF50;">基本规则:</h4>
							<ul style="list-style: disc; padding-left: 20px; margin: 0;">
								<li>每名角色在游戏开始时随机获得一个五行属性 (金、木、水、火、土)。</li>
								<li>牌堆中约 <strong>1/3</strong> 的卡牌会随机获得一个五行属性。</li>
							</ul>
						</div>
		
						<div style="margin-bottom: 15px; padding: 10px; background-color: #eef7ff; border-radius: 5px; border-left: 4px solid #2196F3;">
							<h4 style="margin-top: 0; margin-bottom: 10px; color: #2196F3;">属性交互:</h4>
							<ul style="list-style: none; padding-left: 0; margin: 0;">
								<li>
									<strong style="color: #f44336;">【相克】</strong>
									当一名角色成为<strong style="color: #f44336;">克制自身属性</strong>的卡牌目标时：必须<strong>弃置</strong>一张手牌。
								</li>
								<li>
									<strong style="color: #8BC34A;">【相生】</strong>
									当一名角色成为<strong style="color: #8BC34A;">生成自身属性</strong>的卡牌目标时：必须<strong>摸取</strong>一张牌。
								</li>
							</ul>
						</div>
		
						<div style="margin-bottom: 15px; padding: 10px; background-color: #fff8e1; border-radius: 5px; border-left: 4px solid #FFC107;">
							<h4 style="margin-top: 0; margin-bottom: 10px; color: #FFC107;">生克循环:</h4>
							<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
								<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
									<strong style="color: #FFC107; border-bottom: 1px solid #FFC107;">金 (Metal)</strong><br/>
									<span style="color: #f44336;">克</span> 木 (Wood)<br/>
									<span style="color: #8BC34A;">生</span> 水 (Water)
								</div>
								<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
									<strong style="color: #4CAF50; border-bottom: 1px solid #4CAF50;">木 (Wood)</strong><br/>
									<span style="color: #f44336;">克</span> 土 (Earth)<br/>
									<span style="color: #8BC34A;">生</span> 火 (Fire)
								</div>
								<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
									<strong style="color: #2196F3; border-bottom: 1px solid #2196F3;">水 (Water)</strong><br/>
									<span style="color: #f44336;">克</span> 火 (Fire)<br/>
									<span style="color: #8BC34A;">生</span> 木 (Wood)
								</div>
								<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
									<strong style="color: #f44336; border-bottom: 1px solid #f44336;">火 (Fire)</strong><br/>
									<span style="color: #f44336;">克</span> 金 (Metal)<br/>
									<span style="color: #8BC34A;">生</span> 土 (Earth)
								</div>
								<div style="padding: 8px; border-radius: 4px; background-color: #fff;">
									<strong style="color: #795548; border-bottom: 1px solid #795548;">土 (Earth)</strong><br/>
									<span style="color: #f44336;">克</span> 水 (Water)<br/>
									<span style="color: #8BC34A;">生</span> 金 (Metal)
								</div>
							</div>
							<small style="display: block; text-align: center; margin-top: 10px; color: #777;">
								(温馨提醒：上古时代的老扩展了，希望你能喜欢)
							</small>
						</div>
					</div>
				`,
				/**
				 * 暂时没有，但不排除以后会有喵。
				 * @returns {object} 返回一个空对象。
				 */
				setup() {
					return {};
				}
			}
		},
	};
});
