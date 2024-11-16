import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	dcsbkongwu(player) {
		let str = "转换技，出牌阶段限一次，你可以弃置至多体力上限张牌，选择一名其他角色：",
			yin = "阴，弃置其至多等量张牌；",
			yang = "阳，视为对其使用等量张【杀】。";
		if (player.storage.dcsbkongwu) yang = `<span class="firetext">${yang}</span>`;
		else yin = `<span class="bluetext">${yin}</span>`;
		return str + yin + yang + "此阶段结束时，若其手牌数和体力值均不大于你，其下回合摸牌阶段摸牌数-1且装备区里的所有牌失效。";
	},
	dckengqiang(player) {
		let str = player.storage.dcshangjue ? "每回合每项各限一次" : "每回合限一次";
		str += "，当你造成伤害时，你可以：1.摸体力上限张牌；2.令此伤害+1并获得造成伤害的牌。";
		return str;
	},
	xinlvli(player) {
		var str = "每回合限一次";
		if (player.storage.choujue) str += "（自己的回合内则改为限两次）";
		str += "，当你造成";
		if (player.storage.beishui) str += "或受到";
		str += "伤害后，你可选择：1，若你的体力值大于你的手牌数，你摸Ｘ张牌；2，若你的手牌数大于你的体力值且你已受伤，你回复Ｘ点体力（Ｘ为你的手牌数与体力值之差）。";
		return str;
	},
	lvli(player) {
		var str = "每名角色的回合限一次";
		if (player.storage.choujue) str += "（自己的回合内则改为限两次）";
		str += "，你可以声明一个基本牌或普通锦囊牌的牌名，有随机概率视为使用之（装备区里的牌数越多，成功概率越大）";
		if (player.storage.beishui) str += "。当你受到伤害后，你也可以以此法使用一张牌。";
		return str;
	},
	rezhongjian(player) {
		return "出牌阶段限" + (player.hasSkill("recaishi2") ? "两" : "一") + "次，你可以选择一名本回合内未选择过的角色。你令其获得一项效果直至你的下回合开始：①其下次造成伤害后弃置两张牌，然后你摸一张牌。②其下次受到伤害后摸两张牌，然后你摸一张牌。";
	},
	bazhan(player) {
		if (player.storage.bazhan) return '转换技，出牌阶段限一次，阴：你可以将至多两张手牌交给一名其他角色。<span class="bluetext">阳：你可以获得一名其他角色的至多两张手牌。</span>若以此法移动的牌包含【酒】或♥牌，则你可令得到此牌的角色执行一项：①回复1点体力。②复原武将牌。';
		return '转换技，出牌阶段限一次，<span class="bluetext">阴：你可以将至多两张手牌交给一名其他角色。</span>阳：你可以获得一名其他角色的至多两张手牌。若以此法移动的牌包含【酒】或♥牌，则你可令得到此牌的角色执行一项：①回复1点体力。②复原武将牌。';
	},
	zhiren(player) {
		return "当你于" + (player.hasSkill("yaner_zhiren") ? "一" : "你的") + "回合内使用第一张非转化牌时，你可依次执行以下选项中的前X项：①卜算X。②可弃置场上的一张" + (get.mode() == "guozhan" ? "牌" : "装备牌和延时锦囊牌") + "。③回复1点体力。④摸" + (get.mode() == "guozhan" ? "两" : "三") + "张牌。（X为此牌的名称的字数）";
	},
	yuqi(player) {
		var info = lib.skill.yuqi.getInfo(player);
		return "每回合限两次。当有角色受到伤害后，若你至其的距离不大于<span class=thundertext>" + info[0] + "</span>，则你可以观看牌堆顶的<span class=firetext>" + info[1] + "</span>张牌。你将其中至多<span class=greentext>" + info[2] + "</span>张牌交给受伤角色，然后可以获得剩余牌中的至多<span class=yellowtext>" + info[3] + "</span>张牌，并将其余牌以原顺序放回牌堆顶。（所有具有颜色的数字至多为5）";
	},
	caiyi(player) {
		var current = player.storage.caiyi,
			list = player.storage.caiyi_info || [[], []];
		var str = "转换技。结束阶段，你可令一名角色选择并执行一项，然后移除此选项。";
		var list1 = ["⒈回复X点体力。", "⒉摸X张牌。", "⒊复原武将牌。", "⒋随机执行一个已经移除过的阴选项；"],
			list2 = ["⒈受到X点伤害。", "⒉弃置X张牌。", "⒊翻面并横置。", "⒋随机执行一个已经移除过的阳选项。"],
			str1 = "阴：",
			str2 = "阳：";
		for (var i = 0; i < 4; i++) {
			var clip1 = list1[i],
				clip2 = list2[i];
			if (list[0].includes(i)) clip1 = '<span style="text-decoration:line-through;">' + clip1 + "</span>";
			if (list[1].includes(i)) clip2 = '<span style="text-decoration:line-through;">' + clip2 + "</span>";
			str1 += clip1;
			str2 += clip2;
		}
		if (current) str2 = '<span class="bluetext">' + str2 + "</span>";
		else str1 = '<span class="bluetext">' + str1 + "</span>";
		return str + str1 + str2 + "（X为该阴阳态剩余选项的数量）。";
	},
	dchuishu(player) {
		var list = lib.skill.dchuishu.getList(player);
		return "摸牌阶段结束时，你可以摸[" + list[0] + "]张牌。若如此做：你弃置[" + list[1] + "]张手牌，且当你于本回合内弃置第[" + list[2] + "]+1张牌后，你从弃牌堆中随机获得〖慧淑〗第三个括号数字张非基本牌。";
	},
	dcshoutan(player) {
		if (player.storage.dcshoutan) return '转换技。出牌阶段限一次，阴：你可以弃置一张不为黑色的手牌。<span class="bluetext">阳：你可以弃置一张黑色手牌。</span>';
		return '转换技。出牌阶段限一次，<span class="bluetext">阴：你可以弃置一张不为黑色的手牌。</span>阳：你可以弃置一张黑色手牌。';
	},
	dcluochong(player) {
		return "一轮游戏开始时，你可以弃置任意名角色区域里的共计至多[" + (4 - player.countMark("dcluochong")) + "]张牌，然后若你以此法弃置了一名角色的至少三张牌，则你方括号内的数字-1。";
	},
	dczhangcai(player) {
		return "当你使用或打出" + (player.hasSkill("dczhangcai_all") ? "" : "点数为8的") + "牌时，你可以摸X张牌（X为你手牌区里" + (player.hasSkill("dczhangcai_all") ? "与此牌点数相同" : "点数为8") + "的牌数且至少为1）。";
	},
	dcsbmengmou(player) {
		var storage = player.storage.dcsbmengmou;
		var str = "转换技，①游戏开始时，你可以转换此技能状态；②每回合每项各限一次，当你得到其他角色的牌后，或其他角色得到你的牌后：";
		if (!storage) str += '<span class="bluetext">';
		str += "阳，你可以令该角色使用至多X张【杀】，且其每以此法造成1点伤害，其回复1点体力；";
		if (!storage) str += "</span>";
		if (storage) str += '<span class="bluetext">';
		str += "阴，你可令该角色打出至多X张【杀】，然后其失去Y点体力。";
		if (storage) str += "</span>";
		str += "（X为你的体力上限，Y为X-其打出【杀】数）";
		return str;
	},
	dcsbyingmou(player) {
		var storage = player.storage.dcsbyingmou;
		var str = "转换技，①游戏开始时，你可以转换此技能状态；②每回合限一次，你对其他角色使用牌后，你可以选择其中一名目标角色：";
		if (!storage) str += '<span class="bluetext">';
		str += "阳，你将手牌数摸至与其相同（至多摸五张），然后视为对其使用一张【火攻】；";
		if (!storage) str += "</span>";
		if (storage) str += '<span class="bluetext">';
		str += "阴，令一名手牌数为全场最大的角色对其使用手牌中所有的【杀】和伤害类锦囊牌（若其没有可使用的牌则将手牌数弃至与你相同）。";
		if (storage) str += "</span>";
		return str;
	},
	dcsbquanmou(player) {
		if (player.storage.dcsbquanmou) return '转换技。①游戏开始时，你可以转换此技能状态；②出牌阶段每名角色限一次，你可以令一名攻击范围内的其他角色交给你一张牌。阳：当你于本阶段内下次对其造成伤害时，取消之；<span class="bluetext">阴：当你于本阶段内下次对其造成伤害后，你可以选择除其外的至多三名其他角色，对这些角色依次造成1点伤害。</span>';
		return '转换技。①游戏开始时，你可以转换此技能状态；②出牌阶段每名角色限一次，你可以令一名攻击范围内的其他角色交给你一张牌。<span class="bluetext">阳：当你于本阶段内下次对其造成伤害时，取消之；</span>阴：当你于本阶段内下次对其造成伤害后，你可以选择除其外的至多三名其他角色，对这些角色依次造成1点伤害。';
	},
	dcshouzhi(player) {
		let skillName = "dcshouzhi";
		if (player.storage.dcshouzhi_modified) skillName += "_modified";
		return lib.translate[`${skillName}_info`];
	},
	dcsbfumou(player) {
		const storage = player.storage.dcsbfumou;
		var str = "转换技，①游戏开始时，你可以转换此技能状态；②出牌阶段限一次，你可以观看一名其他角色A的手牌并展示其至多一半手牌：";
		if (!storage) str += '<span class="bluetext">';
		str += "阳，并将这些牌交给另一名其他角色B，然后你与A各摸X张牌（X为A以此法失去的手牌数）；";
		if (!storage) str += "</span>";
		if (storage) str += '<span class="bluetext">';
		str += "阴，令A依次使用这些牌中所有其可以使用的牌（无距离限制且不可被响应）。";
		if (storage) str += "</span>";
		return str;
	},
};
export default dynamicTranslates;
