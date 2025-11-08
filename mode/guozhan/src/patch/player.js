import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { GameEvent, Dialog, Player } from "../../../../noname/library/element/index.js";

export class PlayerGuozhan extends Player {
	/**
	 * @type {string}
	 */
	trueIdentity;

	/**
	 * 获取玩家的势力
	 *
	 * @param { number } [num = 0] - 根据哪张武将牌返回势力，`0`为主将，`1`为副将（默认为0）
	 * @returns { string }
	 */
	getGuozhanGroup(num = 0) {
		if (this.trueIdentity) {
			const group = lib.character[this[num == 1 ? "name2" : "name1"]][1];
			if (num != 2 && lib.selectGroup.includes(group)) {
				return group;
			}
			if (lib.character[this.name1][1] != "ye" || num == 1) {
				return this.trueIdentity;
			}
			return "ye";
		}
		if (get.is.double(this.name2)) {
			return lib.character[this.name1].group;
		}
		if (num == 1) {
			return lib.character[this.name2].group;
		}
		if (num == 2 && lib.selectGroup.includes(lib.character[this.name1][1])) {
			return lib.character[this.name2].group;
		}
		return lib.character[this.name1].group;
	}

	/**
	 * 选择军令
	 *
	 * @param { Player } target 执行军令的对象
	 * @returns
	 */
	chooseJunlingFor(target) {
		const next = game.createEvent("chooseJunlingFor");

		// @ts-expect-error 类型就是这么写的
		next.player = this;
		next.target = target;
		next.num = 2;

		// @ts-expect-error 类型就是这么写的
		next.setContent("chooseJunlingFor");

		return next;
	}

	/**
	 * 选择是否执行军令
	 *
	 * @param { Player } source 军令发起者
	 * @param { string } junling 军令内容
	 * @param { Player[] } targets 军令效果的对象
	 * @returns
	 */
	chooseJunlingControl(source, junling, targets) {
		const next = game.createEvent("chooseJunlingControl");
		// @ts-expect-error 类型就是这么写的
		next.player = this;
		next.source = source;
		// @ts-expect-error 类型就是这么写的
		next.junling = junling;
		if (targets.length) {
			next.targets = targets;
		}
		// @ts-expect-error 类型就是这么写的
		next.setContent("chooseJunlingControl");
		return next;
	}

	/**
	 * 执行军令
	 *
	 * @param { Player } source 军令发起者
	 * @param { string } junling 军令内容
	 * @param { Player[] } targets 军令效果的对象
	 * @returns
	 */
	carryOutJunling(source, junling, targets) {
		const next = game.createEvent("carryOutJunling");
		next.source = source;
		// @ts-expect-error 类型就是这么写的
		next.player = this;
		if (targets.length) {
			next.targets = targets;
		}
		// @ts-expect-error 类型就是这么写的
		next.junling = junling;
		// @ts-expect-error 类型就是这么写的
		next.setContent("carryOutJunling");
		return next;
	}

	/**
	 * 选择变更副将
	 *
	 * @param { boolean } [repeat] 是否强制变更，且当前变更副将技能不计入变更记录
	 * @param { "hidden" } [hidden] 是否暗置变更后的副将，若为`"hidden"`则暗置
	 * @returns
	 */
	mayChangeVice(repeat, hidden) {
		if (!this.playerid) {
			return;
		}
		const changedSkills = Reflect.get(_status, "changedSkills") ?? {};
		Reflect.set(_status, "changedSkills", changedSkills);
		const skill = _status.event?.name;
		if (repeat || !changedSkills[this.playerid] || !changedSkills[this.playerid].includes(skill)) {
			var next = game.createEvent("mayChangeVice");
			// @ts-expect-error 类型就是这么写的
			next.setContent("mayChangeVice");
			// @ts-expect-error 类型就是这么写的
			next.player = this;
			next.skill = skill;
			if (repeat || (!_status.connectMode && get.config("changeViceType") == "online")) {
				// @ts-expect-error 类型就是这么写的
				next.repeat = true;
			}
			if (hidden == "hidden") {
				// @ts-expect-error 类型就是这么写的
				next.hidden = true;
			}
			return next;
		}
	}

	// 后面摆了，相信后人的智慧

