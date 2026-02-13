import { lib, game, ui, get, ai, _status } from "noname";

export const type = "extension";

export default function () {
	return {
		name: "{{EXTENSION_NAME}}",
		editable: false,
		connect: false,
		content: function (config, pack) {},
		precontent: function () {},
		config: {},
		help: {},
		package: {
			character: {
				character: {},
				translate: {},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: {
				skill: {},
				translate: {},
			},
			intro: "",
			author: "{{AUTHOR}}",
			diskURL: "",
			forumURL: "",
			version: "1.0",
		},
		files: { character: [], card: [], skill: [], audio: [] },
	};
}
