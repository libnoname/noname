window.qyPreContent = function (lib, game, ui, get, ai, _status, config) {
    if (!lib.qyLoading) {
        return console.error("Line: 关键工具未加载！！！");
    }
    if (!lib.characterLiuwei) {
        lib.characterLiuwei = {}
    }

    const qingyaoSkinDirectory = lib.qyUtils.getObjectConfig('qingyao_Skin_Directory', 'skin');

    // 预加载六维编辑器样式，确保 RadarChart 等组件正常显示
    (function preloadLiuweiStyles() {
        const styleId = 'qy_liuwei_style_preload';
        if (document.getElementById(styleId)) return;

        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href = lib.assetURL + 'extension/清瑶葭绮/members/假装无敌/js/skin/modules/characterCard/styles/Liuwei.css';
        document.head.appendChild(link);
    })();

    lib.qySkinShare = {}
    lib.qySkinInfo = {}
    lib.qySkinAudio = {
        // 皮肤文件路径
        get skinConfigPath() {
            // 手杀露头目录
            if (qingyaoSkinDirectory === 'mobile') return `extension/清瑶葭绮/members/假装无敌/gameAsset/image/mobile`
            // 十周年露头目录
            if (qingyaoSkinDirectory === 'decade') return `extension/清瑶葭绮/members/假装无敌/gameAsset/image/decade`
            return `extension/清瑶葭绮/members/假装无敌/gameAsset/image/skin`
        },
        // 语音文件路径
        get audioConfigPath() {
            return 'extension/清瑶葭绮/members/假装无敌/gameAsset/audio/skill'
        },
        // 胜利语音路径
        get audioVictoryPath() {
            return 'extension/清瑶葭绮/members/假装无敌/gameAsset/audio/victory'
        },
        // 原画文件路径呢
        get originConfigPath() {
            return `extension/清瑶葭绮/members/假装无敌/gameAsset/yuanhua`
        },
        get lihuiConfigPath() {
            return `extension/清瑶葭绮/members/假装无敌/gameAsset/lihui`
        },
        /**
         * 保存皮肤六维数据
         * @param {string} characterID 武将ID
         * @param {string} skinName 皮肤名称
         * @param {Object} data 六维数据 { wuli, wuxing, ..., labels }
         */
        saveSkinLiuwei(characterID, skinName, data) {
            if (!characterID || !skinName || !data) return;

            // 提取六维数值和标签
            const { data: liuweiData, labels } = data;
            const saveData = {
                data: { ...liuweiData },
                labels: labels || {}
            };

            this.syncSkinInfoWriteFile(characterID, skinName, { liuwei: saveData });
        },
        /**
         * 获取六维词条（经典形象）
         * @param characterID
         * @return {Object|null} 返回六维数据对象，包含各项属性值和评价
         */
        getLiuwei(characterID) {
            if (!characterID) return null;

            let liuweiData = null;
            let editable = true;

            // 1. 优先检查官方/预设数据 (lib.characterLiuwei)
            if (lib.characterLiuwei && lib.characterLiuwei[characterID]) {
                liuweiData = this._normalizeLiuweiData(lib.characterLiuwei[characterID]);
                editable = false; // 内置数据不可编辑
            }
            // 2. 其次检查 skinInfo 中的 "经典形象"（新格式优先）
            else {
                const skinInfo = this.getSkinInfo(characterID, '经典形象');
                if (skinInfo?.liuwei) {
                    liuweiData = this._normalizeLiuweiData(skinInfo.liuwei);
                } else {
                    // 3. 兼容旧配置 (配置项 characterLiuwei)
                    const customLiuwei = lib.qyUtils.getObjectConfig('characterLiuwei', {});
                    if (customLiuwei[characterID]) {
                        liuweiData = this._normalizeLiuweiData(customLiuwei[characterID]);
                    }
                }
            }

            // 构造返回对象
            const defaultLabels = {
                wuli: '武力',
                wuxing: '悟性',
                lingqiao: '灵巧',
                dingli: '定力',
                rongmao: '容貌',
                qiyun: '气运'
            };
            const labels = { ...defaultLabels, ...(liuweiData?.labels || {}) };
            const sourceData = liuweiData?.data || {};

            const sixDimensions = {
                wuli: Math.min(sourceData.wuli || 0, 100),
                wuxing: Math.min(sourceData.wuxing || 0, 100),
                lingqiao: Math.min(sourceData.lingqiao || 0, 100),
                dingli: Math.min(sourceData.dingli || 0, 100),
                rongmao: Math.min(sourceData.rongmao || 0, 100),
                qiyun: Math.min(sourceData.qiyun || 0, 100)
            };

            // 计算评价
            const evaluation = this.calculateLiuweiEvaluation(sixDimensions);
            const values = Object.values(sixDimensions);
            const totalScore = values.reduce((sum, val) => sum + val, 0);
            const averageScore = Math.round(totalScore / 6);

            return {
                data: sixDimensions,
                labels: labels,
                evaluation: evaluation,
                totalScore: totalScore,
                averageScore: averageScore,
                editable: editable // 返回编辑状态
            };
        },

        /**
         * 规范化六维数据（兼容新旧格式）
         * 旧格式: { wuli: 10, wuxing: 20, labels: {...} }
         * 新格式: { data: { wuli: 10, wuxing: 20 }, labels: {...} }
         * @param {Object} rawData 原始数据
         * @return {Object} 规范化后的数据（统一为新格式）
         * @private
         */
        _normalizeLiuweiData(rawData) {
            if (!rawData) return null;

            // 新格式: { data: {...}, labels: {...} }
            if (rawData.data && typeof rawData.data === 'object') {
                return rawData;
            }

            // 旧格式: 平铺 -> 转换成新格式
            const { labels, ...rest } = rawData;
            return {
                data: rest,
                labels: labels || {}
            };
        },
        /**
         * 计算六维评价
         * @param {Object} dimensions 六维数据对象
         * @return {string} 评价结果
         */
        calculateLiuweiEvaluation(dimensions) {
            const { wuli, wuxing, lingqiao, dingli, rongmao, qiyun } = dimensions;
            const values = [wuli, wuxing, lingqiao, dingli, rongmao, qiyun];

            // 全部都是100，评价：作弊
            if (values.every(val => val === 100)) {
                return '作弊';
            }

            // 除了武力，各项都超过90，评价：遗世
            if (wuxing >= 90 && lingqiao >= 90 && dingli >= 90 && rongmao >= 90 && qiyun >= 90) {
                return '遗世';
            }

            // 武力大于80&&悟性大于80&&其他小于80，武将评价：双全
            if (wuli > 80 && wuxing > 80 && lingqiao < 80 && dingli < 80 && rongmao < 80 && qiyun < 80) {
                return '双全';
            }

            // 容貌，悟性，灵巧大于80，其他不超过80：佳人
            if (rongmao > 80 && wuxing > 80 && lingqiao > 80 && wuli <= 80 && dingli <= 80 && qiyun <= 80) {
                return '佳人';
            }

            // 全部小于50，评价：辣鸡
            if (values.every(val => val < 50)) {
                return '辣鸡';
            }

            return '无';
        },
        /**
         * 获取皮肤台词
         * @param characterID 武将ID
         * @param skinName 皮肤名称
         */
        getSkinTaiCi(characterID, skinName) {
            return this.getSkinInfo(characterID, skinName)?.skill ?? {};
        },
        /**
         * 获取皮肤品质
         * @param characterID 武将ID
         * @param skinName 皮肤名称
         */
        getSkinLevel(characterID, skinName) {
            const skinInfo = this.getSkinInfo(characterID, skinName);
            return skinInfo?.level ?? null;
        },
        /**
         * 皮肤是否有专属卡牌语音
         * @param characterID
         * @param skinName
         */
        getSkinInfoCard(characterID, skinName) {
            const skinInfo = this.getSkinInfo(characterID, skinName);
            return skinInfo?.skill?.card ?? false;
        },
        getPathSkinOrder(skinPath) {
            const characterID = lib.qySkinAudio.getPathCharacterID(skinPath);
            const pathFileName = lib.qyUtils.removeFileExtension(lib.qySkinAudio.getPathFileName(skinPath));
            return lib.qySkinAudio.getSkinOrder(characterID, pathFileName);
        },
        /**
         * 获取皮肤顺序
         * @param characterID
         * @param skinName
         */
        getSkinOrder(characterID, skinName) {
            const skinInfo = this.getSkinInfo(characterID, skinName);
            return skinInfo?.order ?? 0;
        },
        /**
         * 获取皮肤六维数据
         * @param characterID 武将ID
         * @param skinName 皮肤名称
         * @return {Object|null} 规范化后的六维数据
         */
        getSkinLiuwei(characterID, skinName) {
            const skinInfo = this.getSkinInfo(characterID, skinName);
            const rawLiuwei = skinInfo?.liuwei;
            if (!rawLiuwei) return null;

            return this._normalizeLiuweiData(rawLiuwei);
        },
        /**
         * 获取皮肤信息
         * @param characterID 武将ID
         * @param skinName 皮肤名称
         */
        getSkinInfo(characterID, skinName) {
            return lib.qySkinInfo[characterID]?.[skinName] ?? null;
        },
        /**
         * 设置武将的皮肤
         * @param characterID 武将ID
         * @param skinName  皮肤名称
         */
        setCurrentSkin(characterID, skinName) {
            if (!skinName || typeof skinName !== 'string' || skinName.includes('经典形象')) {
                delete lib.config.qingyao_Skin[characterID];
            } else {
                let path = skinName;
                // 如果不是皮肤全路径，则拼接上路径
                if (!skinName.includes('/')) {
                    path = `${this.skinConfigPath}/${characterID}/${skinName}.jpg`
                }
                lib.config.qingyao_Skin[characterID] = path;
            }
            game.saveConfigValue('qingyao_Skin');
        },
        /**
         * 设置武将的皮肤
         * @param characterID 武将ID
         * @param skinName  皮肤名称
         */
        setCurrentTempSkin(characterID, skinName) {
            if (!lib.config.qingyaoTempSkin) {
                lib.config.qingyaoTempSkin = {}
            }
            if (skinName === '经典形象') {
                delete lib.config.qingyaoTempSkin[characterID];
            } else {
                const path = `${this.skinConfigPath}/${characterID}/${skinName}.jpg`
                lib.config.qingyaoTempSkin[characterID] = path;
            }
        },
        /**
         * 皮肤切换的动态皮肤key
         * @return {*}
         */
        get switchSkinConfigKey() {
            return window.skinSwitch?.configKey?.dynamicSkin;
        },
        get dynamicStaticConfigKey() {
            return "qingyao_dynamicStatic";
        },
        /**
         * 同步皮肤切换的动皮配置
         * @param characterID
         * @param skinName
         */
        syncSwitchSkinConfig(characterID, skinName) {
            if (!this.switchSkinConfigKey) return;
            if (!lib.config[this.switchSkinConfigKey]) lib.config[this.switchSkinConfigKey] = {}
            if (!skinName) {
                delete lib.config[this.switchSkinConfigKey][characterID];
            } else {
                lib.config[this.switchSkinConfigKey][characterID] = skinName;
            }
            game.saveConfigValue(this.switchSkinConfigKey);
        },
        /**
         * 动静状态切换
         * @param characterID 武将ID
         * @param skinName 皮肤名称
         * @param isDynamic 是否动态皮肤
         */
        setDynamicStaticSkin(characterID, skinName, isDynamic = true) {
            if (!lib.config['extension_假装无敌_' + this.dynamicStaticConfigKey]) {
                lib.config['extension_假装无敌_' + this.dynamicStaticConfigKey] = {}
            }
            const configElement = lib.config['extension_假装无敌_' + this.dynamicStaticConfigKey];
            if (!configElement[characterID]) {
                configElement[characterID] = {}
            }
            configElement[characterID][skinName] = isDynamic;
            game.saveExtensionConfig('假装无敌', this.dynamicStaticConfigKey, configElement);
        },
        /**
         * 检测当前武将的皮肤是否这个一致
         * @param characterID 武将ID
         * @param skinName 皮肤名称
         * @param {boolean} 是否共享
         * @return {boolean} 是否一直
         */
        isInSkinName(characterID, skinPath, isTemp = true) {
            if (!characterID) return false;
            // 当前皮肤的路径
            const currentSkinPath = this.getConfigSkin(characterID, isTemp);
            if (!currentSkinPath) {
                // 目标的皮肤名称
                const skinName = this.getPathFileName(skinPath);
                // 如果当前没有皮肤，并且目标皮肤也是经典形象，则返回true，证明都是原话
                if (!skinName || (skinName && skinName.includes('经典形象'))) {
                    return true;
                }
                // 如果当前没有配置的路径，并且目标皮肤名称和武将ID一致，则返回true，证明都是原画
                if (!currentSkinPath && lib.qyUtils.removeFileExtension(skinName) === characterID) {
                    return true;
                }
            }
            return currentSkinPath === lib.qyUtils.removeParamsFromPath(skinPath);
        },
        /**
         * 获取共享皮肤信息
         * @param name
         */
        getSkinShareInfo(name) {
            const skinShareInfo = lib.qySkinShare?.[name];
            if (!skinShareInfo) return {};
            return skinShareInfo;
        },
        /**
         * 获取共享的皮肤
         * @param characterID
         */
        getShareSkinList(characterID) {
            const shareElement = lib.qySkinShare[characterID];
            if (!shareElement) return [];
            if (!shareElement.name) return [];
            let shareSkinList = [];
            shareSkinList = shareSkinList.concat(shareElement.name);
            return shareSkinList.filter(o => o !== characterID && o);
        },
        // 获取文件名称
        getPathFileName(path) {
            if (!path || typeof path !== 'string') return null;
            const matchFileName = path.match(/\/([^/?#]+)(?:\?|#|$)/);
            if (matchFileName === null) return matchFileName;
            return matchFileName[1];
        },
        // 从路径中获取到武将ID
        getRealName(characterID) {
            const configSkin = this.getConfigSkin(characterID);
            if (!configSkin) return characterID;
            return this.getPathCharacterID(configSkin) ?? characterID;
        },
        // 从路径上获取武将ID
        getPathCharacterID(path) {
            const split = path.split('/');
            return split[split.length - 2];
        },
        // 获取映射后的技能ID
        getRealSkillAudioName(characterID, skillID) {
            if (!characterID || !skillID) return false;
            // 获取真实的武将名称
            const realName = this.getRealName(characterID);
            const skillElement = lib.qySkinShare?.[characterID]?.skill?.[realName]?.[skillID];
            if (!skillElement) return skillID;
            return skillElement;
        },
        // 获取语音下标，主要是可能有 qibaodao2.mp3 qibaodao1.mp3 等等，获取到 2、1
        getAudioIndex(fileName) {
            if (!fileName) return null;
            const regex = /^.*(\d)\.([a-z]|[0-9])+$/i; // 匹配以数字结尾的任意后缀文件名（忽略大小写），并捕获最后一个数字字符
            const matchResult = fileName.match(regex) || [];
            // 取数字字符
            const lastDigit = matchResult[1];
            return lastDigit || null;
        },
        // 获取技能id
        getSkillId(fileName, index) {
            if (!fileName) return null;
            let audioName = fileName.substring(0, fileName.lastIndexOf("."));
            if (audioName.endsWith(index)) audioName = audioName.substring(0, audioName.length - index.length);
            return audioName;
        },
        // 获取当前玩家的名称
        getCurrentPlayer(skillID) {
            // 1. 换肤界面的玩家
            if (_status.currentQySkinAudio) return _status.currentQySkinAudio;

            // 2. 按技能ID查找拥有该技能的玩家
            if (skillID) {
                const player = game.findPlayer2(p => p.hasSkill(skillID));
                return player || get.player();
            }

            // 3. 获取当前事件的玩家
            return get.player();
        },
        // 获取配置的皮肤路径
        getConfigSkin(characterID, isTemp = true) {
            if (isTemp) {
                if (_status.currentQySkinAudio) return _status.currentQySkinAudio.skinPath;
                // 临时的皮肤
                if (lib.config.qingyaoTempSkin?.[characterID]) return lib.config.qingyaoTempSkin[characterID];
            }
            // 正常设置的皮肤
            return lib.config.qingyao_Skin[characterID];
        },
        // 获取当前使用的皮肤名称
        getSkinName(characterID) {
            const skinSkinPath = this.getConfigSkin(characterID);
            if (!skinSkinPath) return false;
            // 获取文件名称
            const pathName = this.getPathFileName(skinSkinPath);
            if (!pathName) return false;
            // 去掉后缀
            return lib.qyUtils.removeFileExtension(pathName);
        },
        /**
         * 获取皮肤语音路径
         * @param characterID 武将ID liubei、guanyu、zhangfei。。。
         * @param skinName 皮肤名称 智擒严颜
         * @param skillID 技能ID rende、paoxiao、wusheng
         * @param index 下标，可无可有，反正可以自己解析
         * @return {string}
         */
        getSkinAudioSrc(characterID, skinName, skillID, index) {
            // 获取映射后的技能ID
            const realSkillAudioName = this.getRealSkillAudioName(characterID, skillID);
            // 获取配置的皮肤路径
            characterID = this.getRealName(characterID);
            const audioIndex = index ?? '';
            const baseFileName = `${realSkillAudioName}${audioIndex}`;
            // 语音路径
            const url = `${this.audioConfigPath}/${characterID}/${skinName}/${baseFileName}.mp3`;
            // 兼容历史命名：未命中时追加一次 index
            if (lib.qyUtils.checkFileExistence(url)) return url;
            if (audioIndex !== '') {
                const fallbackFileName = `${realSkillAudioName}1${audioIndex}`;
                const fallbackUrl = `${this.audioConfigPath}/${characterID}/${skinName}/${fallbackFileName}.mp3`;
                if (lib.qyUtils.checkFileExistence(fallbackUrl)) return fallbackUrl;
            }
            return false;
        },
        /**
         * 保存皮肤共享配置
         * @param {Object} newConfig 新的配置对象
         */
        async saveSkinShare(newConfig) {
            // 1. 更新内存中的 lib.qySkinShare
            lib.qySkinShare ||= {};

            // 深度合并新配置
            Object.assign(lib.qySkinShare, newConfig);

            // 2. 写入文件
            const template = `window.qyImport(function (lib, game, ui, get, ai, _status, config) {
/**
 * qySkinShare 对象用于存储皮肤和语音共享信息
 * 这是一个自动生成的文件，请勿手动修改逻辑部分
 */
const qySkinShare = REPLACE_DATA;

lib.qyUtils.deepMergeMultiple(lib.qySkinShare, qySkinShare);
});`;

            const fileContent = template.replace('REPLACE_DATA', JSON.stringify(lib.qySkinShare, null, 2));

            return new Promise((resolve, reject) => {
                game.writeFile(fileContent, 'extension/清瑶葭绮/members/假装无敌/js/skin', 'skinShare.js', (err) => {
                    lib.qyMessage.show({
                        type: 'success',
                        text: '皮肤共享配置写入成功',
                    });
                    resolve();
                });
            });
        },
        syncSkinInfoWriteFile(characterID, skinName, attributes = {}) {
            let qySkinInfoElement = lib.qySkinInfo[characterID];
            if (!qySkinInfoElement) {
                qySkinInfoElement = lib.qySkinInfo[characterID] = {
                    [skinName]: attributes,
                };
            }
            // 皮肤变量
            let skinInfoElementElement = lib.qySkinInfo[characterID][skinName];
            if (!skinInfoElementElement) {
                lib.qySkinInfo[characterID][skinName] = skinInfoElementElement = attributes;
            }
            // 写上属性
            lib.qyUtils.deepMergeMultiple(skinInfoElementElement, attributes);
            // 输出文件
            this.skinInfoWriteFile();
        },
        skinInfoWriteFile() {
            let templateFileCode = `window.qyImport(function (lib, game, ui, get, ai, _status, config) {
    /**
     * qySkinInfo 对象用于存储皮肤信息
     * @type {Object}
     * @property {Object} - 角色名
     * @property {Object} xxx.xxx - 皮肤名
     * @property {number} xxx.xxx.order - 皮肤排序
     * @property {string} xxx.xxx.level - 皮肤品质，可选值有 'junk': '平凡', 'boutique': '稀有', 'rare': '精品', 'epic': '史诗', 'legend': '传说'
     * @property {Object} xxx.xxx.liuwei - 六维数据
     * @property {Object} xxx.xxx.skill - 技能信息
     * @property {boolean} xxx.xxx.skill.card - 是否有卡牌语音
     * @property {boolean} xxx.xxx.skill.die - 阵亡语音
     * @property {boolean} xxx.xxx.skill.victory - 胜利语音
     * @property {boolean} xxx.xxx.skill.卡牌ID - 卡牌语音描述
     * @property {string} xxx.xxx.skill.技能ID1 - 技能1的台词 如果改技能有两个语音，则需要写成xxx1 xxx2 如果只有一个，则是 xxx
     * @property {string} xxx.xxx.skill.技能ID2 - 技能2的台词 如果改技能有两个语音，则需要写成xxx1 xxx2 如果只有一个，则是 xxx
     */
    const qySkinInfo = REPLACE_QY_SKIN_INFO_JSON_STRING;

    lib.qyUtils.deepMergeMultiple(lib.qySkinInfo, qySkinInfo);
});`;
            let fileCode = templateFileCode
                .replace("REPLACE_QY_SKIN_INFO_JSON_STRING", JSON.stringify(lib.qySkinInfo, null, 4));

            game.writeFile(fileCode, 'extension/清瑶葭绮/members/假装无敌/js/skin', 'skinInfo.js', () => {
                lib.qyMessage.show({
                    type: 'success',
                    text: '皮肤信息写入成功',
                })
            });
        },
    }


    if (!lib.config.extension_假装无敌_qyCharacterLevelMapping) {
        game.saveExtensionConfig('假装无敌', 'qyCharacterLevelMapping', {});
    }

    // 武将经验信息
    if (!lib.config.extension_假装无敌_qyCharacterExperience) {
        game.saveExtensionConfig('假装无敌', 'qyCharacterExperience', {});
    }


    lib.qyArenaReadyPushOrRunStart(() => {
        const gameGetRarity = game.getRarity;
        game.getRarity = function (name) {
            const rarity = gameGetRarity.apply(this, arguments);
            return lib.qyUtils.getObjectConfig('qyCharacterLevelMapping', rarity, name);
        }
    });

    // 全局武将皮肤
    lib.qyGlobalSkinDirectory = {
        assetList: [`extension/清瑶葭绮/members/假装无敌/gameAsset/image/skin`, `image/skin`],
        load: function () {
            let qyGlobalSkinDirectory = game.getExtensionConfig('假装无敌', 'qyGlobalSkinDirectory');
            if (!Array.isArray(qyGlobalSkinDirectory)) {
                qyGlobalSkinDirectory = [];
                game.saveExtensionConfig('假装无敌', 'qyGlobalSkinDirectory', qyGlobalSkinDirectory);
            }
            return qyGlobalSkinDirectory;
        },
        get: function () {
            let globalSkinDirectory = this.load();
            globalSkinDirectory = Array.from(new Set(globalSkinDirectory.concat(this.assetList)));
            return globalSkinDirectory;
        },
        add: function (url) {
            const globalSkinDirectory = this.get();
            globalSkinDirectory.addArray([].concat(url));
            globalSkinDirectory.removeArray(this.assetList);
            game.saveExtensionConfig('假装无敌', 'qyGlobalSkinDirectory', globalSkinDirectory);
        },
        del: function (url) {
            const globalSkinDirectory = this.get();
            globalSkinDirectory.removeArray(this.assetList.concat(url));
            game.saveExtensionConfig('假装无敌', 'qyGlobalSkinDirectory', globalSkinDirectory);
        },
        contains: function (url) {
            const globalSkinDirectory = this.get();
            return globalSkinDirectory.includes(url);
        }
    }
    // 获取单个武将皮肤集合
    lib.qyCharacterSkinDirectory = {
        get: function (characterID) {
            let characterSkinList = game.getExtensionConfig('假装无敌', 'qyCharacterSkinDirectory')
            if (typeof characterSkinList !== 'object' && characterSkinList !== null) {
                characterSkinList = {};
                game.saveExtensionConfig('假装无敌', 'qyCharacterSkinDirectory', characterSkinList);
            }
            if (!Array.isArray(characterSkinList[characterID])) characterSkinList[characterID] = [];
            return characterSkinList[characterID];
        },
        add: function (characterID, urlList) {
            const characterList = this.get(characterID);
            characterList.addArray([].concat(urlList));
            game.saveConfigValue(`extension_假装无敌_qyCharacterSkinDirectory`);
        },
        del: function (characterID, urlList) {
            let characterList = this.get(characterID);
            if (urlList) {
                characterList.removeArray([].concat(urlList));
            } else {
                characterList.length = 0;
            }
            game.saveConfigValue(`extension_假装无敌_qyCharacterSkinDirectory`);
        },
        contains: function (characterID, url) {
            const characterList = this.get(characterID);
            return characterList.includes(url);
        }
    }
    // 获取单个武将皮肤图合集
    lib.qyCharacterSkinList = {
        get: function (characterID) {
            let characterSkinList = game.getExtensionConfig('假装无敌', 'qyCharacterSkinList')
            if (typeof characterSkinList !== 'object' && characterSkinList !== null) {
                characterSkinList = {};
                game.saveExtensionConfig('假装无敌', 'qyCharacterSkinList', characterSkinList);
            }
            if (!Array.isArray(characterSkinList[characterID])) characterSkinList[characterID] = [];
            return characterSkinList[characterID];
        },
        add: function (characterID, urlList) {
            const characterList = this.get(characterID);
            characterList.addArray([].concat(urlList));
            game.saveConfigValue(`extension_假装无敌_qyCharacterSkinList`);
        },
        del: function (characterID, urlList) {
            let characterList = this.get(characterID);
            if (urlList) {
                characterList.removeArray([].concat(urlList));
            } else {
                characterList.length = 0;
            }
            game.saveConfigValue(`extension_假装无敌_qyCharacterSkinList`);
        },
        contains: function (characterID, url) {
            return this.get(characterID).contains(url)
        }
    }

    //保存扩展上换肤的路径
    if (!lib.config.qingyao_Skin) lib.config.qingyao_Skin = {};

    // 冲突提示
    const skinConflictNoAlert = function (str, configKey = 'qingyaoSkinConflictNoAlert') {
        if (game.getExtensionConfig('假装无敌', configKey)) return;
        lib.qyArenaReadyPushOrRunStart(() => {
            game.qyprompt('alert', false, str, "confirm:不再提醒", "cancel:知道了", function (result) {
                if (result === false) return;
                game.saveExtensionConfig('假装无敌', configKey, true);
            })
        })
    }
    // 换肤
    if (lib.config.extension_假装无敌_qingyao_Skin_enable) {
        HTMLDivElement.prototype.orginSetBackground = HTMLDivElement.prototype.setBackground;
        const isDefineSetBackground = Reflect.defineProperty(HTMLDivElement.prototype, 'setBackground', {
            get() {
                return function (name, type, ext, subfolder) {
                    if (!name) return;
                    let isTemp = false;
                    if (typeof type === 'boolean') {
                        isTemp = type;
                    }
                    const skinElement = lib.qySkinAudio.getConfigSkin(name, isTemp);
                    if (skinElement) {
                        if (typeof skinElement === 'string') {
                            let src = skinElement.replace(/ext:/g, 'extension/');
                            const skinName = lib.qySkinAudio.getSkinName(name);
                            if (_status.qyPhotoImages && _status.qyPhotoImages[name] && _status.qyPhotoImages[name].includes(skinName)) {
                                src += '?vd=' + performance.now();
                            }
                            this.setBackgroundImage(src);
                            this.style.backgroundSize = "cover";
                            return this;
                        }
                    }
                    return this.orginSetBackground.call(this, name, type, ext, subfolder);
                }
            },
            set(v) {
                skinConflictNoAlert("【假装无敌】现有扩展换肤功与本扩展冲突，如有异常请关闭");
            },
            configurable: false,
        })
        if (!isDefineSetBackground) {
            skinConflictNoAlert("【假装无敌】换肤与现有扩展换肤功能可能存在冲突，如有异常请关闭");
        }
        // 换音
        _status.skillaudiox = [];
        game.qyOriginPlayAudio = game.playAudio;
        // 失败的语音，将不在查找
        const ERROR_AUDIO_URL = new Set();
        game.qyPlayAudio = function () {
            let audio = game.qyOriginPlayAudio.apply(this, arguments);
            // 有时候返回undefined
            if (!audio) {
                audio = new Audio();
                var str = '';
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] === 'string' || typeof arguments[i] == 'number') {
                        str += '/' + arguments[i];
                    }
                }
                audio.src = str;
                document.head.appendChild(audio);
            }
            // 查找换音语音失败
            if (ERROR_AUDIO_URL.has(audio.src)) {
                return audio;
            }
            // 开关
            let startTime;
            let uuid = get.id();
            try {
                startTime = Date.now();
                // =================================================== 开始换肤换音逻辑 ===================================================
                /****** 获取语音ID ******/
                // 语音名称
                const originSrc = audio.src;
                const audioName = lib.qySkinAudio.getPathFileName(originSrc);
                if (audioName === null) return audio;
                // 获取当前语音播放的下标
                const audioIndex = lib.qySkinAudio.getAudioIndex(audioName);
                // 获取技能id
                const skill = lib.qySkinAudio.getSkillId(audioName, audioIndex);

                // 获取当前播放语音的角色
                const player = lib.qySkinAudio.getCurrentPlayer(skill);
                if (!player || (!player.name1 && !player.name2)) return audio;
                uuid = get.translation(player.name1);
                let audioSkinSrc = false;
                let skinName;
                // 双将
                /****** 获取换肤名称 ******/
                for (const name of [player.name1, player.name2]) {
                    // 没有名称
                    if (!name) continue;
                    // 获取皮肤名称
                    skinName = lib.qySkinAudio.getSkinName(name);
                    if (skinName === false) return audio;
                    // 皮肤语音路径
                    audioSkinSrc = lib.qySkinAudio.getSkinAudioSrc(name, skinName, skill, audioIndex);
                    // 匹配上语音
                    if (audioSkinSrc !== false) break;
                }
                // 未匹配上语音
                if (audioSkinSrc === false) return audio;
                // 语音
                audio.src = lib.assetURL + audioSkinSrc;
                if (!lib.config.repeat_audio && _status.skillaudiox.includes(audio.src)) {
                    audio.remove();
                    return;
                }
                const str = audio.src;
                _status.skillaudiox.add(str);
                audio.addEventListener('ended', function () {
                    _status.skillaudiox.remove(str);
                });
                audio.onerror = function (event) {
                    _status.skillaudiox.remove(str);
                    ERROR_AUDIO_URL.add(this.src);
                }
                // console.log("武将：%s\n语音名称：%s\n第几个语音：%s\n皮肤名称：%s\n语音地址：%s\n源语音地址：%s", get.translation(player.name1), audioName, audioIndex, skinName, audioSkinSrc, originSrc);
                // =================================================== 结束换肤换音逻辑 ===================================================
            } finally {
                // const endTime = Date.now();
                // console.log("性能监控：%s：%s MS", uuid, endTime - startTime);
            }
            return audio;
        }
        game.playAudio = game.qyPlayAudio;
        const playSkillAudio = game.playSkillAudio;
        game.playSkillAudio = function (name, index) {
            if (_status.video && arguments[1] != 'video') return;
            if (!lib.config.repeat_audio && _status.skillaudio.includes(name)) return;
            game.addVideo('playSkillAudio', null, name);
            if (name.indexOf('|') < name.lastIndexOf('|')) {
                name = name.slice(name.lastIndexOf('|') + 1);
            }
            // 获取当前角色
            const player = lib.qySkinAudio.getCurrentPlayer(name);
            if (!player) return playSkillAudio.apply(this, arguments);
            // 获取皮肤名称
            const skinName = lib.qySkinAudio.getSkinName(player.name1);
            if (skinName === false) return playSkillAudio.apply(this, arguments);
            // 先留着，这里的name一般都是已经解析过的真正技能id了
            // // 获取当前语音播放的下标
            // index ||= lib.qySkinAudio.getAudioIndex(name + '.mp3');
            // // 获取技能id
            // name = lib.qySkinAudio.getSkillId(name + '.mp3', index) || name;
            // 获取路径
            let str = lib.qySkinAudio.getSkinAudioSrc(player.name1, skinName, name, index);
            if (str === false) {
                // 607的bug
                if (typeof index != 'number') {
                    index = Math.ceil(Math.random() * 2);
                }
                // 检测一下本地有没有多个语音文件，如果还是没有，则返回原语音
                str = lib.qySkinAudio.getSkinAudioSrc(player.name1, skinName, name, index);
                if (str === false) {
                    return playSkillAudio.apply(this, arguments);
                }
            }
            // 获取语音地址
            const pathFileName = lib.qySkinAudio.getPathFileName(str);
            name = lib.qyUtils.removeFileExtension(pathFileName);
            str = str.replace(pathFileName, '');
            if (str === null) return audio;

            /****************************** 原逻辑分割线 ******************************/
            var audio = document.createElement('audio');
            audio.autoplay = true;
            audio.volume = lib.config.volumn_audio / 8;
            audio.src = lib.assetURL + str + name + '.mp3';
            _status.skillaudiox.add(name);
            audio.addEventListener('ended', function () {
                this.remove();
                _status.skillaudiox.remove(name);
            });
            if (typeof index != 'number') {
                index = Math.ceil(Math.random() * 2);
            }
            audio._changed = 1;
            audio.onerror = function () {
                switch (this._changed) {
                    case 1: {
                        audio.src = lib.assetURL + str + name + '.ogg';
                        this._changed = 2;
                        break;
                    }
                    case 2: {
                        audio.src = lib.assetURL + str + name + index + '.mp3';
                        this._changed = 3;
                        break;
                    }
                    case 3: {
                        audio.src = lib.assetURL + str + name + index + '.ogg';
                        this._changed = 4;
                        break;
                    }
                    default: {
                        this.remove();
                    }
                }
            };
            ui.window.appendChild(audio);
        }
    }

    game.qyTryPlaySkillAudio = function (audioname, characterID, index) {
        let info = lib.skill[audioname];
        if (info.audioname2 && info.audioname2[characterID]) {
            audioname = info.audioname2[characterID];
            info = lib.skill[audioname];
        }
        var audioinfo = info.audio;

        if (typeof audioinfo == 'string') {
            if (audioinfo.indexOf('ext:') == 0) {
                audioinfo = audioinfo.split(':');
                if (audioinfo.length == 3) {
                    if (audioinfo[2] == 'true') {
                        game.playAudio('..', 'extension', audioinfo[1], audioname);
                    } else {
                        audioinfo[2] = parseInt(audioinfo[2]);
                        if (audioinfo[2]) {
                            game.playAudio('..', 'extension', audioinfo[1], audioname + index);
                        }
                    }
                }
                return;
            } else {
                audioname = audioinfo;
                if (lib.skill[audioinfo]) {
                    audioinfo = lib.skill[audioinfo].audio;
                }
            }
        } else if (Array.isArray(audioinfo)) {
            audioname = audioinfo[0];
            audioinfo = audioinfo[1];
        }
        if (typeof audioinfo == 'number') {
            if (Array.isArray(info.audioname) && info.audioname.includes(characterID)) audioname = audioname + '_' + characterID;
            game.playAudio('skill', audioname + index);
        } else if (audioinfo) {
            if (Array.isArray(info.audioname) && info.audioname.includes(characterID)) audioname = audioname + '_' + characterID;
            game.playAudio('skill', audioname);
        } else if (info.audio !== false) {
            if (Array.isArray(info.audioname) && info.audioname.includes(characterID)) audioname = audioname + '_' + characterID;
            game.playSkillAudio(audioname, index);
        }
    }
    if (!game.playDieAudio) {
        game.playDieAudio = function (name) {
            const character4Element = get.character(name, 4);
            if (Array.isArray(character4Element)) {
                // 找阵亡语音目录，扩展写法
                const dieAudio = character4Element.find(item => typeof item === 'string' && item.startsWith('die:'));
                if (dieAudio) {
                    let dieExtPath = dieAudio.replace(/die:/, 'extension:').replace(/ext:/, '').split(':').join("/");
                    game.playAudio('..', dieExtPath, name);
                    return;
                }
            }
            // 阵亡配音，游戏目录
            if (character4Element.includes('die_audio')) {
                game.playAudio('die', name);
            } else {
                game.playAudio('die', name, function () {
                    game.playAudio('die', name.slice(name.indexOf('_') + 1));
                });
            }
        }
    }
    // 播放胜利语音
    game.tryVictoryAudio = function (name) {
        let audioVictoryPath = lib.qySkinAudio.audioVictoryPath;
        const character4Element = get.character(name, 4);
        if (Array.isArray(character4Element)) {
            // 查找胜利语音目录，扩展写法
            const victory = character4Element.find(item => typeof item === 'string' && item.startsWith('victory:'));
            if (victory) {
                audioVictoryPath = victory.replace(/victory:/, 'extension/').split(':').join("/");
                // 如果是自定义的语音路径，那就用扩展的方式
                if (audioVictoryPath.endsWith('.mp3')) {
                    const existence = lib.qyUtils.checkFileExistence(audioVictoryPath);
                    if (existence) {
                        game.playAudio('..', victoryURL);
                    }
                    return existence;
                }
            }
        }
        // 胜利语音的路径
        let victoryURL = `${audioVictoryPath}/${name}/victory.mp3`;
        const skinName = lib.qySkinAudio.getSkinName(name);
        if (skinName !== false) {
            victoryURL = `${audioVictoryPath}/${name}/${skinName}/victory.mp3`;
        }
        const existence = lib.qyUtils.checkFileExistence(victoryURL);
        if (existence) {
            game.playAudio('../', victoryURL)
        }
        return existence;
    }

    let qingyaoDetail = game.getExtensionConfig('假装无敌', 'qingyaoDetail');
    if (!(qingyaoDetail instanceof globalThis.Object)) {
        game.saveExtensionConfig('假装无敌', 'qingyaoDetail', {
            outcrop: false,
        });
        qingyaoDetail = game.getExtensionConfig('假装无敌', 'qingyaoDetail');
    }

    /**
     * 下载文件
     * @param {string} baseUrl 文件在服务器上的基础URL
     * @param {string} url 文件URL
     * @param {string} targetBaseURL 目标文件存储在本地的基础路径
     * @returns 返回一个Promise，resolve时返回下载得到的文件路径
     */
    const download = function (baseUrl, url, targetBaseURL) {
        return fetch(`${baseUrl}/${url}`)
            .then((data) => data.arrayBuffer())
            .then((arraybuffer) => {
                const dir = url.slice(0, url.lastIndexOf('/'));
                const name = url.slice(url.lastIndexOf('/') + 1);
                url = url.replace(name, '');
                const directory = `${targetBaseURL}`;
                return new Promise((resolve, reject) => {
                    game.writeFile(arraybuffer, directory, name, function (err) {
                        if (lib.node && err) {
                            reject(err);
                        } else {
                            resolve(`${directory}/${name}`);
                        }
                    });
                });
            });
    };

    const downloadSearchSkin = function (qy_chess_container, skinContainer, characterID) {
        game.qyprompt(`###请输入要下载皮肤的武将ID,若不知,使用默认即可###/${characterID}/`, function (result) {
            if (result === false) return;
            const baseUrl = 'https://gitcode.net/qq_46114377/gameSkinAsset/-/raw/master';
            Promise.allSettled([fetch(`${baseUrl}/assetImageFileList.json`), fetch(`${baseUrl}/assetAudioFileList.json`)])
                .then(promiseResult => {
                    const response = promiseResult[0].value;
                    const audioResponse = promiseResult[1].value;
                    if (response.ok !== true) return game.qyalert(`请检查网络设置<br/>错误状态码：${response.status}<br/>错误信息：${response.statusText}`);
                    Promise.allSettled([response.json(), audioResponse.json()]).then(jsonResultList => {
                        let data = [];
                        let audioData = [];
                        const jsonDataResultListElement = jsonResultList[0];
                        if (jsonDataResultListElement.status === 'fulfilled') {
                            data = jsonDataResultListElement.value;
                        }
                        const jsonAudioResultListElement = jsonResultList[1];
                        if (jsonAudioResultListElement.status === 'fulfilled') {
                            audioData = jsonAudioResultListElement.value;
                        }

                        const skinList = data.filter(str => str.includes(result));
                        if (!skinList.length) return game.qyalert('根据输入的ID未找到对应的皮肤');
                        const obj = {};
                        for (let skinListElement of skinList) {
                            const prefix = skinListElement.slice(0, skinListElement.lastIndexOf("/"));
                            let list = obj[prefix];
                            if (!list) {
                                list = obj[prefix] = [];
                            }
                            list.add(skinListElement);
                        }

                        const dialog = ui.create.dialog('请选择要下载的文件夹', 'hidden', 'forcebutton', true);
                        dialog.classList.add('scroll1', 'scroll2', 'popped', 'static');
                        qy_chess_container.appendChild(dialog);
                        dialog.css({
                            width: '80vw',
                            left: '50%',
                            transform: 'translate3d(-50%,-50%,0)'
                        });

                        for (const entry of Object.entries(obj)) {
                            const key = entry[0];
                            const value = entry[1];
                            const item = dialog.add(`<div class="qypopup menubutton"><div>${key}</div></div>`);
                            item.firstChild.link = value;
                            item.firstChild.addEventListener('click', function (event) {
                                event.stopPropagation();
                                // 清空选项
                                dialog.content.innerHTML = '';
                                // 选择
                                const currentSelected = [];
                                const downloadButton = ui.create.div('.menubutton.highlight.qymenubutton', '全部下载', dialog);
                                downloadButton.type = 'all'
                                downloadButton.addEventListener('click', (event) => {
                                    if (downloadButton.type === 'all') currentSelected.addArray(this.link);
                                    const targetBaseURL = 'extension/清瑶葭绮/members/假装无敌/gameAsset/';

                                    game.ensureDirectory(`${targetBaseURL}image/skin/${characterID}`, () => {
                                        for (const skinListElement of currentSelected) {
                                            let skineName = skinListElement.replace(/\.([a-zA-Z0-9]+)$/gim, '');
                                            skineName = skineName.slice(skineName.lastIndexOf('/') + 1);
                                            const audioList = audioData.filter(item => item.includes(result) && item.includes(skineName));
                                            // 下载皮肤
                                            const skinItem = skinContainer.SkinManager.createSkinItem({
                                                name: skineName,
                                                imageSrc: '',
                                                num: -1,
                                                characterID,
                                            });
                                            const { image, audio } = skinItem.element;
                                            download(baseUrl, skinListElement, `${targetBaseURL}image/skin/${characterID}`)
                                                .then(url => {
                                                    image.setBackgroundImage(url);
                                                    skinItem.imageSrc = url;
                                                    lib.qyUtils.listen(image, skinContainer.skinClickHandle(skineName, url));
                                                }, err => {
                                                    image.innerHTML = '下载失败:' + err.toString();
                                                });
                                            audio.classList.remove('qy_hidden');
                                            if (audioList.length === 0) {
                                                audio.text.innerHTML = '该皮肤没有语音'
                                                continue;
                                            }

                                            let downloadAudioNum = 0;
                                            let downloadAudioErrorNum = 0;
                                            audio.text.innerHTML = `正在下载语音：${downloadAudioNum} / ${audioList.length}`;
                                            audioList.forEach(audioItem => {
                                                // audio/skill/re_xushu/侠义谋略/zhuhai2
                                                game.ensureDirectory(`${targetBaseURL}audio/skill/${characterID}/${skineName}`, () => {
                                                    // 下载皮肤语音
                                                    download(baseUrl, audioItem, `${targetBaseURL}audio/skill/${characterID}/${skineName}`)
                                                        .then(url => {
                                                            let str = `正在下载语音：${++downloadAudioNum} / ${audioList.length}`;
                                                            if ((downloadAudioNum + downloadAudioErrorNum) === audioList.length) {
                                                                str = '下载完毕';
                                                            }
                                                            if (downloadAudioErrorNum > 0) {
                                                                str += `<br/>下载失败数量：${downloadAudioErrorNum}`
                                                            }
                                                            audio.text.innerHTML = str;
                                                        }, err => {
                                                            downloadAudioErrorNum++;
                                                            console.error("下载失败：" + audioItem, err);
                                                        })
                                                })
                                            })
                                        }

                                        // 删除框
                                        dialog.delete(200);
                                    });
                                });

                                for (let linkElement of this.link) {
                                    const itemNode = dialog.add(`<div class="qypopup menubutton" style="text-decoration: underline;">${linkElement}</div>`);
                                    itemNode.firstChild.link = linkElement;
                                    itemNode.firstChild.addEventListener('click', function (event) {
                                        event.stopPropagation();
                                        this.classList.toggle('thundertext')
                                        if (this.classList.contains('thundertext')) {
                                            currentSelected.add(this.link);
                                        } else {
                                            currentSelected.remove(this.link);
                                        }
                                        if (currentSelected.length > 0) {
                                            downloadButton.type = 'downloadFile'
                                            downloadButton.innerHTML = `已选择【${currentSelected.length}】个文件`
                                        } else {
                                            downloadButton.type = 'all'
                                            downloadButton.innerHTML = `全部下载`
                                        }
                                    }, true);
                                }

                            }, true)
                        }
                        dialog.content.addEventListener('click', function (event) {
                            event.stopPropagation();
                            dialog.delete(100);
                        });

                    });
                });
        });
    }

    let isFirestOpen = false;
    const alertText = "该页面来自假装无敌，假装无敌扩展完全免费，禁止倒卖和以其他理由收取费用(倒卖狗没户口本)，禁止整合到蚂蝗版！！！距离关闭该提示还差$次";
    get.characterPackSouce = function (characterID) {
        for (const [key, value] of Object.entries(lib.characterPack)) {
            if (value.hasOwnProperty(characterID)) {
                return key;
            }
        }
        return 'unknown';
    }

    // 武将详细框
    ui.click.qycharactercard = async function (characterID, sourceAvatar, noedit, resume, avatar) {
        try {
            const { createCharacterCard } = await lib.qyUtils.importModule('./js/skin/modules/characterCard/index.js');

            return await createCharacterCard(characterID, sourceAvatar, {
                noedit,
                resume,
                avatar
            });
        } catch (e) {
            alert('武将资料卡加载失败，请检查控制台报错。');
        }
    }

    if (lib.config.extension_假装无敌_qingyaoOverrideCharacterCard) {
        const isDefineCharacter = Reflect.defineProperty(ui.click, 'charactercard', {
            get() {
                return function (name, sourcenode, noedit, resume, avatar) {
                    ui.click.qycharactercard(name, sourcenode || avatar, noedit, resume, avatar)
                        .catch(err => {
                            console.error(err)
                            alert('武将资料页打开失败：' + err);
                        });
                }
            },
            set(v) {
                skinConflictNoAlert("【假装无敌】有扩展尝试修改武将资料页面！");
            },
            configurable: false,
            enumerable: false,
        });
        if (!isDefineCharacter) {
            skinConflictNoAlert("【假装无敌】有扩展尝试修改武将资料页面！");
        }
    }
}