	/**
	 * 判断是否“不是”队友
	 *
	 * @param { Player } target 判断对象
	 * @param { boolean } [shown] 考虑自身身份已明确的情况
	 * @returns { boolean }
	 */
	differentIdentityFrom(target, shown) {
		// @ts-expect-error 类型就是这么写的
		if (this == target) {
			return false;
		}
		//野心家建国情况
		if (this.getStorage("yexinjia_friend").includes(target)) {
			return false;
		}
		if (target.getStorage("yexinjia_friend").includes(this)) {
			return false;
		}
		if (shown) {
			if (target.identity == "unknown") {
				return false;
			}
			if (target.identity == "ye" || this.identity == "ye") {
				return true;
			}
			if (this.identity == "unknown") {
				var identity = lib.character[this.name1][1];
				if (this.wontYe()) {
					return identity != target.identity;
				}
				return true;
			}
		} else {
			if (this.identity == "unknown" || target.identity == "unknown") {
				return false;
			}
			if (this.identity == "ye" || target.identity == "ye") {
				return true;
			}
		}
		return this.identity != target.identity;
	}

	/**
	 * 判断是否“是”队友
	 *
	 * @param { Player } target 判断对象
	 * @param { boolean } [shown] 考虑自身身份已明确的情况
	 * @returns { boolean }
	 */
	sameIdentityAs(target, shown) {
		if (this.getStorage("yexinjia_friend").includes(target)) {
			return true;
		}
		if (target.getStorage("yexinjia_friend").includes(this)) {
			return true;
		}
		if (shown) {
			if (this.identity == "ye" || this.identity == "unknown") {
				return false;
			}
		} else {
			// @ts-expect-error 类型就是这么写的
			if (this == target) {
				return true;
			}
			if (target.identity == "unknown" || target.identity == "ye" || this.identity == "ye") {
				return false;
			}
			if (this.identity == "unknown") {
				var identity = lib.character[this.name1][1];
				if (this.wontYe()) {
					return identity == target.identity;
				}
				return false;
			}
		}
		return this.identity == target.identity;
	}

	/**
	 * 判断玩家亮将情况
	 *
	 * @returns { object }
	 */
	getModeState() {
		return {
			unseen: this.isUnseen(0),
			unseen2: this.isUnseen(1),
		};
	}

	/**
	 * 设置玩家信息（主副将名称、身份）
	 *
	 * @param { object } info
	 */
	setModeState(info) {
		if (info.mode.unseen) {
			this.classList.add("unseen");
		}
		if (info.mode.unseen2) {
			this.classList.add("unseen2");
		}
		if (!info.name) {
			return;
		}
		// if(info.name.indexOf('unknown')==0){
		// 	if(this==game.me){
		// 		lib.translate[info.name]+='（你）';
		// 	}
		// }
		this.init(info.name1, info.name2, false);
		this.name1 = info.name1;
		this.name = info.name;
		this.node.name_seat = ui.create.div(".name.name_seat", get.verticalStr(lib.translate[this.name].slice(0, 3)), this);
		if (info.identityShown) {
			this.setIdentity(info.identity);
			this.node.identity.classList.remove("guessing");
			// @ts-expect-error 类型就是这么写的
		} else if (this != game.me) {
			// @ts-expect-error 类型就是这么写的
			this.node.identity.firstChild.innerHTML = "猜";
			this.node.identity.dataset.color = "unknown";
			this.node.identity.classList.add("guessing");
		}
	}
	dieAfter2(source) {
		var that = this;
		if (that.hasSkillTag("noDieAfter", null, source)) {
			return;
		}
		if (source && source.hasSkillTag("noDieAfter2", null, that)) {
			return;
		}
		if (source && source.shijun) {
			source.discard(source.getCards("he"));
			delete source.shijun;
		} else if (source && source.identity != "unknown") {
			if (source.identity == "ye" && !source.getStorage("yexinjia_friend").length) {
				source.draw(3);
			} else if (source.shijun2) {
				delete source.shijun2;
				source.draw(
					1 +
						game.countPlayer(function (current) {
							return current.group == that.group;
						})
				);
			} else if (that.identity == "ye") {
				if (that.getStorage("yexinjia_friend").includes(source) || source.getStorage("yexinjia_friend").includes(that)) {
					source.discard(source.getCards("he"));
				} else {
					source.draw(
						1 +
							game.countPlayer(function (current) {
								// @ts-expect-error 类型就是这么写的
								if (current == that) {
									return false;
								}
								if (current.getStorage("yexinjia_friend").includes(that)) {
									return true;
								}
								if (that.getStorage("yexinjia_friend").includes(current)) {
									return true;
								}
								return false;
							})
					);
				}
			} else if (that.identity != source.identity) {
				source.draw(get.population(that.identity) + 1);
			} else {
				source.discard(source.getCards("he"));
			}
		}
	}
	dieAfter(source) {
		this.showCharacter(2);
		if (get.is.jun(this.name1)) {
			if (source && source.identity == this.identity) {
				source.shijun = true;
			} else if (source && source.identity != "ye") {
				source.shijun2 = true;
			}
			var yelist = [];
			for (var i = 0; i < game.players.length; i++) {
				if (game.players[i].identity == this.identity) {
					yelist.push(game.players[i]);
				}
			}
			// @ts-expect-error 类型就是这么写的
			game.broadcastAll(function (list) {
				for (var i = 0; i < list.length; i++) {
					list[i].identity = "ye";
					list[i].setIdentity();
				}
			}, yelist);
			// @ts-expect-error 类型就是这么写的
			_status.yeidentity.add(this.identity);
		}
		// @ts-expect-error 类型就是这么写的
		game.tryResult();
	}

