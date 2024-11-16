import { lib } from "../library/index.js";
import { get } from "./index.js";

/**
 * @typedef { (string | number | boolean)[] | string | number | boolean } AudioInfo
 * @typedef { {
 *  audio: AudioInfo,
 *  audioname?: string[],
 *  audioname2?: { [playerName: string]: AudioInfo }
 * } } SkillInfo
 * @typedef { {
 *  name: string,
 *  sex:Sex,
 *  name1?: string,
 *  name2?: string,
 *  tempname: string[]
 *  skin: { name?:string }
 * } } FormatedPlayer
 * @typedef { {
 *  name: string,
 *  file: string,
 *  text: string | undefined,
 *  type: string,
 * } } TextMap
 */

export class Audio {
    /**
     * @type { { [key: string]: TextMap[] } }
     */
    static #audioCache = {};

    /**
     * 根据skill中的audio,audioname,audioname2和player来获取技能台词列表及其对应的源文件名
     * @param { object } options
     * @param { string } options.skill 技能名
     * @param { Player | string } [options.player] 角色/角色名
     * @param { AudioInfo | SkillInfo } [options.info] 使用指定的skillInfo/audioInfo
     * @returns { Audio }
     */
    static skill({ skill, player, info }) {
        if (skill == void 0) throw new ReferenceError(`skill is not defined`);

        const formatedPlayer = player != void 0 ? this.formatPlayer(player) : void 0;
        let formatedInfo;
        if (info != void 0 && (typeof info !== "object" || Array.isArray(info))) formatedInfo = { audio: info };
        else formatedInfo = info;
        return new Audio(new SkillAudio(skill, formatedPlayer, formatedInfo));
    }

    /**
     * 获取角色死亡时能播放的所有阵亡台词列表及其对应的源文件名
     * @param { object } options
     * @param { Player | string } options.player 角色/角色名
     * @param { AudioInfo } [options.info] 使用指定的audioInfo
     * @returns { Audio } 
     */
    static die({ player, info }) {
        if (player == void 0) throw new ReferenceError(`player is not defined`);

        let formatedInfo;
        if (info != void 0 && (typeof info !== "object" || Array.isArray(info))) formatedInfo = { dieAudios: info };

        return new Audio(new DieAudio(this.formatPlayer(player), formatedInfo));
    }

    /**
     * @param { Player | string } player 
     * @returns { FormatedPlayer }
     */
    static formatPlayer(player) {
        /**
         * @type { FormatedPlayer }
         */
        const formatedPlayer = { name: "", sex: "male", tempname: [], skin: {} };
        if (typeof player === "string") {
            formatedPlayer.name = player;
            const sex = get.character(player).sex;
            if (sex) formatedPlayer.sex = sex;
        }
        //@ts-ignore
        else if (typeof player === "object" && player !== null) {
            ({
                name: formatedPlayer.name,
                //@ts-ignore
                sex: formatedPlayer.sex,
                name1: formatedPlayer.name1,
                name2: formatedPlayer.name2,
                tempname: formatedPlayer.tempname = [],
                skin: formatedPlayer.skin = {},
            } = player);
        }


        return formatedPlayer;
    }

    /**
     * @param {TextMap[]} list
     * @returns {string[]}
     */
    static toFile(list) {
        return list.map(data => data.file);
    }

    /**
     * @param {TextMap[]} list
     * @returns {string[]}
     */
    static toText(list) {
        return list.map(data => data.text).filter(text => text != void 0);
    }



    /**
     * @type {AudioBase}
     */
    #Audio;

    get name() {
        return this.#Audio.name;
    }
    
