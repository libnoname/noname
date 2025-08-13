import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
	sizhaojian: {
		derivation: "ol_sb_yuanshao",
		cardcolor: "diamond",
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		/*get destroy() {
			return !lib.card.sizhaojian.inShanShanFestival();
		},*/
		onLose() {
			if (!lib.card.sizhaojian.inShanShanFestival() && (!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
				cards.forEach(card => {
					card.fix();
					card.remove();
					card.destroyed = true;
					game.log(card, "被销毁了");
				});
			}
		},
		inShanShanFestival() {
			//闪闪节外离开装备区会销毁
			const date = new Date();
			return date.getMonth() + 1 == 3 && date.getDate() >= 2 && date.getDate() <= 15;
		},
		distance: { attackFrom: -1 },
		ai: { basic: { equipValue: 7 } },
		skills: ["sizhaojian_skill"],
	},
};
export default cards;
