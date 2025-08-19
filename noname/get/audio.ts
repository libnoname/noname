import { lib, get } from "../../noname.js";

type logAudio = (...args: any[]) => AudioInfo;
type AudioInfo = AudioInfo[] | string | number | boolean;
type SkillInfo = {
	audio?: AudioInfo;
	audioname?: string[];
	audioname2?: { [playerName: string]: AudioInfo };
	logAudio?: logAudio;
	logAudio2?: { [playerName: string]: logAudio };
};
type FormatedPlayer = {
	name: string;
	sex: Sex;
	name1?: string;
	name2?: string;
	tempname: string[];
	skin: { name?: string };
};
type TextMap = {
	name: string;
	file: string;
	text: string | undefined;
	type: string;
};

export class Audio {
	static #audioCache: SMap<TextMap[]> = {};

	/**
	 * 根据skill中的audio,audioname,audioname2和player来获取技能台词列表及其对应的源文件名
	 * @param skill 技能名
	 * @param player 角色/角色名
	 * @param info 使用指定的skillInfo/audioInfo
	 * @param args
	 */
	static skill({ skill, player, info, args }: { skill: string; player: Player | string; info?: AudioInfo | SkillInfo; args?: any[] }): Audio {
		if (skill == void 0) {
			throw new ReferenceError(`skill is not defined`);
		}

		const formatedPlayer = player != void 0 ? this.formatPlayer(player) : void 0;

		let formatedInfo: SkillInfo | undefined;
		if (info != void 0 && (typeof info !== "object" || Array.isArray(info))) {
			formatedInfo = { audio: info };
		} else {
			formatedInfo = info;
		}

		return new Audio(new SkillAudio(skill, formatedPlayer, formatedInfo), args);
	}

