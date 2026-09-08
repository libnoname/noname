import { lib, game, ui, get, ai, _status } from "noname";

Object.assign(get.is, {
	mjsStrengthenedCard(card, player) {
		if (!card) {
	      	return false;
	    }
	    return card?.storage?.mjsstrengthen;
	},
	mjsWeakenedCard(card, player) {
		if (!card) {
	      	return false;
	    }
	    if (player) {
	    	if (player.hasSkillTag("unweakened", card)) {
	    		return false;
	    	}
	    }
	    return card?.storage?.mjsweaken;
	},
});
Object.assign(game, {
	showCardsOnPlayer(list) {
		for (const info of list) {
			const [target, cards] = info;
			if (!cards.length) {
				continue;
			}
			target.$chooseToShowCardsOL(cards);
		}
	},
	hideCardsFromPlayer(targets) {
		for (const target of targets) {
			target.$chooseToHideCardsOL();
		}
	},
});

if (lib.config["extension_名将杀_UI"]) {
	lib.init.css(lib.assetURL + "extension/名将杀/src/css", "group");
	
	lib.hooks.addGroup.push(function addGroupCSS(id, short, name, config) {
		if (typeof config.color != "undefined" && config.color != null) {
			let color1, color2, color3, color4;
			if (typeof config.color == "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.color)) {
				let c1 = parseInt(`0x${config.color.slice(1, 3)}`);
				let c2 = parseInt(`0x${config.color.slice(3, 5)}`);
				let c3 = parseInt(`0x${config.color.slice(5, 7)}`);
				color1 = color2 = color3 = color4 = [c1, c2, c3, 1];
			}
			else if (Array.isArray(config.color) && config.color.length == 4) {
				if (config.color.every(item => Array.isArray(item))) {
					color1 = config.color[0];
					color2 = config.color[1];
					color3 = config.color[2];
					color4 = config.color[3];
				}
				else color1 = color2 = color3 = color4 = config.color;
			}
			if (color1 && color2 && color3 && color4) {
				lib.init.sheet(`.player > .group[data-nature="${id}"] {
                    background: linear-gradient(
                        to bottom,
                        rgba(${color1.join(", ")}),
                        rgba(${color2.join(", ")}),
                        rgba(${color3.join(", ")}),
                        rgba(${color4.join(", ")})
                    );
                }`);
			}
		}
	});
	const changeGroup = player => {
		var group = player.group;
		if (player.name == "unknown") {
			group = "unknown";
		}
		game.broadcast(
			(player, group) => {
				if (!player.node?.group) {
					player.node.group = ui.create.div(".group", player.node.avater);
					player.appendChild(player.node.group);
				}
				player.node.group.dataset.nature = group;
				if (group == "g_noname" || !player.group2) {
					player.node.group.innerHTML = `<span>${get.translation(group)}</span>`;
				} else {
					player.node.group.innerHTML = `<span>${get.translation(group)}</span><span class="group2">${(player.group2 ? `${get.translation(player.group2)}` : "")}</span>`;
				}
				player.node.group.show();
			},
			player,
			group
		);
		if (!player.node?.group) {
			player.node.group = ui.create.div(".group", player.node.avater);
			player.appendChild(player.node.group);
		}
		player.node.group.dataset.nature = group;
		if (group == "g_noname" || !player.group2) {
			player.node.group.innerHTML = `<span>${get.translation(group)}</span>`;
		} else {
			player.node.group.innerHTML = `<span>${get.translation(group)}</span><span class="group2">${(player.group2 ? `${get.translation(player.group2)}` : "")}</span>`;
		}
		player.node.group.show();
		return player;
	};
	lib.element.player.updates = []
		.concat(lib.element.player.updates || [])
		.concat(player => {
			changeGroup(player);
			//player.node.group.innerHTML = get.translation(group) + (player.group2 ? `<br>/<br>${get.translation(player.group2)}` : "");
			//player.node.group.innerHTML = get.translation(group);
			//player.node.group.style.cssText = `background-image:url(${lib.assetURL}extension/名将杀/image/group/${group}.png) !important`;
		});
	lib.element.player.inits = []
		.concat(lib.element.player.inits || [])
		.concat(player => {
			changeGroup(player);
			//player.node.group.innerHTML = get.translation(group);
			//player.node.group.style.cssText = `background-image:url(${lib.assetURL}extension/名将杀/image/group/${group}.png) !important`;
		});
	lib.skill._mjs_changeGroup_update = {
		trigger: {
			player: "changeGroupEnd",
		},
		popup: false,
		forced: true,
		firstDo: true,
		charlotte: true,
		async content(event, trigger, player) {
			changeGroup(player);
		},
	};

	const original_player_$uninit = lib.element.player.$uninit;
    lib.element.player.$uninit = function() {
    	game.broadcast(
			(player) => {
				player.node?.group?.hide();
			},
			this
		);
        this.node?.group?.hide();
        return original_player_$uninit.apply(this, arguments);
    };
}

if (lib.config["extension_名将杀_shaNature"]) {
	_status._mjs_shaNature = true;
	/*lib.skill._mjs_shaNature = {
		ruleSkill: true,
		charlotte: true,
		mod: {
			cardnature(card, player) {
				if (!player.hasMJSEquip()) return;
				if (card.name != "sha" || card.nature) return;
				if (card.suit == "heart") {
					return "fire";
				}
				if (card.suit == "diamond" && card.number == 4) {
					return "thunder";
				}
			},
		},
	};*/
}