	/**
	 * 查看一名角色的主副将
	 *
	 * @param { Player } target 查看对象
	 * @param { number } [num] - 查看哪张武将牌，`0`为主将，`1`为副将，`2`为全部（默认为2）
	 */
	viewCharacter(target, num) {
		if (num != 0 && num != 1) {
			num = 2;
		}
		if (!target.isUnseen(num)) {
			return;
		}
		var next = game.createEvent("viewCharacter");
		// @ts-expect-error 类型就是这么写的
		next.player = this;
		next.target = target;
		next.num = num;
		next.setContent(function () {
			// @ts-expect-error 类型就是这么写的
			if (!player.storage.zhibi) {
				// @ts-expect-error 类型就是这么写的
				player.storage.zhibi = [];
			}
			// @ts-expect-error 类型就是这么写的
			player.storage.zhibi.add(target);
			var content,
				str = get.translation(target) + "的";
			// @ts-expect-error 类型就是这么写的
			if (event.num == 0 || !target.isUnseen(1)) {
				content = [str + "主将", [[target.name1], "character"]];
				// @ts-expect-error 类型就是这么写的
				game.log(player, "观看了", target, "的主将");
				// @ts-expect-error 类型就是这么写的
			} else if (event.num == 1 || !target.isUnseen(0)) {
				content = [str + "副将", [[target.name2], "character"]];
				// @ts-expect-error 类型就是这么写的
				game.log(player, "观看了", target, "的副将");
			} else {
				content = [str + "主将和副将", [[target.name1, target.name2], "character"]];
				// @ts-expect-error 类型就是这么写的
				game.log(player, "观看了", target, "的主将和副将");
			}
			// @ts-expect-error 类型就是这么写的
			player.chooseControl("ok").set("dialog", content);
		});
	}

	/**
	 * 判断副将技是否生效
	 *
	 * @param { string } skill 要判断的技能
	 * @param { false } [disable] 是否失效该技能，若为`false`则失效
	 */
	checkViceSkill(skill, disable) {
		if (game.expandSkills(lib.character[this.name2][3].slice(0)).includes(skill) || this.hasSkillTag("alwaysViceSkill")) {
			return true;
		} else {
			if (disable !== false) {
				this.awakenSkill(skill);
			}
			return false;
		}
	}
	/**
	 * 判断主将技是否生效
	 *
	 * @param { string } skill 要判断的技能
	 * @param { false } [disable] 是否失效该技能，若为`false`则失效
	 */
	checkMainSkill(skill, disable) {
		if (game.expandSkills(lib.character[this.name1][3].slice(0)).includes(skill) || this.hasSkillTag("alwaysMainSkill")) {
			return true;
		} else {
			if (disable !== false) {
				this.awakenSkill(skill);
			}
			return false;
		}
	}

	/**
	 * 减少玩家体力上限，不触发相关时机
	 *
	 * @param { number } [num] 减少的数值，默认为1
	 */
	removeMaxHp(num) {
		if (game.online) {
			return;
		}
		if (!num) {
			num = 1;
		}
		while (num > 0) {
			num--;
			if (typeof this.singleHp == "boolean") {
				if (this.singleHp) {
					this.singleHp = false;
				} else {
					this.singleHp = true;
					this.maxHp--;
				}
			} else {
				this.maxHp--;
			}
		}
		this.update();
	}

