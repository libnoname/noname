import { lib, game, ui, get, ai, _status } from "noname";

game.import("play", function () {
	return {
		name: "cardpile",
		arenaReady() {
			const data = {
				total: 160,
				sha: {
					diamond: 6,
					club: 14,
					heart: 3,
					spade: 7,
				},
				huosha: {
					diamond: 2,
					heart: 3,
				},
				leisha: {
					spade: 5,
					club: 4,
				},
				shan: {
					heart: 6,
					diamond: 18,
				},
				jiu: {
					diamond: 1,
					spade: 2,
					club: 2,
				},
				tao: {
					heart: 9,
					diamond: 3,
				},
				wanjian: {
					heart: 1,
				},
				nanman: {
					spade: 2,
					club: 1,
				},
				guohe: {
					spade: 3,
					club: 2,
					heart: 1,
				},
				shunshou: {
					spade: 3,
					diamond: 2,
				},
				wuxie: {
					heart: 2,
					diamond: 1,
					spade: 2,
					club: 2,
				},
				tiesuo: {
					spade: 2,
					club: 4,
				},
			};
			const rand = function () {
				return Math.ceil(Math.random() * 13);
			};
			const getn = function (i, j) {
				return Math.round(data[i][j] * parseFloat(lib.config[`cardpile_${i}_playpackconfig`]));
			};
			let num = 0;
			for (const i in data) {
				for (const j in data[i]) {
					num += getn(i, j);
				}
			}
			let dn = (num * (lib.card.list.length - data.total)) / (data.total - num);
			if (dn > 1000) {
				dn = 1000;
			}
			if (dn > 0) {
				for (const i in data) {
					for (const j in data[i]) {
						let n = Math.round((dn * getn(i, j)) / num);
						while (n--) {
							switch(i) {
								case "huosha":
									lib.card.list.push([j, rand(), "sha", "fire"]);
									break;
								case "leisha":
									lib.card.list.push([j, rand(), "sha", "thunder"]);
									break;
								default:
									lib.card.list.push([j, rand(), i]);
							}
						}
					}
				}
			}
		},
	};
});