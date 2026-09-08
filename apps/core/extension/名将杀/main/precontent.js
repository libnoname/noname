import { lib, game, ui, get, ai, _status } from "noname";
import { arenaReady } from "./arenaReady.js";

export function precontent(config, pack) {
	var mjs = {
		get maxEquipBase() {
			return Number(game.getExtensionConfig("名将杀", "maxEquipBase")) || 3;
		},
		suit: ["diamond", "club", "spade", "heart"],
		suits: ["diamond", "club", "spade", "heart", "taiji"],
		cardPack: {
			basic: ["sha", "tao", "shan", "yi", "nu"],
			trick: [
				"mjszhenqianduijue", "mjsxiuyangshengxi", "mjsduoduoyishan", "mjsxianbatouchou", "mjstianlei", "mjsliehuofencheng",
				"mjsfenghuolangyan", "mjsdihuo", "mjsjianyuqishe", "mjslianhuan", "mjsduoliangjieying", "mjspozhenxiejia",
				"mjsdiaobingqianjiang", "mjsjiuhan", "mjsshuangdong", "wuxie",
			],
			equip: [
				"mjsliangyinqiang", "mjsqinglongyanyuedao", "mjskaishanfu", "mjsxuanyuanjian", "mjsminghongdao", "mjsfangtianhuaji",
				"mjsganjiangmoye", "mjsyinshikui", "mjszhangbashemao", "mjsjingyugong", "mjszhugeliannu", "mjstengjia",
				"mjsdilu", "mjsdaoli", "mjssaluzi", "mjszhuahuangfeidian", "mjsbaitiwu", "mjswuzhui",
				"mjsjueying", "mjsyunjinpao", "mjsfengyukui", "mjsxuanwudun", "mjsbaguadun", "mjsyushan",
				"mjschitu", "mjslongshegong",
			],
		},
		getBasic(bool) {
			let basic = this.cardPack.basic;
			if (bool == "random") {
				return basic.randomGet();
			}
			return basic;
		},
		getTrick(bool) {
			let trick = this.cardPack.trick;
			if (bool == "random") {
				return trick.randomGet();
			}
			return trick;
		},
		getEquip(bool) {
			let equip = this.cardPack.equip;
			if (bool == "random") {
				return equip.randomGet();
			}
			return equip;
		},
		getCardList(type) {
			if (type) {
				return this.cardPack[type];
			}
			let list = Object.values(this.cardPack).flat();
			return list;
		},
		getVCardList(type) {
			let inpile_list = this.cardPack[type];
			let list = [];
			for (let name2 of inpile_list) {
				let type = get.type(name2);
	  			let info = [type, "", name2];
	  			list.push(info);
				if (name2 == "sha") {
					for (let nature of ["fire", "thunder"]) {
			          	let info2 = [type, "", name2, nature];
			          	list.push(info2);
			        }
				}
			}
			return list;
		},
		getCardPile(pattern, position, start = "top") {
		    let filter;
		    let create = false;
		    let filtering = true;
		    if (pattern === true) {
		      filtering = false;
		    } else if (typeof pattern === "function") {
		      filter = pattern;
		    } else if (pattern) {
		      if (typeof pattern === "string") {
		        filter = (card) => card.name === pattern;
		      } else {
		        const entries = [];
		        for (const key in pattern) {
		          const filterVal = pattern[key];
		          entries.push({
		            key,
		            filterVal,
		            isArray: Array.isArray(filterVal)
		          });
		        }
		        filter = (card) => {
		          for (const { key, filterVal, isArray } of entries) {
		            const value = card[key];
		            if (!value) {
		              continue;
		            }
		            if (!isArray && value !== filterVal || isArray && !filterVal.includes(value)) {
		              return false;
		            }
		          }
		          return true;
		        };
		      }
		      if (position === true) {
		        create = true;
		      }
		    } else {
		      console.error("调用get.cardPile()时未传入符合条件的参数name！");
		      return null;
		    }
		    const matches = (card) => !filtering || filter(card);
		    const findInPile = (pile, reverse = false) => {
		      const nodes = pile.childNodes;
		      const length = nodes.length;
		      if (!length) {
		        return null;
		      }
		      if (reverse) {
		        let index2 = length;
		        while (index2--) {
		          const card = nodes[index2];
		          if (matches(card)) {
		            return card;
		          }
		        }
		        return null;
		      }
		      let index = start === "random" ? get.rand(0, length - 1) : 0;
		      let count = 0;
		      while (count < length) {
		        const card = nodes[index];
		        if (matches(card)) {
		          return card;
		        }
		        count++;
		        index++;
		        if (index === length) {
		          index = 0;
		        }
		      }
		      return null;
		    };
		    if (start === "bottom") {
		      if (position !== "cardPile") {
		        const card = findInPile(ui.discardPile, true);
		        if (card) {
		          return card;
		        }
		      }
		      if (position !== "discardPile") {
		        const card = findInPile(ui.cardPile, true);
		        if (card) {
		          return card;
		        }
		      }
		      if (position === "field") {
		        for (const current of reversedPlayers()) {
		          for (const card of reversedFieldCards(current)) {
		            if (matches(card)) {
		              return card;
		            }
		          }
		        }
		      }
		      if (create) {
		        return game.createCard(pattern);
		      }
		      return null;
		    }
		    if (position !== "discardPile") {
		      const card = findInPile(ui.cardPile);
		      if (card) {
		        return card;
		      }
		    }
		    if (position !== "cardPile") {
		      const card = findInPile(ui.discardPile);
		      if (card) {
		        return card;
		      }
		    }
		    if (position === "field") {
		      for (const current of game.filterPlayer()) {
		        for (const card of current.iterableGetCards("hej")) {
		          if (matches(card)) {
		            return card;
		          }
		        }
		      }
		    }
		    if (create) {
		      return game.createCard(pattern);
		    }
		    return null;
		    function* reversedPlayers() {
		      let i = game.players.length;
		      while (i--) {
		        const player = game.players[i];
		        if (!player.isOut()) {
		          yield player;
		        }
		      }
		    }
		    function* reversedFieldCards(player) {
		      const judges = player.node.judges.childNodes;
		      let index = judges.length;
		      while (index--) {
		        const card = judges[index];
		        if (card.classList.contains("removing") || card.classList.contains("feichu")) {
		          continue;
		        }
		        yield card;
		      }
		      const equips = player.node.equips.childNodes;
		      index = equips.length;
		      while (index--) {
		        const card = equips[index];
		        if (card.classList.contains("removing") || card.classList.contains("feichu") || card.classList.contains("emptyequip")) {
		          continue;
		        }
		        yield card;
		      }
		    }
		},
		getSuit(name) {
			let suit = lib.card[name]?.cardsuit || lib.suit.randomGet();
			return suit;
		},
		getNumber(name) {
			let number = lib.card[name]?.cardnumber || get.rand(1, 8);
			return number;
		},
		createCard(name2, suit, number, nature) {
			suit = suit || this.getSuit(name2);
			number = number || this.getNumber(name2);
			let card = game.createCard2(name2, suit, number, nature);
			return card;
		},
		addCreateSkills(skills, popup) {
			let addSkill = [];
			if (!skills) {
				return addSkill;
			}
			if (typeof skills == "string") {
				skills = [skills];
			}

			for (const skill of skills) {
				if (!lib.skill[skill]) continue;
				let skillName;
				do {
					skillName = skill + Math.random().toString(36).slice(-8);
				} while (lib.skill[skillName] != null);

				let info = get.copy(lib.skill[skill]);
				function functionToString(func) {
					let str = func.toString();
					if (str.startsWith("async")) {
						str = str.replace(/^async\s+\w+\s*\(/, "async (");
						if (!str.includes("async function")) {
							str = str.replace(/^async\s+/, "async function ");
						}
					} else if (str.startsWith("function")) {
						str = str.replace(/^function\s+\w+\s*\(/, "function(");
					} else {
						if (str.match(/^\w+\s*\(/)) {
							str = str.replace(/^\w+\s*\(/, "function(");
						}
					}
					return str;
				}
				function objectToCodeString(obj, indent = 0) {
					const spaces = " ".repeat(indent);
					if (obj === null) return "null";
					if (typeof obj === "string") return JSON.stringify(obj);
					if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
					if (typeof obj === "function") return functionToString(obj);
					if (Array.isArray(obj)) {
						const items = obj.map(item => objectToCodeString(item, indent + 4));
						return "[" + items.join(", ") + "]";
					}
					if (typeof obj === "object") {
						const props = Object.keys(obj).map(key => {
							const valStr = objectToCodeString(obj[key], indent + 4);
							const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
							return `${spaces}${keyStr}: ${valStr}`;
						});
						return `{\n${props.join(",\n")}\n${spaces}}`;
					}
					return String(obj);
				}
				let text = objectToCodeString(info);
				let regex = new RegExp(skill, "g");
				let result = text.replace(regex, skillName);
				game.broadcastAll(
            		(skill, result, skillName, addSkill) => {
            			lib.skill[skillName] = eval("(" + result + ")");
						lib.translate[skillName] = lib.translate[skill];
						lib.translate[skillName + "_info"] = lib.translate[skill + "_info"];
						lib.skill[skillName].audio = skill;
						lib.skill[skillName].createFrom = skill;
						game.finishSkill(skillName);
						addSkill.push(skillName);
            		},
            		skill,
            		result,
            		skillName,
            		addSkill
            	);
			}
			
			return addSkill;
		},
		prompt(skill, target, player) {
			player = player || _status.event.player;
			var str = "";
			var str2 = mjs.prompt2(skill, "skill");
			if (target) {
				var str3 = mjs.prompt2(target, "player");
				if (target == player) {
					str3 += "（你）";
				}
				return `是否对${str3}发动${str2}`;
			} else {
				return str + str2 + "发动";
			}
		},
		prompt2(str, type) {
			switch (type) {
				case "skill": 
					return `<span class="mj-skilltext">${get.translation(str)}</span>`;
				case "player": 
					return `<span class="mj-playertext">${get.translation(str)}</span>`;
				default: 
					return get.translation(str);
			}
		},
	};

	lib.mjs = mjs;
	window.mjs = mjs;
	lib.init.css(lib.assetURL + "extension/名将杀", "extension");
	
	game.addGroup("qi", "齐", "齐国", { color: [[62, 26, 78], [93, 53, 109], [140, 113, 155], [182, 173, 187]] });
	game.addGroup("yan", "燕", "燕国", { color: [[30, 32, 70], [66, 61, 115], [128, 113, 157], [182, 173, 187]] });
	game.addGroup("chu", "楚", "楚国", { color: [[46, 5, 4], [78, 10, 7], [129, 14, 11], [212, 37, 20]] });
	game.addGroup("daqin", "秦", "秦国", { color: [[28, 28, 28], [54, 51, 49], [59, 57, 58], [30, 29, 29]] });
	game.addGroup("han", "韩", "韩国", { color: [[43, 104, 45], [43, 72, 26], [139, 155, 61], [152, 148, 32]] });
	game.addGroup("zhao", "赵", "赵国", { color: [[162, 119, 59], [152, 99, 31], [177, 82, 30], [206, 77, 26]] });
	game.addGroup("wèi", "魏", "魏国", { color: [[152, 38, 40], [148, 24, 13], [163, 55, 35], [214, 120, 46]] });
	game.addGroup("zhāngchǔ", "张楚", "张楚", { color: [[194, 194, 192], [203, 203, 202], [216, 216, 214], [220, 220, 220]] });
	game.addGroup("xichu", "西楚", "西楚", { color: [[194, 194, 192], [203, 203, 202], [216, 216, 214], [220, 220, 220]] });
	game.addGroup("xihan", "西汉", "西汉", { color: [[151, 38, 34], [116, 15, 10], [168, 28, 27], [146, 27, 19]] });
	game.addGroup("donghan", "东汉", "东汉", { color: [[151, 38, 34], [116, 15, 10], [168, 28, 27], [146, 27, 19]] });
	game.addGroup("huangjin", "黄巾", "黄巾", { color: [[170, 124, 63], [135, 108, 45], [180, 145, 72], [168, 141, 72]] });
	game.addGroup("song", "宋", "宋国", { color: "#516160" });
	game.addGroup("xijin", "西晋", "西晋", { color: "#484d60"});
	game.addGroup("g_noname", "无", "无名", { color: [[28, 28, 28], [54, 51, 49], [59, 57, 58], [30, 29, 29]] }, "custom");

	//<noname-poptip poptip = tipname></noname-poptip>
	const poptipMap = new Map([
		["rule_mjs_yingzhan", {
			name: "应战",
			info: "应战：当你成为杀的目标时",
		}],
		["rule_mjs_zhongshang", {
			name: "重伤",
			info: "重伤：当角色体力值降低至0时",
		}],
		["rule_mjs_qiangming", {
			name: "强命",
			info: "强命：打出的杀无法被抵消",
		}],
		["rule_mjs_guanchuan", {
			name: "贯穿",
			info: "贯穿：无视目标防具",
		}],
		["rule_mjs_fengjin", {
			name: "封禁",
			info: "封禁：令目标本回合无法发动武将技能",
		}],
	]);
	poptipMap.forEach((value, key) => {
		lib.translate[key] = value.name;
		lib.translate[`${key}_info`] = value.info;
	});

	const origin_player_canEquip = lib.element.player.canEquip;
	lib.element.player.canEquip = function (name, replace) {
		if (this.hasMJSEquip()) {
			if (get.itemtype(name) == "card") {
				const owner = get.owner(name, "judge");
				if (owner && !lib.filter.canBeGained(name, this, owner)) {
					return false;
				}
			}
			let num = this.mjsGetEquipLimit();
			let num2 = this.getVCards("e").length;
			if (!replace) {
				num += this.getVCards("e").filter(card => lib.filter.canBeReplaced(card, this)).length;
			}
			if (num <= 0) {
				return false;
			}
			return true;
		}
		return origin_player_canEquip.apply(this, arguments);
	};
	// 感谢子虚（@凉水化白开）的代码，已征得作者同意
	const resolveObjectPath = async (path) => {
        await game.getFileList(path, async (folders, files) => {
            for (const file of files) {
                const objPath = path.slice(21).replace(/\//g, ".");
                const result = await import("../../../" + path + "/" + file);
                if (!result.default) continue;
                eval(`mergeObjects(${objPath}, result.default)`);
            }
            for (const folder of folders) resolveObjectPath(path + "/" + folder)
        });
    };
    const mergeObjects = function (obj, obj2) {
        if (obj.toString().slice(0, 5) == "class") {
            mergeObjects(obj.prototype, obj2);
            return;
        }
        for (const i in obj2) {
            if (Object.getOwnPropertyDescriptor(obj2, i).get) Object.defineProperty(obj, i, Object.getOwnPropertyDescriptor(obj2, i))
            else if (obj2[i] instanceof Map) {
                obj[i] ??= new Map()
                for (const [key, value] of obj2[i])
                    obj[i].set(key, value)
            }
            else if (obj2[i] instanceof Set) {
                obj[i] ??= new Set()
                obj[i] = new Set([...obj[i], ...obj2[i]])
            }
            else if (Array.isArray(obj2[i])) {
                obj[i] ??= []
                obj[i].addArray(obj2[i])
            }
            else if (typeof obj2[i] == "object") {
                obj[i] ??= {}
                mergeObjects(obj[i], obj2[i])
            }
            else Object.defineProperty(obj, i, Object.getOwnPropertyDescriptor(obj2, i))
        }
    }
    resolveObjectPath("extension/名将杀/src/js/lib");

	Promise.all([
		import("../card/index.js"),
		import("../character/now/index.js"),
		import("../character/new/index.js"),
		import("../character/old/index.js"),
		// 当前发布包未包含 skin/index.js，跳过可选的皮肤模块。
		import("../mode/index.js"),
	])
		.then(() => {
			lib.translate.mjs_card_config = "名将杀";
			lib.translate.mjs_character_config = "名将杀";
			lib.translate.mjsnew_character_config = "名将新修";
			lib.translate.mjsold_character_config = "名将旧改";
		})
		.catch(err => {
			alert("『名将杀』扩展导入失败", err);
			console.error("Error:『名将杀』扩展导入失败" + err.message);
		});
	
	lib.arenaReady.push(() => {
		if (!_status.connectMode) return;
		arenaReady();
	});
	
}