	/**
	 * 暗置武将
	 *
	 * @param { number } num - 暗置哪张武将牌，`0`为主将，`1`为副将
	 * @param { boolean } [log] 是否log信息
	 * @returns
	 */
	hideCharacter(num, log) {
		if (this.isUnseen(2)) {
			return;
		}
		var name = this["name" + (num + 1)];
		var next = game.createEvent("hideCharacter");
		// @ts-expect-error 类型就是这么写的
		next.player = this;
		// @ts-expect-error 类型就是这么写的
		next.toHide = name;
		next.num = num;
		// @ts-expect-error 类型就是这么写的
		next.log = log;
		// @ts-expect-error 类型就是这么写的
		next.setContent("hideCharacter");
		return next;
	}

	/**
	 * 移去武将牌（变成士兵）
	 *
	 * @param { number } num - 移去哪张武将牌，`0`为主将，`1`为副将
	 * @returns
	 */
	removeCharacter(num) {
		var name = this["name" + (num + 1)];
		var next = game.createEvent("removeCharacter");
		// @ts-expect-error 类型就是这么写的
		next.player = this;
		// @ts-expect-error 类型就是这么写的
		next.toRemove = name;
		next.num = num;
		next.setContent("removeCharacter");
		return next;
	}
	$removeCharacter(num) {
		var name = this["name" + (num + 1)];
		var info = lib.character[name];
		if (!info) {
			return;
		}
		var to = "gz_shibing" + (info[0] == "male" ? 1 : 2) + info[1];
		game.log(this, "移除了" + (num ? "副将" : "主将"), "#b" + name);
		if (!lib.character[to]) {
			// @ts-expect-error 类型就是这么写的
			lib.character[to] = [info[0], info[1], 0, [], [`character:${to.slice(3, 11)}`, "unseen"]];
			lib.translate[to] = `${get.translation(info[1])}兵`;
		}
		this.reinit(name, to, false);
		this.showCharacter(num, false);
		// @ts-expect-error 类型就是这么写的
		_status.characterlist.add(name);
	}

	/**
	 * 变更副将
	 *
	 * @param { boolean } [hidden] 是否暗置变更后的副将
	 * @returns
	 */
	changeVice(hidden) {
		var next = game.createEvent("changeVice");
		// @ts-expect-error 类型就是这么写的
		next.player = this;
		// @ts-expect-error 类型就是这么写的
		next.setContent("changeVice");
		next.num = !_status.connectMode && get.config("changeViceType") == "online" ? 1 : 3;
		if (hidden) {
			// @ts-expect-error 类型就是这么写的
			next.hidden = true;
		}
		return next;
	}