	/**
	 * 获取角色死亡时能播放的所有阵亡台词列表及其对应的源文件名
	 * @param player 角色/角色名
	 * @param info 使用指定的audioInfo
	 * @param args
	 */
	static die({ player, info, args }: { player: Player | string; info?: AudioInfo; args?: any[] }): Audio {
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

	static formatPlayer(player: Player | string): FormatedPlayer {
		const formatedPlayer: FormatedPlayer = { name: "", sex: "male", tempname: [], skin: {} };
		if (typeof player === "string") {
			formatedPlayer.name = player;
			const sex = get.character(player).sex;
			if (sex) {
				formatedPlayer.sex = sex;
			}
		}
		else if (typeof player === "object" && player !== null) {
			({
				name: formatedPlayer.name,
				// @ts-expect-error ignore
				sex: formatedPlayer.sex,
				name1: formatedPlayer.name1,
				name2: formatedPlayer.name2,
				tempname: formatedPlayer.tempname = [],
				skin: formatedPlayer.skin = {},
			} = player);
		}

		return formatedPlayer;
	}

	static toFile(list: TextMap[]): string[] {
		return list.map(data => data.file);
	}

	static toText(list: TextMap[]): string[] {
		return list.map(data => data.text).filter(text => text != void 0);
	}

	#Audio: AudioBase;

	get name() {
		return this.#Audio.name;
	}
	get type() {
		return this.#Audio.type;
	}

	#history: string[] = [];

	#audioInfo: AudioInfo;
	#audioList: TextMap[];
	get audioList(): TextMap[] {
		this.initAudioList();
		return JSON.parse(JSON.stringify(this.#audioList));
	}
	get fileList(): string[] {
		return Audio.toFile(this.audioList);
	}
	get textList(): string[] {
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

	constructor(audio: AudioBase, args?: any[], history: string[] = []) {
		this.#history = history.slice();
		this.#Audio = audio;
		const useDefaultInfo = !this.checkHistory();
		this.#audioInfo = this.#Audio.getAudioInfo(useDefaultInfo, args);
	}
	getReferenceAudio(name: string, info?: any): TextMap[] {
		const audio = this.#Audio.getReferenceAudio(name, info);
		return new Audio(audio, void 0, this.#history).audioList;
	}
	checkHistory(): boolean {
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
		//deadlock
		throw new RangeError(`${this.#Audio.name} in ${this.#history} forms a infinite recursion`);
	}
	parseAudio(name: string, audioInfo: AudioInfo): TextMap[] {
		if (Array.isArray(audioInfo)) {
			//skill的屎山(不应该耦合但是没办法，悲)
			if (this.type === "skill") {
				if (audioInfo.length === 2 && typeof audioInfo[0] === "string" && typeof audioInfo[1] === "number") {
					const [newName, number] = audioInfo;
					if (this.#Audio.isExist(newName)) {
						return this.getReferenceAudio(newName).slice(0, number);
					}
					return this.getReferenceAudio(newName, number);
				}
			}

			const map: { [name: string]: TextMap } = {};
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

		const list = audioInfoString.match(/(?:(.*):|^)(true|\d+)(?::(.*)|$)/); // [path, number|true, ext]
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
			const audioList: TextMap[] = [];
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

interface AudioBase {
	type: string;
	name: string;
	isExist: (name: string) => boolean;
	defaultPath: string;
	defaultInfo: AudioInfo;
	useCache: boolean;
	getCacheKey: () => string;
	getAudioInfo: (useDefaultInfo: boolean, args?: any[]) => AudioInfo;
	getReferenceAudio: (name: string, info?: AudioInfo) => AudioBase;
	textMap: (path: string, ext: string, name: string) => TextMap;
	textMapWithIndex: (path: string, ext: string, index?: number) => TextMap;
}

class SkillAudio implements AudioBase {
	type = "skill";
	defaultPath = "skill/";
	defaultInfo: AudioInfo = false;
	isExist(name: string): boolean {
		return !!get.info(name);
	}

	name: string;
	info: SkillInfo;
	player?: FormatedPlayer;
	audioname: string[] = [];
	filteredAudioName: string;
	filteredAudioName2: AudioInfo;
	filteredLogAudio2: logAudio;

	useCache = true;
	getCacheKey(): string {
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

	constructor(name: string, player?: FormatedPlayer, info?: SkillInfo, audioname?: string[]) {
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

	getAudioInfo(useDefaultInfo: boolean, args?: any[]): AudioInfo {
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
	getReferenceAudio(name: string, info?: AudioInfo): SkillAudio {
		return new SkillAudio(name, this.player, info != void 0 ? { audio: info } : void 0, this.audioname);
	}
	getName(filter: (name: string) => boolean): string {
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
			const tempname = get.character(name).tempname.find(i => filter(i));
			if (tempname) {
				return tempname;
			}
		}
		return "";
	}
	textMap(path: string, ext: string, name: string): TextMap {
		const translatedPath = path.startsWith(this.defaultPath) ? path.slice(this.defaultPath.length) : path;
		return {
			name: translatedPath + name,
			file: path + name + ext,
			text: lib.translate[`#${translatedPath}${name}`],
			type: "skill",
		};
	}
	textMapWithIndex(path: string, ext: string, index?: number): TextMap {
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

class DieAudio implements AudioBase {
	type = "die";
	defaultPath = "die/";
	defaultInfo: AudioInfo = true;
	isExist(name: string): boolean {
		return !get.character(name).isNull;
	}

	player: FormatedPlayer;
	name: string;
	info: any;

	useCache = true;
	getCacheKey(): string {
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

	constructor(player: FormatedPlayer, info?: any) {
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

	getAudioInfo(useDefaultInfo: boolean, args?: any[]): AudioInfo {
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
	getReferenceAudio(name: string, info?: AudioInfo): DieAudio {
		return new DieAudio(Audio.formatPlayer(name), info != void 0 ? { dieAudios: info } : void 0);
	}
	textMap(path: string, ext: string, name: string): TextMap {
		const translatedPath = path.startsWith(this.defaultPath) ? path.slice(this.defaultPath.length) : path;
		return {
			name: translatedPath + name,
			file: path + name + ext,
			text: lib.translate[`#${translatedPath}${name}:die`],
			type: "die",
		};
	}
	textMapWithIndex(path: string, ext: string, index?: number): TextMap {
		let name = this.name;
		if (typeof index === "number") {
			name += index;
		}
		return this.textMap(path, ext, name);
	}
}
