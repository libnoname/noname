import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { lib } from "../index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

export class Card extends HTMLDivElement {
	/**
	 * @param {HTMLDivElement|DocumentFragment} [position]
	 */
	// @ts-expect-error ignore
	constructor(position) {
		if (position instanceof Card) {
			const other = position;
			// @ts-expect-error ignore
			[position] = other._args;
		}
		/**
		 * @type {this}
		 */
		// @ts-expect-error ignore
		const card = ui.create.div(".card", position);
		Object.setPrototypeOf(card, (lib.element.Card || Card).prototype);
		// @ts-expect-error ignore
		card._args = [position];
		return card;
	}
	/**
	 * @param {'noclick'} [info]
	 * @param {true} [noclick]
	 */
	build(info, noclick) {
		let card = this;
		card.buildNode();
		card.buildIntro(noclick);
		card.buildProperty();
		card.buildEventListener(info);
		return this;
	}
	buildEventListener(info) {
		let card = this;
		if (info != "noclick") {
			card.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.card);
			if (lib.config.touchscreen) {
				card.addEventListener("touchstart", ui.click.cardtouchstart);
				card.addEventListener("touchmove", ui.click.cardtouchmove);
			}
			if (lib.cardSelectObserver) {
				lib.cardSelectObserver.observe(card, {
					attributes: true,
				});
			}
		}
	}
	buildProperty() {
		let card = this;
		card.storage = {};
		card.vanishtag = [];
		card.gaintag = [];
		card._uncheck = [];
	}
	buildNode() {
		this.node = {
			image: ui.create.div(".image", this),
			info: ui.create.div(".info", this),
			name: ui.create.div(".name", this),
			name2: ui.create.div(".name2", this),
			background: ui.create.div(".background", this),
			intro: ui.create.div(".intro", this),
			range: ui.create.div(".range", this),
			gaintag: ui.create.div(".gaintag", this),
		};
		this.node.intro.innerHTML = lib.config.intro;
	}
	buildIntro(noclick) {
		if (!noclick) {
			lib.setIntro(this);
		}
	}
	/** @type { SMap<HTMLDivElement> } */
	// eslint-disable-next-line no-unreachable
	node;
	/**
	 * @type { string }
	 */
	name;
	/**
	 * @type { SMap<any> }
	 */
	storage;
	/**
	 * @type { any[] }
	 */
	vanishtag;
	/**
	 * @type { any[] }
	 */
	gaintag;
	/**
	 * @type { any[] }
	 */
	_uncheck;
	/**
	 * @type { boolean }
	 */
	isCard;
	/**
	 * @type { string[] }
	 * 卡牌“占用的装备栏”
	 * TODO: 补充对应的typings
	 */
	subtypes;
	//执行销毁一张牌的钩子函数
	selfDestroy(event) {
		if (this._selfDestroyed) {
			return;
		}
		this._selfDestroyed = true;
		this.fix();
		this.delete();
		const info = get.info(this, false);
		if (!info) {
			return;
		}
		if (info.destroyLog !== false) {
			game.log(this, "被销毁了");
		}
		if (info.onDestroy) {
			info.onDestroy(this, event);
		}
	}
	//判断一张牌进入某个区域后是否会被销毁
	willBeDestroyed(targetPosition, player, event) {
		const destroyed = this.destroyed;
		if (typeof destroyed == "function") {
			return destroyed(this, targetPosition, player, event);
		} else if (lib.skill[destroyed]) {
			if (player) {
				if (player.hasSkill(destroyed)) {
					delete this.destroyed;
					return false;
				}
			}
			return true;
		} else if (typeof destroyed == "string") {
			return destroyed == targetPosition;
		}
		return destroyed;
	}
	hasNature(nature, player) {
		return game.hasNature(this, nature, player);
	}
	//只针对【杀】起效果
	addNature(nature) {
		let natures = [];
		if (!this.nature) {
			this.nature = "";
		} else {
			natures.addArray(get.natureList(this.nature));
		}
		natures.addArray(get.natureList(nature));
		this.nature = get.nature(natures);
		this.classList.add(nature);
		let str = get.translation(this.nature) + "杀";
		this.node.name.innerText = str;
		let name = get.name(this, false);
		do {
			if (name == "sha") {
				let _bg;
				for (const n of natures) {
					if (lib.natureBg.has(n)) {
						_bg = n;
					}
				}
				if (_bg) {
					this.node.image.setBackgroundImage(lib.natureBg.get(_bg));
					break;
				}
			}
			this.node.image.setBackgroundImage("image/card/" + name + ".png");
		} while (0);
		return this.nature;
	}
	removeNature(nature) {
		if (!this.nature) {
			return;
		}
		let natures = get.natureList(this.nature);
		natures.remove(nature);
		if (!natures.length) {
			delete this.nature;
		} else {
			this.nature = get.nature(natures);
		}
		this.classList.remove(nature);
		let str = get.translation(this.nature) + "杀";
		this.node.name.innerText = str;
		let name = get.name(this, false);
		do {
			if (name == "sha") {
				let _bg;
				for (const n of natures) {
					if (lib.natureBg.has(n)) {
						_bg = n;
					}
				}
				if (_bg) {
					this.node.image.setBackgroundImage(lib.natureBg.get(_bg));
					break;
				}
			}
			this.node.image.setBackgroundImage("image/card/" + name + ".png");
		} while (0);
		return this.nature;
	}
	addGaintag(gaintag) {
		//目前无名杀支持永久标记，只要加上前缀“eternal_”（即eternal，永恒的）均视为永久标记
		//然后就是永久标记的翻译问题，前缀是eternal_可以选择只看后面的子字符串的对应翻译
		if (Array.isArray(gaintag)) {
			this.gaintag = gaintag.slice(0);
		} else {
			this.gaintag.add(gaintag);
		}
		var str = "";
		for (var gi = 0; gi < this.gaintag.length; gi++) {
			const tag = this.gaintag[gi];
			var translate = get.translation(tag);
			if (translate == tag && tag.startsWith("eternal_")) {
				translate = get.translation(tag.slice(8));
			}
			if (translate != "invisible") {
				str += translate;
				if (gi < this.gaintag.length - 1) {
					str += " ";
				}
			}
		}
		this.node.gaintag.innerHTML = str;
	}
	removeGaintag(tag) {
		if (tag === true) {
			if ((this.gaintag && this.gaintag.length) || this.node.gaintag.innerHTML.length) {
				this.addGaintag([]);
			}
		} else if (this.hasGaintag(tag)) {
			this.gaintag.remove(tag);
			this.addGaintag(this.gaintag);
		}
	}
	hasGaintag(tag) {
		return this.gaintag && this.gaintag.includes(tag);
	}
	/**
	 * @param {[string, number, string, string] | {
	 * suit: string;
	 * number: number;
	 * name: string;
	 * nature: string;
	 * }} card
	 */
	init(card) {
		if (Array.isArray(card)) {
			if (card[2] == "huosha") {
				card[2] = "sha";
				card[3] = "fire";
			} else if (card[2] == "leisha") {
				card[2] = "sha";
				card[3] = "thunder";
			} else if (card[2] == "cisha") {
				card[2] = "sha";
				card[3] = "stab";
			} else if (card[2].length > 3) {
				let prefix = card[2].slice(0, card[2].lastIndexOf("sha"));
				if (lib.nature.has(prefix)) {
					if (prefix.length + 3 == card[2].length) {
						card[2] = "sha";
						card[3] = prefix;
					}
				}
				if (card[2].startsWith("sha_")) {
					let suffix = card[2].slice(4);
					let natureList = suffix.split("_");
					card[2] = "sha";
					card[3] = get.nature(natureList);
				}
			}
		} else if (typeof card == "object") {
			card = [card.suit, card.number, card.name, card.nature];
		}
		var cardnum = card[1] || "";
		if (parseInt(cardnum) == cardnum) {
			cardnum = parseInt(cardnum);
		}

		if (!lib.card[card[2]]) {
			lib.card[card[2]] = {};
		}
		var info = lib.card[card[2]];
		if (info.global && !this.classList.contains("button")) {
			if (Array.isArray(info.global)) {
				while (info.global.length) {
					game.addGlobalSkill(info.global.shift());
				}
			} else if (typeof info.global == "string") {
				game.addGlobalSkill(info.global);
			}
			delete info.global;
		}
		this.suit = card[0];
		this.number = parseInt(card[1]) || 0;
		this.name = card[2];

		if (info.destroy && typeof info.destroy != "boolean" && !lib.skill[info.destroy]) {
			this.destroyed = info.destroy;
		}

		if (_status.connectMode && !game.online && lib.cardOL && !this.cardid) {
			this.cardid = get.id();
			lib.cardOL[this.cardid] = this;
		}
		if (!_status.connectMode && !_status.video) {
			this.cardid = get.id();
		}

		this.$init(card);

		if (this.inits) {
			for (var i = 0; i < this.inits.length; i++) {
				this.inits[i](this);
			}
		}
		if (typeof info.init == "function") {
			info.init();
		}

		return this;
	}
	/**
	 * @param {[string, number, string, string]} card
	 */
	$init(card) {
		var info = lib.card[card[2]];
		var cardnum = card[1] || "";
		if (parseInt(cardnum) == cardnum) {
			cardnum = parseInt(cardnum);
		}
		cardnum = get.strNumber(cardnum, true) || cardnum;
		if (typeof cardnum != "string") {
			cardnum = "";
		}
		if (this.name) {
			this.classList.remove("epic");
			this.classList.remove("legend");
			this.classList.remove("gold");
			this.classList.remove("unique");
			this.style.background = "";
			var subtype = get.subtype(this, false);
			if (subtype) {
				this.classList.remove(subtype);
			}
		}
		if (info.epic) {
			this.classList.add("epic");
		} else if (info.legend) {
			this.classList.add("legend");
		} else if (info.gold) {
			this.classList.add("gold");
		} else if (info.unique) {
			this.classList.add("unique");
		}
		var bg = card[2];
		if (info.cardimage) {
			bg = info.cardimage;
		}
		var img = get.dynamicVariable(lib.card[bg].image, this);
		if (img) {
			if (img.startsWith("db:")) {
				img = img.slice(3);
			} else if (!img.startsWith("ext:")) {
				img = null;
			}
		}
		this.classList.remove("fullskin");
		this.classList.remove("fullimage");
		this.classList.remove("fullborder");
		this.dataset.cardName = card[2];
		this.dataset.cardType = info.type || "";
		this.dataset.cardSubtype = info.subtype || "";
		this.dataset.cardMultitarget = info.multitarget ? "1" : "0";
		this.node.name.dataset.nature = "";
		this.node.info.classList.remove("red");
		if (!lib.config.hide_card_image && lib.card[bg].fullskin) {
			this.classList.add("fullskin");
			if (img) {
				if (img.startsWith("ext:")) {
					this.node.image.setBackgroundImage(img.replace(/^ext:/, "extension/"));
				} else {
					this.node.image.setBackgroundDB(img);
				}
			} else {
				if (lib.card[bg].modeimage) {
					this.node.image.setBackgroundImage("image/mode/" + lib.card[bg].modeimage + "/card/" + bg + ".png");
				} else {
					do {
						let nature = card[3];
						if (bg == "sha" && typeof nature == "string") {
							let natures = get.natureList(nature),
								_bg;
							for (const n of natures) {
								if (lib.natureBg.has(n)) {
									_bg = n;
								}
							}
							if (_bg) {
								this.node.image.setBackgroundImage(lib.natureBg.get(_bg));
								break;
							}
						}
						this.node.image.setBackgroundImage("image/card/" + bg + ".png");
					} while (0);
				}
			}
		} else if (get.dynamicVariable(lib.card[bg].image, this) == "background") {
			if (card[3]) {
				this.node.background.setBackground(bg + "_" + get.natureList(card[3])[0], "card");
			} else {
				this.node.background.setBackground(bg, "card");
			}
		} else if (lib.card[bg].fullimage) {
			this.classList.add("fullimage");
			if (img) {
				if (img.startsWith("ext:")) {
					this.setBackgroundImage(img.replace(/^ext:/, "extension/"));
					this.style.backgroundSize = "cover";
				} else {
					this.setBackgroundDB(img);
				}
			} else if (get.dynamicVariable(lib.card[bg].image, this)) {
				if (get.dynamicVariable(lib.card[bg].image, this).startsWith("character:")) {
					this.setBackground(get.dynamicVariable(lib.card[bg].image, this).slice(10), "character");
				} else {
					this.setBackground(get.dynamicVariable(lib.card[bg].image, this));
				}
			} else {
				var cardPack = lib.cardPack["mode_" + get.mode()];
				if (Array.isArray(cardPack) && cardPack.includes(bg)) {
					this.setBackground("mode/" + get.mode() + "/card/" + bg);
				} else {
					this.setBackground("card/" + bg);
				}
			}
		} else if (lib.card[bg].fullborder) {
			this.classList.add("fullborder");
			if (lib.card[bg].fullborder == "gold") {
				this.node.name.dataset.nature = "metalmm";
			} else if (lib.card[bg].fullborder == "silver") {
				this.node.name.dataset.nature = "watermm";
			}
			if (!this.node.avatar) {
				this.node.avatar = ui.create.div(".cardavatar");
				this.insertBefore(this.node.avatar, this.firstChild);
			}
			if (!this.node.framebg) {
				this.node.framebg = ui.create.div(".cardframebg");
				this.node.framebg.dataset.auto = lib.card[bg].fullborder;
				this.insertBefore(this.node.framebg, this.firstChild);
			}
			if (img) {
				if (img.startsWith("ext:")) {
					this.node.avatar.setBackgroundImage(img.replace(/^ext:/, "extension/"));
					this.node.avatar.style.backgroundSize = "cover";
				} else {
					this.node.avatar.setBackgroundDB(img);
				}
			} else if (get.dynamicVariable(lib.card[bg].image, this)) {
				if (get.dynamicVariable(lib.card[bg].image, this).startsWith("character:")) {
					this.node.avatar.setBackground(get.dynamicVariable(lib.card[bg].image, this).slice(10), "character");
				} else {
					this.node.avatar.setBackground(get.dynamicVariable(lib.card[bg].image, this));
				}
			} else {
				var cardPack = lib.cardPack["mode_" + get.mode()];
				if (Array.isArray(cardPack) && cardPack.includes(bg)) {
					this.node.avatar.setBackground("mode/" + get.mode() + "/card/" + bg);
				} else {
					this.node.avatar.setBackground("card/" + bg);
				}
			}
		} else if (get.dynamicVariable(lib.card[bg].image, this) == "card") {
			if (card[3]) {
				this.setBackground(bg + "_" + get.natureList(card[3])[0], "card");
			} else {
				this.setBackground(bg, "card");
			}
		} else if (typeof get.dynamicVariable(lib.card[bg].image, this) == "string" && !lib.card[bg].fullskin) {
			if (img) {
				if (img.startsWith("ext:")) {
					this.setBackgroundImage(img.replace(/^ext:/, "extension/"));
					this.style.backgroundSize = "cover";
				} else {
					this.setBackgroundDB(img);
				}
			} else {
				this.setBackground(get.dynamicVariable(lib.card[bg].image, this));
			}
		} else {
			this.node.background.innerHTML = lib.translate[bg + "_cbg"] || lib.translate[bg + "_bg"] || get.translation(bg)[0];
			// this.node.background.style.fontFamily=lib.config.card_font;
			if (this.node.background.innerHTML.length > 1) {
				this.node.background.classList.add("tight");
			} else {
				this.node.background.classList.remove("tight");
			}
		}
		if (!lib.card[bg].fullborder && this.node.avatar && this.node.framebg) {
			this.node.avatar.remove();
			this.node.framebg.remove();
			delete this.node.avatar;
			delete this.node.framebg;
		}
		if (info.noname) {
			this.node.name.style.display = "none";
		}
		if (info.color) {
			this.style.color = info.color;
		}
		if (info.textShadow) {
			this.style.textShadow = info.textShadow;
		}
		if (info.opacity) {
			this.node.info.style.opacity = info.opacity;
			this.node.name.style.opacity = info.opacity;
		}
		if (info.modinfo) {
			this.node.info.innerHTML = info.modinfo;
		} else {
			this.node.info.innerHTML = get.translation(card[0]) + '<span style="font-family:xinwei"> </span><span style="font-family:xinwei">' + cardnum + "</span>";
		}
		if (info.addinfo) {
			if (!this.node.addinfo) {
				this.node.addinfo = ui.create.div(".range", this);
			}
			this.node.addinfo.innerHTML = info.addinfo;
		} else if (this.node.addinfo) {
			this.node.addinfo.remove();
			delete this.node.addinfo;
		}
		if (lib.color.red.includes(card[0])) {
			this.node.info.classList.add("red");
		}
		this.node.image.className = "image";
		var name = get.translation(card[2]);
		if (card[2] == "sha") {
			name = "";
			let nature = card[3];
			if (nature) {
				let natures = get.natureList(nature);
				natures.sort(lib.sort.nature);
				for (let nature of natures) {
					name += lib.translate["nature_" + nature] || lib.translate[nature] || "";
					if (nature != "stab") {
						this.node.image.classList.add(nature);
					}
				}
			}
			name += "杀";
		}
		this.node.name.innerHTML = name;
		if (name.length >= 5) {
			this.node.name.classList.add("long");
			if (name.length >= 7) {
				this.node.name.classList.add("longlong");
			}
		}
		this.node.name2.innerHTML = get.translation(card[0]) + cardnum + " " + name;
		this.classList.add("card");
		if (card[3]) {
			let natures = get.natureList(card[3]);
			natures.forEach(n => {
				if (n) {
					this.classList.add(n);
				}
			});
			this.nature = natures
				.filter(n => lib.nature.has(n))
				.sort(lib.sort.nature)
				.join(lib.natureSeparator);
		} else if (this.nature) {
			this.classList.remove(this.nature);
			delete this.nature;
		}
		if (info.subtype) {
			this.classList.add(info.subtype);
		}
		this.node.range.innerHTML = "";
		switch (get.subtype(this, false)) {
			case "equip1":
				var added = false;
				if (lib.card[this.name] && lib.card[this.name].distance) {
					var dist = lib.card[this.name].distance;
					if (dist.attackFrom) {
						added = true;
						this.node.range.innerHTML = "范围: " + (-dist.attackFrom + 1);
					}
				}
				if (!added) {
					this.node.range.innerHTML = "范围: 1";
				}
				break;
			case "equip3":
				if (info.distance && info.distance.globalTo) {
					this.node.range.innerHTML = "防御: " + info.distance.globalTo;
					this.node.name2.innerHTML += "+";
				}
				break;
			case "equip4":
				if (info.distance && info.distance.globalFrom) {
					this.node.range.innerHTML = "进攻: " + -info.distance.globalFrom;
					this.node.name2.innerHTML += "-";
				}
				break;
		}
		var tags = [];
		if (Array.isArray(card[4])) {
			tags.addArray(card[4]);
		}
		if (this.cardid) {
			if (!_status.cardtag) {
				_status.cardtag = {};
			}
			for (var i in _status.cardtag) {
				if (_status.cardtag[i].includes(this.cardid)) {
					tags.add(i);
				}
			}
			if (tags.length) {
				var tagstr = ' <span class="cardtag">';
				for (var i = 0; i < tags.length; i++) {
					var tag = tags[i];
					if (!_status.cardtag[tag]) {
						_status.cardtag[tag] = [];
					}
					_status.cardtag[tag].add(this.cardid);
					tagstr += lib.translate[tag + "_tag"];
					//if(i<tags.length-1) tagstr+=' ';
				}
				tagstr += "</span>";
				this.node.range.innerHTML += tagstr;
			}
		}
		return this;
	}
	/**
	 * 给此牌添加特定的cardtag（如添加应变条件）
	 * @param { string } tag
	 */
	addCardtag(tag) {
		let card = this;
		game.broadcastAll(
			function (card, tag) {
				if (!_status.cardtag) {
					_status.cardtag = {};
				}
				if (!_status.cardtag[tag]) {
					_status.cardtag[tag] = [];
				}
				_status.cardtag[tag].add(card.cardid);
				card.$init([card.suit, card.number, card.name, card.nature]);
			},
			card,
			tag
		);
	}
	/**
	 * 给此牌移除特定的cardtag（如移除应变条件）
	 * @param { string } tag
	 */
	removeCardtag(tag) {
		let card = this;
		game.broadcastAll(
			function (card, tag) {
				if (!_status.cardtag) {
					_status.cardtag = {};
				}
				if (!_status.cardtag[tag]) {
					_status.cardtag[tag] = [];
				}
				_status.cardtag[tag].remove(card.cardid);
				card.$init([card.suit, card.number, card.name, card.nature]);
			},
			card,
			tag
		);
	}
	updateTransform(bool, delay) {
		if (delay) {
			var that = this;
			setTimeout(function () {
				that.updateTransform(that.classList.contains("selected"));
			}, delay);
		} else {
			if (_status.event.player != game.me) {
				return;
			}
			if (this._transform && this.parentNode && this.parentNode.parentNode && this.parentNode.parentNode.parentNode == ui.me && (!_status.mousedown || _status.mouseleft) && (!this.parentNode.parentNode.classList.contains("scrollh") || game.layout == "long2" || game.layout == "nova")) {
				if (bool) {
					this.style.transform = this._transform + " translateY(-20px)";
				} else {
					this.style.transform = this._transform || "";
				}
			}
		}
	}
	aiexclude() {
		_status.event._aiexclude.add(this);
	}
	//为此牌添加知情者。参数可为数组，若参数为字符串'everyone'，则所有玩家均为知情者。
	addKnower(player) {
		if (!this._knowers) {
			this._knowers = [];
		}
		if (typeof player == "string") {
			this._knowers.add(player);
		} else {
			let type = get.itemtype(player);
			if (type == "player") {
				this._knowers.add(player.playerid);
			} else if (type == "players") {
				player.forEach(p => this._knowers.add(p.playerid));
			}
		}
	}
	removeKnower(player) {
		if (!this._knowers) {
			return;
		}
		if (typeof player == "string") {
			this._knowers.remove(player);
		} else {
			let type = get.itemtype(player);
			if (type == "player") {
				this._knowers.remove(player.playerid);
			} else if (type == "players") {
				player.forEach(p => this._knowers.remove(p.playerid));
			}
		}
	}
	//清除此牌的知情者。
	clearKnowers() {
		if (this._knowers) {
			delete this._knowers;
		}
	}
	//判断玩家对此牌是否知情。
	isKnownBy(player) {
		if (["e", "j"].includes(get.position(this))) {
			return true;
		} //装备区或者判定区的牌，必知情。
		let owner = get.owner(this);
		if (owner) {
			if (owner == player) {
				return true;
			} //是牌主，必知情。
			if (player.hasSkillTag("viewHandcard", null, owner, true)) {
				return true;
			} //有viewHandcard标签，必知情。
			if (owner.isUnderControl(true, player)) {
				return true;
			} //被操控，必知情。
		}
		if (get.is.shownCard(this)) {
			return true;
		} //此牌是明置牌，必知情。
		if (this._knowers) {
			return this._knowers.includes("everyone") || this._knowers.includes(player.playerid);
		}
		return false;
	}
	getSource(name) {
		if (this.name == name) {
			return true;
		}
		var info = lib.card[this.name];
		if (info && Array.isArray(info.source)) {
			return info.source.includes(name);
		}
		return false;
	}
	moveDelete(player) {
		this.fixed = true;
		if (!this._listeningEnd || this._transitionEnded) {
			this.moveTo(player);
			var that = this;
			setTimeout(function () {
				that.delete();
			}, 200);
		} else {
			this._onEndMoveDelete = player;
		}
	}
	moveTo(player) {
		this.fixed = true;
		var dx, dy;
		if (this.classList.contains("center")) {
			var nx = [50, -52];
			var ny = [50, -52];
			nx = (nx[0] * ui.arena.offsetWidth) / 100 + nx[1];
			ny = (ny[0] * ui.arena.offsetHeight) / 100 + ny[1];
			dx = player.getLeft() + player.offsetWidth / 2 - 52 - nx;
			dy = player.getTop() + player.offsetHeight / 2 - 52 - ny;
		} else {
			this.style.left = this.offsetLeft + "px";
			this.style.top = this.offsetTop + "px";

			dx = player.getLeft() + player.offsetWidth / 2 - 52 - this.offsetLeft;
			dy = player.getTop() + player.offsetHeight / 2 - 52 - this.offsetTop;
		}
		if (get.is.mobileMe(player)) {
			dx += get.cardOffset();
			if (ui.arena.classList.contains("oblongcard")) {
				dy -= 16;
			}
		}

		if (this.style.transform && this.style.transform != "none" && this.style.transform.indexOf("translate") == -1) {
			this.style.transform += " translate(" + dx + "px," + dy + "px)";
		} else {
			this.style.transform = "translate(" + dx + "px," + dy + "px)";
		}
		return this;
	}
	copy() {
		/**
		 * @type {Card}
		 */
		var node = this.cloneNode(true);
		node.style.transform = "";
		node.name = this.name;
		node.suit = this.suit;
		node.number = this.number;
		node.nature = this.nature;
		node._cardid = this.cardid;
		node.classList.remove("hidden");
		node.classList.remove("start");
		node.classList.remove("thrown");
		node.classList.remove("selectable");
		node.classList.remove("selected");
		node.classList.remove("removing");
		node.classList.remove("drawinghidden");
		node.classList.remove("glows");
		node.node = {
			name: node.querySelector(".name"),
			info: node.querySelector(".info"),
			intro: node.querySelector(".intro"),
			background: node.querySelector(".background"),
			image: node.querySelector(".image"),
			gaintag: node.querySelector(".gaintag"),
		};
		node.node.gaintag.innerHTML = "";
		var clone = true;
		var position;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				node.classList.add(arguments[i]);
			} else if (["div", "fragment"].includes(get.objtype(arguments[i]))) {
				position = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				clone = arguments[i];
			}
		}
		node.moveTo = lib.element.Card.prototype.moveTo;
		node.moveDelete = lib.element.Card.prototype.moveDelete;
		if (clone) {
			this.clone = node;
		}
		if (position) {
			position.appendChild(node);
		}
		return node;
	}
	uncheck(skill) {
		if (skill) {
			this._uncheck.add(skill);
		}
		this.classList.add("uncheck");
	}
	recheck(skill) {
		if (skill) {
			this._uncheck.remove(skill);
		} else {
			this._uncheck.length = 0;
		}
		if (this._uncheck.length == 0) {
			this.classList.remove("uncheck");
		}
	}
	/**
	 * 判断此牌是否包含class样式，参数有多个时，只需一个满足。
	 *
	 * @param {string} className
	 *
	 * @returns {boolean} 是否包含class
	 */
	classListContains(className) {
		return Array.from(arguments).some(name => this.classList.contains(className));
	}
	/**
	 * 判断此牌是否包含class样式，参数有多个时，需全部满足。
	 *
	 * @param {string} className
	 *
	 * @returns {boolean} 是否包含class
	 */
	classListContainsAll() {
		return Array.from(arguments).every(name => this.classList.contains(this.className));
	}
	/**
	 * 返回一个键值，用于在缓存中作为键名。
	 * @param { boolean } [similar] false统一前缀
	 * @returns {string} cacheKey
	 */
	getCacheKey(similar) {
		let prefix = "[object:";
		if (similar !== false) {
			prefix = "[card:";
		}
		if (this.cardid) {
			return prefix + this.cardid + "]";
		}
		return prefix + `${this.name}+${this.suit ? this.suit : "none"}+${this.number === undefined ? "none" : this.number}${this.nature ? "+" + this.nature : ""}]`;
	}
	discard(bool) {
		if (!this._selfDestroyed) {
			this.fix();
			ui.discardPile.appendChild(this);
		}
		this.classList.remove("glow");
		if (bool === false) {
			ui.cardPile.insertBefore(this, ui.cardPile.childNodes[Math.floor(Math.random() * ui.cardPile.childNodes.length)]);
		} else {
			if (_status.discarded) {
				_status.discarded.add(this);
			}
		}
	}
	hasTag(tag) {
		if (this.cardid && _status.cardtag && _status.cardtag[tag] && _status.cardtag[tag].includes(this.cardid)) {
			return true;
		}
		return false;
	}
	hasPosition() {
		return ["h", "e", "j", "s", "x"].includes(get.position(this));
	}
	isInPile() {
		return ["c", "d"].includes(get.position(this));
	}
}