    get type() {
        return this.#Audio.type;
    }
    /**
     * @type { string[] }
     */
    #history = [];
    /**
     * @type { AudioInfo }
     */
    #audioInfo;
    /**
     * @type { TextMap[] }
     */
    #audioList;
    /**
     * @type { TextMap[] }
     */
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
        if (this.#audioList) return;
        if (!this.#Audio.useCache) {
            this.#audioList = this.parseAudio(this.name, this.#audioInfo);
            return;
        }
        const key = this.#Audio.getCacheKey();
        const result = Audio.#audioCache[key];
        if (result != void 0) this.#audioList = JSON.parse(JSON.stringify(result));
        else {
            const result = this.parseAudio(this.name, this.#audioInfo);
            Audio.#audioCache[key] = result;
            this.#audioList = JSON.parse(JSON.stringify(result));
        }
    }
    /**
     * @param {AudioBase} audio 
     * @param {string[]} history 
     */
    constructor(audio, history = []) {
        this.#history = history.slice();
        this.#Audio = audio;
        const isExist = this.checkHistory();
        if (isExist) this.#history.unshift(this.#Audio.name);
        this.#audioInfo = isExist ? this.#Audio.getAudioInfo() : this.#Audio.defaultInfo;
    }
    getAudio(name, info) {
        const audio = this.#Audio.getAudio(name, info);
        return new Audio(audio, this.#history).audioList;
    }
    checkHistory() {
        if (!this.#Audio.useCache) return false;
        if (!this.#history.includes(this.#Audio.name)) return true;
        if (this.#history[0] === this.#Audio.name) return false;
        //deadlock
        throw new RangeError(`${this.#Audio.name} in ${this.#history} forms a infinite recursion`);
    }
    /**
     * @param {string} name 
     * @param {AudioInfo} audioInfo
     * @returns {TextMap[]}
     */
    parseAudio(name, audioInfo) {
        if (Array.isArray(audioInfo)) {
            if (this.type === "skill") {//skill的屎山(不应该耦合但是没办法，悲)
                if (audioInfo.length === 2 && typeof audioInfo[0] === "string" && typeof audioInfo[1] === "number") {
                    const [newName, number] = audioInfo;
                    if (this.#Audio.isExist(newName)) return this.getAudio(newName).slice(0, number);
                    return this.getAudio(newName, number);
                }
            }
            const map = {};
            audioInfo.forEach(info => {
                this.parseAudio(name, info).forEach(i => (map[i.name] = i));
            });
            return Object.values(map);
        }

        if (audioInfo === null) return [];

        let audioInfoString = String(audioInfo);

        if (audioInfoString === "false") return [];

        if (["data:", "blob:"].some(prefix => audioInfoString.startsWith(prefix))) {
            return [this.#Audio.textMap("", "", audioInfoString)];
        }

        const list = audioInfoString.match(/(?:(.*):|^)(true|\d+)(?::(.*)|$)/); // [path, number|true, ext]
        if (list) {
            let [, path, audioNum, ext] = list;
            if (path == void 0) path = this.#Audio.defaultPath;
            else path = path + "/";
            if (ext == void 0) ext = ".mp3";
            else ext = "." + ext;

            if (audioNum === "true") return [this.#Audio.textMapWithIndex(path, ext)];
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

        if (pathIndex === -1 && extIndex === -1) return this.getAudio(audioInfoString);
        return [this.#Audio.textMap(path, ext, audioInfoString)];
    }


}


/**
 * @interface
 */
class AudioBase {
    /**
    * @type { string }
    */
    type;
    /**
    * @type { string }
    */
    name;
    /**
     * @type { (name: string) => boolean }
     */
    isExist;
    /**
     * @type { string }
     */
    defaultPath;
    /**
     * @type { AudioInfo }
     */
    defaultInfo;

    /**
     * @type { boolean }
     */
    useCache;

    /**
     * @type { () => string }
     */
    getCacheKey;
    /**
     * @type { () => AudioInfo }
     */
    getAudioInfo;
    /**
     * @type { (name: string, info?: AudioInfo) => AudioBase }
     */
    getAudio;
    /**
     * @type { ( path: string, ext: string, name: string ) => TextMap }
     */
    textMap;
    /**
     * @type { ( path: string, ext: string, index?: number ) => TextMap }
     */
    textMapWithIndex;
}


/**
 * @implements {AudioBase}
 */
class SkillAudio {
    type = "skill";
    defaultPath = "skill/";
    defaultInfo = [true, 2];
    isExist(name) {
        return !!get.info(name);
    }

    name;
    info;
    /**
     * @type { FormatedPlayer }
     */
    player;
    /**
     * @type { string[] }
     */
    audioname = [];
    /**
     * @type { string }
     */
    filteredAudioName;
    /**
     * @type { AudioInfo }
     */
    filteredAudioName2;

    useCache = true;
    getCacheKey() {
        if (!this.useCache) throw new ReferenceError("Cannot get cache key when not using cache.");
        const result = {
            type: this.type,
            name: this.name,
            filteredAudioName: this.filteredAudioName || void 0,
            player: this.filteredAudioName2 != void 0 ? this.player : void 0
        };
        return JSON.stringify(result);
    }

    constructor(name, player, info, audioname) {
        this.name = name;

        if (info != void 0) {
            this.info = info;
            this.useCache = false;
        }
        else if (this.isExist(this.name)) this.info = get.info(this.name);
        else {
            console.error(new ReferenceError(`Cannot find ${this.name} when parsing ${this.type} audio.`));
            this.info = {};
        }

        this.player = player;

        if (!audioname) this.audioname = [];
        else this.audioname = audioname.slice();
        if (Array.isArray(this.info.audioname)) this.audioname.addArray(this.info.audioname);
        this.filteredAudioName = this.getName(i => this.audioname.includes(i));

        if (this.info.audioname2) {
            const key = this.getName(name => this.info.audioname2 && this.info.audioname2[name]);
            const audioname2 = this.info.audioname2[key];
            if (audioname2 != void 0) this.filteredAudioName2 = audioname2;
        }
    }

    getAudioInfo() {
        if (this.filteredAudioName2 != void 0) return this.filteredAudioName2;
        const audioInfo = this.info.audio;
        if (audioInfo != void 0) return audioInfo;
        return this.defaultInfo;
    }
    getAudio(name, info) {
        return new SkillAudio(name, this.player, info != void 0 ? { audio: info } : void 0, this.audioname);
    }
    getName(filter) {
        if (!this.player) return "";
        const tempname = this.player.tempname.find(i => filter(i));
        if (tempname) return tempname;
        for (const name of [this.player.name, this.player.name1, this.player.name2]) {
            if (!name) continue;
            if (filter(name)) return name;
            const tempname = get.character(name).tempname.find(i => filter(i));
            if (tempname) return tempname;
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
        }
    }
    textMapWithIndex(path, ext, index) {
        let name = this.name;
        if (this.filteredAudioName) name += "_" + this.filteredAudioName;
        if (typeof index === "number") name += index;
        return this.textMap(path, ext, name);
    }
}


/**
 * @implements {AudioBase}
 */
class DieAudio {
    type = "die";
    defaultPath = "die/";
    defaultInfo = true;
    isExist(name) {
        return !get.character(name).isNull;
    }

    /**
     * @type {FormatedPlayer}
     */
    player;
    name;
    info;

    useCache = true;
    getCacheKey() {
        if (!this.useCache) throw new ReferenceError("Cannot get cache key when not using cache.");
        const result = {
            type: this.type,
            name: this.name,
            skin: this.name !== this.player.name ? this.player.skin : void 0
        };
        return JSON.stringify(result);
    }

    constructor(player, info) {
        this.player = player;

        if (info != void 0) {
            this.useCache = false;
            this.name = player.name;
            this.info = info;
        }
        else {
            const useDefaultInfo = () => {
                this.name = player.name;
                if (this.isExist(this.name)) this.info = get.character(this.name);
                else {
                    console.error(new ReferenceError(`Cannot find ${this.name} when parsing ${this.type} audio.`));
                    this.info = {};
                }
            }
            const skinName = player.skin.name;
            if (!skinName || skinName === player.name) useDefaultInfo();
            else if (!lib.characterSubstitute[skinName]) useDefaultInfo();
            else {
                const skin = lib.characterSubstitute[skinName].find(i => i[0] === skinName);
                if (!skin) useDefaultInfo();
                else {
                    this.name = skinName;
                    this.info = get.convertedCharacter(["", "", 0, [], skin[1]]);
                }
            }
        }
    }

    getAudioInfo() {
        const audioInfo = this.info.dieAudios;
        if (audioInfo == void 0) return this.defaultInfo;
        if (Array.isArray(audioInfo) && audioInfo.length === 0) return this.defaultInfo;
        return audioInfo;
    }
    getAudio(name, info) {
        return new DieAudio(Audio.formatPlayer(name), info != void 0 ? { dieAudios: info } : void 0);
    }
    textMap(path, ext, name) {
        const translatedPath = path.startsWith(this.defaultPath) ? path.slice(this.defaultPath.length) : path;
        return {
            name: translatedPath + name,
            file: path + name + ext,
            text: lib.translate[`#${translatedPath}${name}:die`],
            type: "die",
        }
    }
    textMapWithIndex(path, ext, index) {
        let name = this.name;
        if (typeof index === "number") name += index;
        return this.textMap(path, ext, name);
    }
}