	/**
	 * 与一名角色的主副将进行易位
	 *
	 * @param { Player } target 要交换武将的对象
	 * @param { number } [num1=2]  - 自己要易位的武将牌，`1`为主将，`2`为副将（默认为2）
	 * @param { number } [num2=num1] - 交换对象要易位的武将牌，`1`为主将，`2`为副将（默认与前一个参数相同）
	 * @returns
	 */
	transCharacter(target, num1 = 2, num2 = num1) {
		var next = game.createEvent("transCharacter");
		// @ts-expect-error 类型就是这么写的
		next.player = this;
		next.target = target;
		// @ts-expect-error 类型就是这么写的
		next.num1 = num1;
		// @ts-expect-error 类型就是这么写的
		next.num2 = num2;
		// @ts-expect-error 类型就是这么写的
		next.setContent("transCharacter");
		return next;
	}
	/**
	 * 玩家是否有主将（不为士兵）
	 *
	 * @returns { boolean }
	 */
	hasMainCharacter() {
		return this.name1.indexOf("gz_shibing") != 0;
	}
	/**
	 * 玩家是否有副将（不为士兵）
	 *
	 * @returns { boolean }
	 */
	hasViceCharacter() {
		return this.name2.indexOf("gz_shibing") != 0;
	}
	$showCharacter(num, log) {
		var showYe = false;
		if (num == 0 && !this.isUnseen(0)) {
			return;
		}
		if (num == 1 && !this.isUnseen(1)) {
			return;
		}
		if (!this.isUnseen(2)) {
			return;
		}
		// @ts-expect-error 类型就是这么写的
		game.addVideo("showCharacter", this, num);
		if (this.identity == "unknown" || ((num == 0 || num == 2) && lib.character[this.name1][1] == "ye")) {
			this.group = this.getGuozhanGroup(num);
			if ((num == 0 || num == 2) && lib.character[this.name1][1] == "ye") {
				this.identity = "ye";
				if (!this._ye) {
					this._ye = true;
					showYe = true;
				}
			} else if (get.is.jun(this.name1) && this.isAlive()) {
				this.identity = this.group;
			} else if (this.wontYe(this.group)) {
				this.identity = this.group;
			} else {
				this.identity = "ye";
			}
			this.setIdentity(this.identity);
			this.ai.shown = 1;
			this.node.identity.classList.remove("guessing");

			// @ts-expect-error 类型就是这么写的
			if (_status.clickingidentity && _status.clickingidentity[0] == this) {
				// @ts-expect-error 类型就是这么写的
				for (var i = 0; i < _status.clickingidentity[1].length; i++) {
					// @ts-expect-error 类型就是这么写的
					_status.clickingidentity[1][i].delete();
					// @ts-expect-error 类型就是这么写的
					_status.clickingidentity[1][i].style.transform = "";
				}
				// @ts-expect-error 类型就是这么写的
				delete _status.clickingidentity;
			}
			// @ts-expect-error 类型就是这么写的
			game.addVideo("setIdentity", this, this.identity);
		}
		var skills;
		switch (num) {
			case 0:
				if (log !== false) {
					game.log(this, "展示了主将", "#b" + this.name1);
				}
				this.name = this.name1;
				skills = lib.character[this.name][3];
				this.sex = lib.character[this.name][0];
				this.classList.remove("unseen");
				break;
			case 1:
				if (log !== false) {
					game.log(this, "展示了副将", "#b" + this.name2);
				}
				skills = lib.character[this.name2][3];
				if (this.sex == "unknown") {
					this.sex = lib.character[this.name2][0];
				}
				if (this.name.indexOf("unknown") == 0) {
					this.name = this.name2;
				}
				this.classList.remove("unseen2");
				break;
			case 2:
				if (log !== false) {
					game.log(this, "展示了主将", "#b" + this.name1, "、副将", "#b" + this.name2);
				}
				this.name = this.name1;
				skills = lib.character[this.name][3].concat(lib.character[this.name2][3]);
				this.sex = lib.character[this.name][0];
				this.classList.remove("unseen");
				this.classList.remove("unseen2");
				break;
		}
		game.broadcast(
			// @ts-expect-error 类型就是这么写的
			function (player, name, sex, num, identity, group) {
				player.identityShown = true;
				player.group = group;
				player.name = name;
				player.sex = sex;
				player.node.identity.classList.remove("guessing");
				switch (num) {
					case 0:
						player.classList.remove("unseen");
						break;
					case 1:
						player.classList.remove("unseen2");
						break;
					case 2:
						player.classList.remove("unseen");
						player.classList.remove("unseen2");
						break;
				}
				player.ai.shown = 1;
				player.identity = identity;
				player.setIdentity(identity);
				// @ts-expect-error 类型就是这么写的
				if (_status.clickingidentity && _status.clickingidentity[0] == player) {
					// @ts-expect-error 类型就是这么写的
					for (var i = 0; i < _status.clickingidentity[1].length; i++) {
						// @ts-expect-error 类型就是这么写的
						_status.clickingidentity[1][i].delete();
						// @ts-expect-error 类型就是这么写的
						_status.clickingidentity[1][i].style.transform = "";
					}
					// @ts-expect-error 类型就是这么写的
					delete _status.clickingidentity;
				}
			},
			this,
			this.name,
			this.sex,
			num,
			this.identity,
			this.group
		);
		this.identityShown = true;
		// @ts-expect-error 类型就是这么写的
		for (var i = 0; i < skills.length; i++) {
			// @ts-expect-error 类型就是这么写的
			if (!this.hiddenSkills.includes(skills[i])) {
				continue;
			}
			// @ts-expect-error 类型就是这么写的
			this.hiddenSkills.remove(skills[i]);
			// @ts-expect-error 类型就是这么写的
			this.addSkill(skills[i]);
		}
		this.checkConflict();
		// @ts-expect-error 类型就是这么写的
		if (!this.viceChanged) {
			var initdraw = get.config("initshow_draw");
			if (_status.connectMode) {
				initdraw = lib.configOL.initshow_draw;
			}
			// @ts-expect-error 类型就是这么写的
			if (!_status.initshown && !_status.overing && initdraw != "off" && this.isAlive() && _status.mode != "mingjiang") {
				this.popup("首亮");
				if (initdraw == "draw") {
					game.log(this, "首先明置武将，得到奖励");
					game.log(this, "摸了两张牌");
					// @ts-expect-error 类型就是这么写的
					this.draw(2).log = false;
				} else {
					this.addMark("xianqu_mark", 1);
				}
				// @ts-expect-error 类型就是这么写的
				_status.initshown = true;
			}
			if (!this.isUnseen(2) && !this._mingzhied) {
				this._mingzhied = true;
				if (this.singleHp) {
					this.doubleDraw();
				}
				if (this.perfectPair()) {
					var next = game.createEvent("guozhanDraw");
					// @ts-expect-error 类型就是这么写的
					next.player = this;
					// @ts-expect-error 类型就是这么写的
					next.setContent("zhulian");
				}
			}
			if (showYe) {
				this.addMark("yexinjia_mark", 1);
			}
		}
		// @ts-expect-error 类型就是这么写的
		game.tryResult();
	}

