import { lib } from "../library/index.js";
import { game } from "../game/index.js";
import { get } from "../get/index.js";

/**
 * @type {Map<string, {name: string, info: string}>}
 */
const _poptipMap = new Map([
	["rule_hujia", { name: "护甲", info: "和体力类似，每点护甲可抵挡1点伤害，但不影响手牌上限。" }],
	["rule_suicong", { name: "随从", info: "通过技能获得，拥有独立的技能、手牌区和装备区（共享判定区），出场时替代主武将的位置；随从死亡时自动切换回主武将。" }],
	["rule_faxian", { name: "发现", info: "从三张随机亮出的牌中选择一张，若无特殊说明，则获得此牌。" }],
	["rule_xunengji", { name: "蓄能技", info: "发动时可以增大黄色的数字。若如此做，红色数字于技能的结算过程中改为原来的两倍。" }],
	["rule_zhinang", { name: "智囊", info: "无名杀默认为过河拆桥/无懈可击/无中生有/洞烛先机。牌堆中没有的智囊牌会被过滤。可在卡牌设置中自行增减。若没有可用的智囊，则改为随机选取的三种锦囊牌的牌名。" }],
	["rule_renku", { name: "仁库", info: "部分武将使用的游戏外共通区域。至多包含六张牌。当有新牌注入后，若牌数超过上限，则将最早进入仁库的溢出牌置入弃牌堆。" }],
	["rule_shifa", { name: "施法", info: "若技能的拥有者未拥有等待执行的同名“施法”效果，则其可以发动“施法”技能。其须选择声明一个数字X（X∈[1, 3]），在此之后的第X个回合结束时，其执行“施法”效果，且效果中的数字X视为与技能发动者声明的X相同。" }],
	["rule_gongtongpindian", { name: "共同拼点", info: "一种特殊的拼点结算。发起者与被指定的拼点目标同时亮出拼点牌，进行一次结算：其中拼点牌点数唯一最大的角色赢，其他角色均没赢；若没有点数唯一最大的拼点牌，则所有角色拼点均没赢。" }],
	["rule_qiangling", { name: "强令", info: "若一名角色拥有带有“强令”的技能，则该技能的发动时机为“出牌阶段开始时”。若技能拥有者发动该技能，其须发布“强令”给一名其他角色，并在对应技能的时间节点加以判断目标角色是否成功完成该强令所要求的任务条件。成功或失败则会根据技能效果执行不同结算流程。" }],
	["rule_cuijian", { name: "摧坚", info: "若一名角色拥有带有“摧坚”的技能，则该技能的发动时机为“当你使用伤害牌指定第一个目标后”。你可以对其中一个目标发动“摧坚”技能，然后执行后续效果。其中，后续效果里的X等于该目标的非charlotte技能的数量。" }],
	["rule_wangxing", { name: "妄行", info: "一种特殊的选项。若一名角色拥有带有“妄行”的技能，则该技能触发时，你须选择声明一个数字X（X∈{1,2,3,4}），技能后续中的X即为你选择的数字。选择完毕后，你获得如下效果：回合结束时，你选择一项：1.弃置X张牌；2.减1点体力上限。" }],
	["rule_boji", { name: "搏击", info: "若一名角色拥有带有“搏击”的技能，则当该搏击技能触发时，若本次技能的目标角色在你攻击范围内，且你在其攻击范围内，则你执行技能主体效果时，同时额外执行“搏击”后的额外效果。" }],
	["rule_youji", { name: "游击", info: "若一名角色拥有带有“游击”的技能，则当该游击技能执行至“游击”处时，若本次技能的目标角色在你的攻击范围内，且你不在其攻击范围内，则你可以执行“游击”后的额外效果。" }],
	["rule_jiang", { name: "激昂", info: "一名角色发动“昂扬技”标签技能后，此技能失效，直至从此刻至满足此技能“激昂”条件后。" }],
	["rule_lizhan", { name: "历战", info: "一名角色的回合结束时，若本回合发动过拥有历战效果的技能，则对此技能效果的进行等同于发动次数的永久可叠加式升级或修改。" }],
	["rule_tongxin", { name: "同心", info: "若技能拥有同心效果，则拥有该技能的角色可在回合开始时与其他角色同心直到自己下回合开始（默认为选择一名角色同心），选择的角色称为“同心角色”。拥有同心效果的技能发动后，技能发动者先执行同心效果。然后若有与其同心的角色，这些角色也依次执行同心效果。" }],
	["rule_chihengji", { name: "持恒技", info: "拥有此标签的技能不会被其他技能无效。" }],
	["rule_chengshi", { name: "乘势", info: "乘势是一种特殊的附加效果，在技能的多分支效果中，若满足了所有其他选项的触发条件，你在尝试执行这些选项后触发“乘势”效果。" }],
	["rule_beishui", { name: "背水", info: "背水是一种特殊的选项。发动技能时，若无法执行背水的后果，则无法选择背水。选择背水时，可将该技能的其余选项依次执行，再执行背水的后果。" }],
]);

/**
 * @todo
 * 添加注册type的方法
 * 注册不同type对应的style
 */
export class PoptipManager {
	#inited = false;
	/**
	 * @type {Record<string, {
	 * 	idList: string[],
	 *  [p: string]: any
	 * }>}
	 */
	#poptip = {};

