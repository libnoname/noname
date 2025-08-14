import { lib, get } from "../../noname.js";
export class Audio {
	static #audioCache = {};
	static skill({ skill, player, info, args }) {
		if (skill == void 0) {
			throw new ReferenceError(`skill is not defined`);
		}
		const formatedPlayer = player != void 0 ? this.formatPlayer(player) : void 0;
		let formatedInfo;
		if (info != void 0 && (typeof info !== "object" || Array.isArray(info))) {
			formatedInfo = { audio: info };
		} else {
			formatedInfo = info;
		}
		return new Audio(new SkillAudio(skill, formatedPlayer, formatedInfo), args);
	}
	static die({ player, info, args }) {
		if (player == void 0) {
			throw new ReferenceError(`player is not defined`);
		}
		let formatedInfo;
		if (info != void 0 && (typeof info !== "object" || Array.isArray(info))) {
			formatedInfo = { dieAudios: info };
		} else {
			formatedInfo = info;
		}
		return new Audio(new DieAudio(this.formatPlayer(player), formatedInfo), args);
	}
	static formatPlayer(player) {
		const formatedPlayer = { name: "", sex: "male", tempname: [], skin: {} };
		if (typeof player === "string") {
			formatedPlayer.name = player;
			const sex = get.character(player).sex;
			if (sex) {
				formatedPlayer.sex = sex;
			}
		} else if (typeof player === "object" && player !== null) {
			({ name: formatedPlayer.name, sex: formatedPlayer.sex, name1: formatedPlayer.name1, name2: formatedPlayer.name2, tempname: formatedPlayer.tempname = [], skin: formatedPlayer.skin = {} } = player);
		}
		return formatedPlayer;
	}
	static toFile(list) {
		return list.map(data => data.file);
	}
	static toText(list) {
		return list.map(data => data.text).filter(text => text != void 0);
	}
	#Audio;
	get name() {
		return this.#Audio.name;
	}
	get type() {
		return this.#Audio.type;
	}
	#history = [];
	#audioInfo;
	#audioList;
	get audioList() {
		this.initAudioList();
		return JSON.parse(JSON.stringify(this.#audioList));
	}
	get fileList() {
		return Audio.toFile(this.audioList);
	}
	get textList() {
		return Audio.toText(this.audioList);
	}
	initAudioList() {
		if (this.#audioList) {
			return;
		}
		if (!this.#Audio.useCache) {
			this.#audioList = this.parseAudio(this.name, this.#audioInfo);
			return;
		}
		const key = this.#Audio.getCacheKey();
		const result = Audio.#audioCache[key];
		if (result != void 0) {
			this.#audioList = JSON.parse(JSON.stringify(result));
		} else {
			const result = this.parseAudio(this.name, this.#audioInfo);
			Audio.#audioCache[key] = result;
			this.#audioList = JSON.parse(JSON.stringify(result));
		}
	}
	constructor(audio, args, history = []) {
		this.#history = history.slice();
		this.#Audio = audio;
		const useDefaultInfo = !this.checkHistory();
		this.#audioInfo = this.#Audio.getAudioInfo(useDefaultInfo, args);
	}
	getReferenceAudio(name, info) {
		const audio = this.#Audio.getReferenceAudio(name, info);
		return new Audio(audio, void 0, this.#history).audioList;
	}
	checkHistory() {
		if (!this.#Audio.useCache) {
			return true;
		}
		if (!this.#history.includes(this.#Audio.name)) {
			this.#history.unshift(this.#Audio.name);
			return true;
		}
		if (this.#history[0] === this.#Audio.name) {
			return false;
		}
		throw new RangeError(`${this.#Audio.name} in ${this.#history} forms a infinite recursion`);
	}
	parseAudio(name, audioInfo) {
		if (Array.isArray(audioInfo)) {
			if (this.type === "skill") {
				if (audioInfo.length === 2 && typeof audioInfo[0] === "string" && typeof audioInfo[1] === "number") {
					const [newName, number] = audioInfo;
					if (this.#Audio.isExist(newName)) {
						return this.getReferenceAudio(newName).slice(0, number);
					}
					return this.getReferenceAudio(newName, number);
				}
			}
			const map = {};
			audioInfo.forEach(info => {
				this.parseAudio(name, info).forEach(i => (map[i.name] = i));
			});
			return Object.values(map);
		}
		if (audioInfo === null) {
			return [];
		}
		let audioInfoString = String(audioInfo);
		if (audioInfoString === "false") {
			return [];
		}
		if (["data:", "blob:"].some(prefix => audioInfoString.startsWith(prefix))) {
			return [this.#Audio.textMap("", "", audioInfoString)];
		}
		const list = audioInfoString.match(/(?:(.*):|^)(true|\d+)(?::(.*)|$)/);
		if (list) {
			let [, path, audioNum, ext] = list;
			if (path == void 0) {
				path = this.#Audio.defaultPath;
			} else {
				path = path + "/";
			}
			if (ext == void 0) {
				ext = ".mp3";
			} else {
				ext = "." + ext;
			}
			if (audioNum === "true") {
				return [this.#Audio.textMapWithIndex(path, ext)];
			}
			const audioList = [];
			for (let i = 1; i <= parseInt(audioNum); i++) {
				audioList.push(this.#Audio.textMapWithIndex(path, ext, i));
			}
			return audioList;
		}
		let path = this.#Audio.defaultPath;
		const pathIndex = audioInfoString.lastIndexOf("/");
		if (pathIndex !== -1) {
			path = audioInfoString.slice(0, pathIndex + 1);
			audioInfoString = audioInfoString.slice(pathIndex + 1);
		}
		let ext = ".mp3";
		const extIndex = audioInfoString.lastIndexOf(".");
		if (extIndex !== -1) {
			ext = audioInfoString.slice(extIndex);
			audioInfoString = audioInfoString.slice(0, extIndex);
		}
		if (pathIndex === -1 && extIndex === -1) {
			return this.getReferenceAudio(audioInfoString);
		}
		return [this.#Audio.textMap(path, ext, audioInfoString)];
	}
}
class SkillAudio {
	type = "skill";
	defaultPath = "skill/";
	defaultInfo = false;
	isExist(name) {
		return !!get.info(name);
	}
	name;
	info;
	player;
	audioname = [];
	filteredAudioName;
	filteredAudioName2;
	filteredLogAudio2;
	useCache = true;
	getCacheKey() {
		if (!this.useCache) {
			throw new ReferenceError("Cannot get cache key when not using cache.");
		}
		const result = {
			type: this.type,
			name: this.name,
			filteredAudioName: this.filteredAudioName || void 0,
			player: this.filteredAudioName2 != void 0 ? this.player : void 0,
		};
		return JSON.stringify(result);
	}
	constructor(name, player, info, audioname) {
		this.name = name;
		if (info != void 0) {
			this.info = info;
			this.useCache = false;
		} else if (this.isExist(this.name)) {
			this.info = get.info(this.name);
		} else {
			console.error(new ReferenceError(`Cannot find ${this.name} when parsing ${this.type} audio.`));
			this.info = {};
		}
		this.player = player;
		if (this.player) {
			const rawName = this.player.name;
			const skinName = this.player.skin.name;
			if (skinName && lib.characterSubstitute[rawName]?.find(i => i[0] === skinName)) {
				const skin = lib.characterSubstitute[rawName].find(i => i[0] === skinName);
				const tempCharacter = get.convertedCharacter(["", "", 0, [], skin[1]]);
				// 如果配置的皮肤设置了tempname，会进行覆盖
				if (tempCharacter.tempname.length) {
					this.player.tempname = tempCharacter.tempname;
				}
			}
		}
		if (!audioname) {
			this.audioname = [];
		} else {
			this.audioname = audioname.slice();
		}
		if (Array.isArray(this.info.audioname)) {
			this.audioname.addArray(this.info.audioname);
		}
		this.filteredAudioName = this.getName(i => this.audioname.includes(i));
		if (this.info.logAudio2) {
			const key = this.getName(name => !!this.info.logAudio2?.[name]);
			const logAudio2 = this.info.logAudio2[key];
			if (logAudio2 != void 0) {
				this.filteredLogAudio2 = logAudio2;
				this.useCache = false;
			}
		}
		if (this.info.audioname2) {
			const key = this.getName(name => !!this.info.audioname2?.[name]);
			const audioname2 = this.info.audioname2[key];
			if (audioname2 != void 0) {
				this.filteredAudioName2 = audioname2;
			}
		}
		if (this.info.logAudio) {
			this.useCache = false;
		}
	}
	getAudioInfo(useDefaultInfo, args) {
		if (useDefaultInfo) {
			return this.defaultInfo;
		}
		if (this.filteredLogAudio2 && args) {
			return this.filteredLogAudio2(...args);
		} else if (this.filteredAudioName2 != void 0) {
			return this.filteredAudioName2;
		} else if (this.info.logAudio && args) {
			const result = this.info.logAudio(...args);
			if (typeof result === "number" && typeof this.info.audio === "string") {
				return Array.from({ length: result }, (_, i) => `${this.info.audio}${i + 1}.mp3`);
			}
			return result;
		} else if (this.info.audio != void 0) {
			return this.info.audio;
		}
		return this.defaultInfo;
	}
	getReferenceAudio(name, info) {
		return new SkillAudio(name, this.player, info != void 0 ? { audio: info } : void 0, this.audioname);
	}
	getName(filter) {
		if (!this.player) {
			return "";
		}
		const tempname = this.player.tempname.find(i => filter(i));
		if (tempname) {
			return tempname;
		}
		for (const name of [this.player.name, this.player.name1, this.player.name2]) {
			if (!name) {
				continue;
			}
			if (filter(name)) {
				return name;
			}
			const tempname2 = get.character(name).tempname.find(i => filter(i));
			if (tempname2) {
				return tempname2;
			}
		}
		return "";
	}
	textMap(path, ext, name) {
		const translatedPath = path.startsWith(this.defaultPath) ? path.slice(this.defaultPath.length) : path;
		return {
			name: translatedPath + name,
			file: path + name + ext,
			text: lib.translate[`#${translatedPath}${name}`],
			type: "skill",
		};
	}
	textMapWithIndex(path, ext, index) {
		let name = this.name;
		if (this.filteredAudioName) {
			name += "_" + this.filteredAudioName;
		}
		if (typeof index === "number") {
			name += index;
		}
		return this.textMap(path, ext, name);
	}
}
class DieAudio {
	type = "die";
	defaultPath = "die/";
	defaultInfo = true;
	isExist(name) {
		return !get.character(name).isNull;
	}
	player;
	name;
	info;
	useCache = true;
	getCacheKey() {
		if (!this.useCache) {
			throw new ReferenceError("Cannot get cache key when not using cache.");
		}
		const result = {
			type: this.type,
			name: this.name,
			skin: this.name !== this.player.name ? this.player.skin : void 0,
		};
		return JSON.stringify(result);
	}
	constructor(player, info) {
		this.player = player;
		if (info != void 0) {
			this.useCache = false;
			this.name = player.name;
			this.info = info;
		} else {
			const useDefaultInfo = () => {
				this.name = player.name;
				if (this.isExist(this.name)) {
					this.info = get.character(this.name);
				} else {
					console.error(new ReferenceError(`Cannot find ${this.name} when parsing ${this.type} audio.`));
					this.info = {};
				}
			};
			const rawName = player.name;
			const skinName = player.skin.name;
			if (!skinName || skinName === rawName) {
				useDefaultInfo();
			} else if (!lib.characterSubstitute[rawName]) {
				useDefaultInfo();
			} else {
				const skin = lib.characterSubstitute[rawName].find(i => i[0] === skinName);
				if (!skin) {
					useDefaultInfo();
				} else {
					this.name = skinName;
					this.info = get.convertedCharacter(["", "", 0, [], skin[1]]);
				}
			}
		}
	}
	getAudioInfo(useDefaultInfo, args) {
		if (useDefaultInfo) {
			return this.defaultInfo;
		}
		const audioInfo = this.info.dieAudios;
		if (audioInfo == void 0) {
			return this.defaultInfo;
		}
		if (Array.isArray(audioInfo) && audioInfo.length === 0) {
			return this.defaultInfo;
		}
		return audioInfo;
	}
	getReferenceAudio(name, info) {
		return new DieAudio(Audio.formatPlayer(name), info != void 0 ? { dieAudios: info } : void 0);
	}
	textMap(path, ext, name) {
		const translatedPath = path.startsWith(this.defaultPath) ? path.slice(this.defaultPath.length) : path;
		return {
			name: translatedPath + name,
			file: path + name + ext,
			text: lib.translate[`#${translatedPath}${name}:die`],
			type: "die",
		};
	}
	textMapWithIndex(path, ext, index) {
		let name = this.name;
		if (typeof index === "number") {
			name += index;
		}
		return this.textMap(path, ext, name);
	}
}