	/**
	 * 玩家是否“不会”变成野心家
	 *
	 * @param { string } [group] 判断所处的势力
	 * @param { number } [numOfReadyToShow] 预亮角色数，默认为1（自己）
	 * @returns { boolean }
	 */
	wontYe(group, numOfReadyToShow) {
		if (!group) {
			if (this.trueIdentity) {
				group = this.trueIdentity;
			} else {
				group = lib.character[this.name1][1];
			}
		}
		// @ts-expect-error 类型就是这么写的
		if (_status.yeidentity && _status.yeidentity.includes(group)) {
			return false;
		}
		if (get.zhu(this, null, group)) {
			return true;
		}
		if (!numOfReadyToShow) {
			numOfReadyToShow = 1;
		}
		// @ts-expect-error 类型就是这么写的
		return get.totalPopulation(group) + numOfReadyToShow <= (_status.separatism ? Math.max(get.population() / 2 - 1, 1) : get.population() / 2);
	}

	/**
	 * 判断主副将是否“珠联璧合”
	 *
	 * @param { object } [choosing] 传入已选主副将（目前无实际用处）
	 * @returns { boolean }
	 */
	perfectPair(choosing) {
		if (_status.connectMode) {
			if (!lib.configOL.zhulian) {
				return false;
			}
		} else {
			if (!get.config("zhulian")) {
				return false;
			}
		}
		var name1 = this.name1;
		var name2 = this.name2;
		const junFilter = (name1, name2, reverse) => {
			if (reverse !== true && junFilter(name2, name1, true)) {
				return true;
			}
			if (!get.is.jun(name1)) {
				return false;
			}
			const group = get.character(name1).group,
				info = get.character(name2);
			return info.group == group || (info.doubleGroup && info.doubleGroup.includes(group));
		};
		if (junFilter(name1, name2)) {
			return true;
		}
		if (name1.indexOf("gz_shibing") == 0) {
			return false;
		}
		if (name2.indexOf("gz_shibing") == 0) {
			return false;
		}
		if (choosing && lib.character[name1][1] != "ye" && lib.character[name2][1] != "ye" && lib.character[name1][1] != lib.character[name2][1]) {
			return false;
		}
		if (name1.indexOf("gz_") == 0) {
			name1 = name1.slice(name1.indexOf("_") + 1);
		} else {
			while (name1.indexOf("_") != -1 && !lib.perfectPair[name1]) {
				name1 = name1.slice(name1.indexOf("_") + 1);
			}
		}
		if (name2.indexOf("gz_") == 0) {
			name2 = name2.slice(name2.indexOf("_") + 1);
		} else {
			while (name2.indexOf("_") != -1 && !lib.perfectPair[name2]) {
				name2 = name2.slice(name2.indexOf("_") + 1);
			}
		}
		var list = Object.keys(lib.perfectPair).concat(Object.values(lib.perfectPair)).flat();
		if (!list.includes(name1) || !list.includes(name2)) {
			return false;
		}
		return (lib.perfectPair[name1] && lib.perfectPair[name1].flat(Infinity).includes(name2)) || (lib.perfectPair[name2] && lib.perfectPair[name2].flat(Infinity).includes(name1));
	}

