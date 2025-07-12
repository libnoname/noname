import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	olqiaowu(player){
		const bool = player.storage.olqiaowu;
		let yang = "摸一张牌",
			yin = "选择是否使用一张【杀】";
		if (!bool) {
			yang = `<span class=firetext>${yang}</span>`;
		} else {
			yin = `<span class=bluetext>${yin}</span>`;
		}
		const start = "转换技，每回合限一次，当你使用的【杀】或【闪】结算完毕后，你可令所有处于【酒】状态的角色：",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	shanduan(player) {
		if (player.storage.shanduan) {
			return "锁定技。①摸牌/出牌/弃牌阶段开始时，你为本回合摸牌阶段摸牌数/攻击范围和使用【杀】的限制次数/手牌上限的默认值从数组R=[" + get.translation(player.storage.shanduan) + "]中分配数值。②当你于回合外受到伤害后，你令下回合〖善断①〗以此法分配的数值集合R中的最小值+1。";
		}
		return "锁定技。①摸牌/出牌/弃牌阶段开始时，你为本回合摸牌阶段摸牌数/攻击范围和使用【杀】的限制次数/手牌上限的默认值从数组R=[1，2，3，4]中分配数值。②当你于回合外受到伤害后，你令下回合〖善断①〗以此法分配的数值集合R中的最小值+1。";
	},
	kunfen(player) {
		if (player.storage.kunfen) {
			return "结束阶段开始时，你可以失去1点体力，然后摸两张牌。";
		}
		return "锁定技，结束阶段开始时，你失去1点体力，然后摸两张牌。";
	},
	jieyuan(player) {
		var str = "当你对一名其他角色造成伤害时，";
		if (!player.hasSkill("fenxin_fan")) {
			str += "若其体力值大于或等于你的体力值，";
		}
		str += "你可弃置一张";
		if (!player.hasSkill("fenxin_nei")) {
			str += "黑色手";
		}
		str += "牌，令此伤害+1；当你受到一名其他角色造成的伤害时，";
		if (!player.hasSkill("fenxin_zhong")) {
			str += "若其体力值大于或等于你的体力值，";
		}
		str += "你可弃置一张";
		if (!player.hasSkill("fenxin_nei")) {
			str += "红色手";
		}
		str += "牌，令此伤害-1。";
		return str;
	},
	youlong(player) {
		const bool = player.storage.youlong;
		let yang = "普通锦囊牌",
			yin = "基本牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。每轮每项各限一次，你可以废除你的一个装备栏，视为使用一张未以此法使用过的：",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	luochong(player) {
		var storage = player.getStorage("luochong");
		var str = "准备阶段开始时/当你于一回合首次受到伤害后，你可选择本轮内未选择过的一项（每名角色每轮限选一次）：";
		var choiceList = ["⒈令一名角色回复1点体力。", "⒉令一名角色失去1点体力。", "⒊令一名角色弃置两张牌。", "⒋令一名角色摸两张牌。"];
		for (var i = 0; i < 4; i++) {
			if (storage.includes(i)) {
				choiceList[i] = '<span style="text-decoration: line-through;">' + choiceList[i] + "</span>";
			}
			str += choiceList[i];
		}
		return str;
	},
	spmanwang(player) {
		var num = 4 - player.countMark("spmanwang");
		var str = "出牌阶段，你可以弃置任意张牌。然后你依次执行以下选项中的前等量项：";
		var list = ["⒈获得〖叛侵〗。", "⒉摸一张牌。", "⒊回复1点体力。", "⒋摸两张牌并失去〖叛侵〗。"];
		for (var i = 0; i < 4; i++) {
			if (i == num) {
				str += '<span style="text-decoration: line-through;">';
			}
			str += list[i];
		}
		if (num < 4) {
			str += "</span>";
		}
		return str;
	},
	olbixin(player) {
		var count = player.countMark("olbixin");
		if (count < 3) {
			return lib.translate.olbixin_info.slice(count * 5);
		}
		return "你可以声明一种牌的类型（每种类型限[3]次），并选择一种你本轮未使用过且有合法目标的的基本牌。你摸[1]张牌，然后若你有此类型的手牌，你将所有此类型的手牌当此基本牌使用。";
	},
	olfeibai(player) {
		const bool = player.storage.olfeibai;
		let yang = "当你因执行你使用的非黑色牌的效果而造成伤害时，此伤害值+1",
			yin = "当你因执行你使用的非红色牌的效果而回复体力时，此回复值+1";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，锁定技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	olmiuyan(player) {
		const bool = player.storage.olmiuyan;
		let yang = "造成了伤害，则你获得此阶段内所有被展示过的牌",
			yin = "未造成伤害，则你令此技能失效直到本轮结束";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。你可以将一张黑色牌当做【火攻】使用，然后若此牌：",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	olsaogu(player) {
		const bool = player.storage.olsaogu;
		let yang = "弃置两张牌（不能包含你本阶段弃置过的花色），然后使用其中的【杀】",
			yin = "摸一张牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。①出牌阶段，你可以：",
			end = "。②结束阶段，你可以弃置一张牌，令一名其他角色执行你当前〖扫谷①〗的分支。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	oldongdao(player) {
		if (player.storage.oldongdao) {
			return '农民的回合结束时：阴，你可以令地主进行一个额外回合；<span class="bluetext">阳，其可以进行一个额外回合</span>。';
		}
		return '农民的回合结束时：<span class="bluetext">阴，你可以令地主进行一个额外回合</span>；阳，其可以进行一个额外回合。';
	},
	ollangdao(player) {
		var str = "当你使用【杀】指定唯一目标时，你可以与该目标角色同时选择一项：";
		var list = ["1.令此【杀】伤害基数+1；", "2.令你可以为此【杀】多选择一个目标；", "3.令此【杀】不可被响应。"];
		var storage = player.getStorage("ollangdao");
		list.forEach((item, index) => {
			if (storage.includes(index)) {
				str += `<span style="text-decoration: line-through;">${item}</span>`;
			} else {
				str += item;
			}
		});
		str += "然后若没有角色因此【杀】死亡，你移除本次被选择的项。";
		return str;
	},
	olxuanzhu(player) {
		const bool = player.storage.olxuanzhu;
		let yang = "任意基本牌",
			yin = "任意普通锦囊牌（须指定目标且仅指定一个目标）";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。每回合限一次，你可以将一张牌称为“玄”置于武将牌上，然后视为使用：",
			end = "。若此次置于武将牌上的“玄”：不为装备牌，你弃置一张牌；为装备牌，你将所有“玄”置入弃牌堆，然后摸等量的牌。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	olziruo(player) {
		const bool = player.storage.olziruo;
		let yang = "左",
			yin = "右";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，锁定技。①当你使用最",
			end = "侧的手牌时，你摸一张牌。②你以此法摸牌后本回合不能整理手牌。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	olkouchao(player) {
		const nameList = player.storage.olkouchao || ["sha", "huogong", "guohe"];
		const str = nameList.map(i => "【" + get.translation(i) + "】").join("/");
		return "每轮每项限一次，你可以将一张牌当作" + str + "使用。此牌结算完毕后，将此项改为本局游戏最后一张不因使用进入弃牌堆的基本牌或普通锦囊牌的牌名，然后若〖寇钞〗的所有项均为基本牌，则你修改〖寇钞〗的所有项为【顺手牵羊】。";
	},
	olliyong(player) {
		const bool = player.storage.olliyong;
		let yang = "你可以将一张你本回合未使用过的花色的牌当作【决斗】使用",
			yin = "你可以从牌堆中获得一张你本回合使用过的花色的牌，令一名其他角色视为对你使用一张【决斗】";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。出牌阶段，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};
export default dynamicTranslates;