	/**
	 * id => {name, info}
	 * @type {Map<string, {
	 * 	name: string,
	 * 	info: string,
	 * 	type: string
	 * }>}
	 */
	#customPoptip = new Map();

	constructor() {
		this.#poptip["rule"] = {
			idList: Array.from(_poptipMap.keys()),
		};
		this.#poptip["skill"] = {
			get idList() {
				return Object.keys(lib.skill);
			},
		};
		this.#poptip["card"] = {
			get idList() {
				return Object.keys(lib.card);
			},
		};
	}

	init() {
		if (this.#inited) {
			return;
		}
		this.#inited = true;
		window.customElements.define("noname-poptip", HTMLPoptipElement);
		_poptipMap.forEach((value, key) => {
			lib.translate[key] = value.name;
			lib.translate[key + "_info"] = value.info;
		});
	}
	/**
	 * 获取指定类别所有具有id的poptip id
	 * 目前的类别有：rule
	 * @param {string} type
	 * @returns {string[]}
	 */
	getIdList(type) {
		if (!this.#poptip[type]) {
			return [];
		}
		return this.#poptip[type].idList.filter(i => !this.#customPoptip.has(i));
	}

	/**
	 * @overload
	 * @param {string} poptip 特殊名词的id
	 * @returns {string}
	 */
	/**
	 * @overload
	 * @param {object} poptip
	 * @param {string} [poptip.type] 类型
	 * @param {string} poptip.name 特殊名词
	 * @param {string} poptip.info 对应解释
	 * @returns {string}
	 */
	/**
	 * 生成一个超链接格式用于dialog中点击查看解释
	 * @param {string | object} poptip
	 * @returns {string}
	 */
	getElement(poptip) {
		let id;
		if (typeof poptip === "object") {
			id = lib.poptip.add(poptip);
		} else {
			id = poptip;
		}
		// 由于创建poptip时`lib.translate`还没初始化完成，必须运行时读取翻译，不能内嵌
		return `<noname-poptip poptip = ${id}></noname-poptip>`;
	}

	/**
	 * 获取id对应的类型
	 * @param {string} id
	 * @returns {string | undefined}
	 */
	getType(id) {
		if (this.#customPoptip.has(id)) {
			return this.#customPoptip.get(id)?.type;
		}
		for (const type in this.#poptip) {
			// 增加搜索效率，可移除
			if (type === "skill") {
				if (id in lib.skill) {
					return type;
				}
				continue;
			}
			if (type === "card") {
				if (id in lib.card) {
					return type;
				}
				continue;
			}

			if (this.#poptip[type].idList.includes(id)) {
				return type;
			}
		}
		return undefined;
	}

	/**
	 * 获取一个特殊名词的名字
	 * @param {string} id
	 */
	getName(id) {
		return this.#customPoptip.get(id)?.name || get.translation(id);
	}
	/**
	 * 获取一个特殊名词的解释
	 * @param {string} id
	 */
	getInfo(id) {
		return this.#customPoptip.get(id)?.info || get.translation(id + "_info");
	}
	/**
	 * 添加名词解释
	 * @param {object} poptip
	 * @param {string} [poptip.type] 名词类型
	 * @param {string} [poptip.id]
	 * @param {string} poptip.name 名字，最终显示在translate上的文字
	 * @param {string} [poptip.info] 解释，最终显示在弹窗里的文字
	 * @returns {string} 生成的id
	 */
	add(poptip) {
		let { type = "rule", id, name, info = "" } = poptip;
		if (!this.#poptip[type]) {
			throw new Error(`未注册的poptip类型: ${type}`);
		} else if (id && (type === "skill" || type === "card")) {
			console.warn("请于lib.skill/lib.card中显式注册技能/卡牌。");
		}

		if (id) {
			lib.translate[id] = name;
			lib.translate[id + "_info"] = info;
			this.#poptip[type].idList.add(id);
		} else {
			do {
				id = Math.random().toString(36).slice(-8);
			} while (this.#customPoptip.has(id));
			this.#customPoptip.set(id, { name, info, type });
		}

		return id;
	}
	// /**
	//  * @param {string} id
	//  */
	// remove(id) {
	// 	this.#poptipMap.delete(id);
	// }
}

export class HTMLPoptipElement extends HTMLElement {
	#inited = false;

	connectedCallback() {
		if (this.#inited) {
			return;
		}
		this.#inited = true;

		this.createdCallback();
		this.addEventListener(lib.config.touchscreen ? "touchstart" : "click", e => {
			// 保证同一时间只能出现一个poptip框，做完窗口管理后可删
			game.closePoptipDialog();
			return get.poptipIntro(this.info, e);
		});
	}

	createdCallback() {
		this.textContent = this.name;
	}

	/**
	 * @todo
	 * 根据类型接口显示名称（技能〖name〗，卡牌【name】）
	 */
	get name() {
		const name = lib.poptip.getName(this.getAttribute("poptip") || "");
		// 先写死
		switch (this.type) {
			case "skill":
				return "〖" + name + "〗";
			case "card":
				return "【" + name + "】";
			default:
				return name;
		}
	}
	get info() {
		return lib.poptip.getInfo(this.getAttribute("poptip") || "");
	}
	get type() {
		return lib.poptip.getType(this.getAttribute("poptip") || "") || "rule";
	}
}