	/**
	 * 判断玩家是否处于“围攻”状态
	 *
	 * @param { Player } [player] 参照对象，是否“围攻”该角色，不填则判断自身上下家
	 * @returns { boolean }
	 */
	siege(player) {
		if (this.identity == "unknown" || this.hasSkill("undist")) {
			return false;
		}
		if (!player) {
			var next = this.getNext();
			if (next && next.sieged()) {
				return true;
			}
			var previous = this.getPrevious();
			if (previous && previous.sieged()) {
				return true;
			}
			return false;
		} else {
			// @ts-expect-error 类型就是这么写的
			return player.sieged() && (player.getNext() == this || player.getPrevious() == this);
		}
	}

	/**
	 * 判断玩家是否处于“被围攻”状态
	 *
	 * @param { Player } [player] 参照对象，是否被该角色“围攻”，不填则判断自身上下家
	 * @returns { boolean }
	 */
	sieged(player) {
		if (this.identity == "unknown") {
			return false;
		}
		if (player) {
			return player.siege(this);
		} else {
			var next = this.getNext();
			var previous = this.getPrevious();
			if (next && previous && next != previous) {
				if (next.identity == "unknown" || next.isFriendOf(this)) {
					return false;
				}
				return next.isFriendOf(previous);
			}
			return false;
		}
	}

	/**
	 * 判断玩家是否处于“队列”
	 *
	 * @returns { boolean }
	 */
	inline() {
		if (this.identity == "unknown" || this.identity == "ye" || this.hasSkill("undist")) {
			return false;
		}
		var next = this,
			previous = this;
		var list = [];
		for (var i = 0; next || previous; i++) {
			if (next) {
				// @ts-expect-error 类型就是这么写的
				next = next.getNext();
				if (!next.isFriendOf(this) || next == this) {
					// @ts-expect-error 类型就是这么写的
					next = null;
				} else {
					list.add(next);
				}
			}
			if (previous) {
				// @ts-expect-error 类型就是这么写的
				previous = previous.getPrevious();
				if (!previous.isFriendOf(this) || previous == this) {
					// @ts-expect-error 类型就是这么写的
					previous = null;
				} else {
					list.add(previous);
				}
			}
		}
		if (!list.length) {
			return false;
		}
		for (var i = 0; i < arguments.length; i++) {
			if (!list.includes(arguments[i]) && arguments[i] != this) {
				return false;
			}
		}
		return true;
	}
	logAi(targets, card) {
		if (this.ai.shown == 1 || this.isMad()) {
			return;
		}
		if (typeof targets == "number") {
			// @ts-expect-error 类型就是这么写的
			this.ai.shown += targets;
		} else {
			var effect = 0,
				c,
				shown;
			var info = get.info(card);
			if (info.ai && info.ai.expose) {
				if (_status.event.name == "_wuxie") {
					if (_status.event.source && _status.event.source.ai.shown) {
						// @ts-expect-error 类型就是这么写的
						this.ai.shown += 0.2;
					}
				} else {
					// @ts-expect-error 类型就是这么写的
					this.ai.shown += info.ai.expose;
				}
			}
			if (targets.length > 0) {
				for (var i = 0; i < targets.length; i++) {
					shown = Math.abs(targets[i].ai.shown);
					if (shown < 0.2 || targets[i].identity == "nei") {
						c = 0;
					} else if (shown < 0.4) {
						c = 0.5;
					} else if (shown < 0.6) {
						c = 0.8;
					} else {
						c = 1;
					}
					effect += get.effect(targets[i], card, this) * c;
				}
			}
			if (effect > 0) {
				if (effect < 1) {
					c = 0.5;
				} else {
					c = 1;
				}
				if (targets.length != 1 || targets[0] != this) {
					if (targets.length == 1) {
						// @ts-expect-error 类型就是这么写的
						this.ai.shown += 0.2 * c;
					} else {
						// @ts-expect-error 类型就是这么写的
						this.ai.shown += 0.1 * c;
					}
				}
			}
		}
		// @ts-expect-error 类型就是这么写的
		if (this.ai.shown > 0.95) {
			this.ai.shown = 0.95;
		}
		// @ts-expect-error 类型就是这么写的
		if (this.ai.shown < -0.5) {
			this.ai.shown = -0.5;
		}
	}
}
