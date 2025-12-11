import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	mbkubai(player, skill) {
		const level = player.countMark(skill);
		if (!level) {
			return lib.translate[`${skill}_info`];
		}
		if (level === 1) {
			return lib.translate[`${skill}_suit_info`];
		}
		return lib.translate[`${skill}_number_info`];
	},
	mbkechang(player, skill) {
		if (player.getStorage(skill, false)) {
			return lib.translate[`${skill}_rewrite_info`];
		}
		return lib.translate[`${skill}_info`];
	},
	mbweizhuang(player, skill) {
		if (!player) {
			return lib.translate[`${skill}_info`];
		}
		if (get.nameList(player).includes("mb_cuilingyi")) {
			const skin = player.skin[player.name2 === "mb_cuilingyi" ? "name2" : "name"],
				index = lib.characterSubstitute["mb_cuilingyi"].map(i =>i[0]).indexOf(skin);
			if (index >= 0) {
				const trueSkill = `${skill}_${skin.slice(13, -1)}x`;
				return get.skillInfoTranslation(trueSkill, player, false);
			}
		}
		return "这衣服，岂是你配穿的？";
	},
	mbfozong(player) {
		const list = player.getStorage("mbfozong");
		if (!list?.length) {
			return lib.translate["mbfozong"];
		}
		const colors = list?.map(i => get.translation(i))?.join("和");
		return `锁定技，你的${colors}手牌不计入手牌上限，造成的伤害值和恢复值+1。`;
	},
	yizan_use(player) {
		if (player.storage.yizan) {
			return "你可以将一张基本牌当做任意基本牌使用或打出。";
		}
		return "你可以将两张牌（其中至少一张为基本牌）当做任意基本牌使用或打出。";
	},
	miaojian(player) {
		return ["出牌阶段限一次。你可将一张【杀】当做刺【杀】使用，或将一张锦囊牌当做【无中生有】使用。", "出牌阶段限一次。你可将一张基本牌当做刺【杀】使用，或将一张非基本牌当做【无中生有】使用。", "出牌阶段限一次。你可视为使用一张刺【杀】或【无中生有】。"][player.countMark("miaojian")];
	},
	shhlianhua(player) {
		return ["当你成为【杀】的目标后，你摸一张牌。", "当你成为【杀】的目标后，你摸一张牌。然后你进行判定，若结果为黑桃，则此【杀】对你无效。", "当你成为【杀】的目标后，你摸一张牌。然后此【杀】的使用者选择一项：①弃置一张牌。②令此【杀】对你无效。"][player.countMark("shhlianhua")];
	},
	mobilexingxue(player) {
		return lib.translate[(player.storage.mobileyanzhu ? "mobilexingxuex" : "mobilexingxue") + "_info"];
	},
	shoufa(player) {
		const zhoufa = player.storage.zhoulin_zhoufa;
		const nodoudizhu = get.mode() == "doudizhu" ? "与你距离不小于1的/距离不大于1的" : "与你距离不小于2的/距离不大于2的";
		if (!zhoufa) {
			return "当你受到伤害后/于一回合首次造成伤害后，你可以选择一名" + nodoudizhu + "角色，令其随机执行以下一项：豹，令其受到1点无来源伤害；鹰，你随机获得其一张牌；熊，你随机弃置其装备区的一张牌；兔，令其摸一张牌。";
		}
		let str = "当你受到伤害后/于一回合首次造成伤害后，你可以选择一名" + nodoudizhu + "角色，";
		str += ["令其受到1点无来源伤害", "你随机获得其一张牌", "你随机弃置其装备区的一张牌", "令其摸一张牌"][["豹", "鹰", "熊", "兔"].indexOf(zhoufa)];
		return str + "。";
	},
	mbxuetu(player) {
		const bool = player.storage.mbxuetu,
			status = player.countMark("mbxuetu_status");
		if (status === 1) {
			return lib.translate.mbxuetu_achieve_info;
		}
		let yang = status === 0 ? "你可以令一名角色回复1点体力" : "你可以回复1点体力，然后令一名其他角色弃置两张牌",
			yin = status === 0 ? "你可以令一名角色摸两张牌" : "你可以摸一张牌，然后对一名其他角色造成1点伤害";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。出牌阶段限一次，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	mbzuoyou(player) {
		const bool = player.storage.mbzuoyou;
		let yang = "你可以令一名角色摸三张牌，然后其弃置两张牌",
			yin = "你可以令一名角色获得1点护甲";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。出牌阶段限一次，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	mbfunan(player) {
		if (player.storage.mbfunan_rewrite) {
			return `其他角色使用或打出牌响应你使用的牌时，你可以获得其使用或打出的牌，且你使用以此法获得的牌结算结束后，若没有其他角色响应此牌，你摸一张牌。`;
		}
		return `其他角色使用或打出牌响应你使用的牌时，你可以获得其使用或打出的牌。`;
	},
	mbxuehen(player) {
		const storage = player.storage.mbxuehen;
		let str = "当你每回合首次造成或受到伤害后，你可展示至多X张手牌（X为你已损失体力值），这些牌只能当不计入次数且无次数限制的【杀】使用或打出，直到你使用这些牌造成伤害";
		if (storage) {
			str += "，且你使用以此法转化的【杀】结算结束后摸一张牌";
		}
		str += "。";
		return str;
	},
};
export default dynamicTranslates;
