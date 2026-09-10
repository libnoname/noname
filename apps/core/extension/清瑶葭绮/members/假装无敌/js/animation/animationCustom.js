window.qyImport(async function (lib, game, ui, get, ai, _status, config) {


    if (!game.getExtensionConfig('假装无敌', 'qingyao_animation_editor') || !game.getExtensionConfig('假装无敌', 'qingyao_character_animation')) return;
    if (!lib.qyLoading) {
        return console.error("Custom: 关键工具未加载！！！");
    }

    // 目录
    const dlcDirectory = 'extension/清瑶葭绮/members/假装无敌/js/db';

    const ANIMATION_MENU = 'animation_menu';
    // 总类菜单
    lib.qyAnimationMenu = new IndexedDBCache(ANIMATION_MENU, 1);
    // 特效类
    lib.qyAnimationItem = {}
    // 初始化菜单
    await lib.qyAnimationMenu.init();

    /**
     * 获取菜单，如果没有就添加这个菜单
     * @param {String} name 名称
     * @returns 菜单实例
     */
    async function getAndAddMenuByName(name) {
        const animationMenu = lib.qyAnimationMenu.getByName(name);
        if (animationMenu) return animationMenu;
        const value = { name, label: name, enable: true };
        await lib.qyAnimationMenu.add(value);
        return value
    }

    // 获取文件
    const dbList = await lib.getDBList(dlcDirectory);

    const dbListLoad = dbList.map(async dbName => {
        try {
            const db = new LocalFileDB(dlcDirectory, dbName);
            await db.init();
            if (!db.menu?.name) {
                db.menu = {
                    name: dbName,
                    label: dbName,
                    enable: lib.qyAnimationMenu.getByName(dbName)?.enable ?? false,
                }
            }
            lib.qyAnimationItem[dbName] = db;
            return dbName;
        } catch (e) {
            throw {
                dbName,
                e,
            }
        }
    });

    let failMessage = '';
    await Promise.allSettled(dbListLoad)
        .then(async values => {
            for (const { status, value, reason } of values) {
                // 失败
                if (status === 'rejected') {
                    const { dbName, e } = reason;
                    failMessage += `【${dbName}】加载失败，错误信息：${e.message}\n`;
                    continue;
                }
                await getAndAddMenuByName(value);
            }
            return Promise.resolve(true);
        });
    // 加载错误
    if (failMessage) {
        alert(failMessage);
    }


    // 打开代码编辑页面
    _status.openCodeEditor = false;
    lib.openCodeEditor = function (options = {}) {
        if (_status.openCodeEditor) return;
        _status.openCodeEditor = true;
        const windowOnKeydown = window.onkeydown;
        window.onkeydown = null;
        const {
            checkCodeAndSave = function (code) {

            },
            code: codeMirrorValue = 'function() {}',
            mode: codeMirrorMode = 'javascript',
        } = options;

        // 执行完了
        const oncomplete = function () {
            delete _status.openCodeEditor;
            window.onkeydown = windowOnKeydown;
        }
        const container = ui.create.div('.popup-container.editor');
        const editorpage = ui.create.div(container);
        ui.create.div('.editbutton', '取消', editorpage, function (event) {
            event.stopPropagation();
        }).addEventListener('click', function (event) {
            event.stopPropagation();
            ui.window.classList.remove('shortcutpaused', 'systempaused');
            container.delete(null);
            oncomplete(null);
            delete window.saveNonameInput;
        }, true);
        const node = container;
        ui.window.classList.add('shortcutpaused', 'systempaused');
        const saveInput = function (event) {
            event?.stopPropagation();
            const code = container.editor?.getValue() ?? container.textarea?.value ?? '';
            try {
                checkCodeAndSave(code);
            } catch (e) {
                lib.qyMessage.queueMessageError('代码语法有错误，请仔细检查（' + e + '）');
                return;
            }
            ui.window.classList.remove('shortcutpaused', 'systempaused');
            container.delete();
            container.code = code;
            oncomplete(container);
            delete window.saveNonameInput;
        };
        window.saveNonameInput = saveInput;
        const saveConfig = ui.create.div('.editbutton', '保存', editorpage, saveInput);
        const editor = ui.create.div(editorpage);
        if (node.aced) {
            ui.window.appendChild(node);
            node.editor.setValue(codeMirrorValue, 1);
        } else if (lib.device === 'ios') {
            ui.window.appendChild(node);
            if (!node.textarea) {
                var textarea = document.createElement('textarea');
                editor.appendChild(textarea);
                node.textarea = textarea;
                lib.setScroll(textarea);
            }
            node.textarea.value = codeMirrorValue;
        } else {
            const aceReady = function () {
                window.ace = true;
                ui.window.appendChild(node);
                const mirror = window.CodeMirror(editor, {
                    value: codeMirrorValue,
                    mode: codeMirrorMode,
                    lineWrapping: !lib.config.touchscreen && lib.config.mousewheel,
                    lineNumbers: true,
                    indentUnit: 4,
                    inputStyle: 'textarea',
                    autoCloseBrackets: true,
                    theme: 'mdn-like',
                });
                lib.setScroll(editor.querySelector('.CodeMirror-scroll'));
                node.aced = true;
                node.editor = mirror;
                // 阻止冒泡
                mirror?.display?.input?.getField()?.onkeydown && (mirror.display.input.getField().onkeydown = e => e.stopPropagation());
            }
            if (!window.ace) {
                lib.init.js(lib.assetURL + 'game', 'codemirror', aceReady);
                lib.init.css(lib.assetURL + 'layout/default', 'codemirror');
            } else {
                aceReady();
            }
        }
    }

    // 打开编辑特效配置通用框
    lib.qyOpenAnimationEditor = function (options = {}) {
        let {
            buttonList = [],
            initMenuContent = function (dialog, content, animationItem) {
            },
            onLoad = function (dialog, addItemMenu) {
            },
            initItemMenuName = function (animationItem) {
            },
            initAddButton = function (dialog, button) {
            },
            dialogClose = function (container, dialog) {
            }
        } = options
        const dialog = ui.create.div('.qy_animation_dialog');
        dialog.content = ui.create.div('.qy_animation_dialog_content', dialog);
        const searchDiv = ui.create.div('.qy_animation_dialog_content_search', dialog.content);
        const searchInput = ui.create.node('input', searchDiv);

        function searchItem() {
            const items = Array.from(dialog.content.querySelectorAll('.qy_animation_dialog_item'));
            items.forEach(item => {
                const { animationItem } = item;
                const { label, name } = animationItem;
                const searchValue = searchInput.value.toLowerCase();
                const searchTerms = searchValue.split(' ');
                let matchCount = 0;
                for (const term of searchTerms) {
                    if (label.toLowerCase().includes(term) || name.toLowerCase().includes(term)) {
                        matchCount++;
                    }
                }
                // console.log("搜索权重：", matchCount)
                if (matchCount > 0) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            })
        }

        const debounceSearchItem = lib.qyUtils.debounce(searchItem, 500);
        searchInput.onkeydown = event => {
            event.stopPropagation();
            debounceSearchItem(event);
        }
        const searchButton = ui.create.node('button', '搜索', searchDiv, searchItem);
        // 关闭
        dialog.close = function close(event) {
            event?.stopPropagation();
            container.delete(500);
            dialog.remove();
            dialogClose(container, dialog);
        }
        const container = ui.create.div('.qy_animation_dialog_container', ui.window, dialog.close);
        container.appendChild(dialog);
        // 添加按钮菜单
        const addItemMenu = function (animationItem) {
            const {
                label = '', onclick = function (event) {

                }
            } = initItemMenuName(animationItem) ?? {};
            // 框框
            const item = ui.create.div('.qy_animation_dialog_item');
            // 特效名称
            const nameContainer = ui.create.div('.qy_animation_dialog_item_name_container', item)
            const name = ui.create.div('.qy_animation_dialog_item_name', nameContainer, label, onclick);
            // 内容容器
            const infoContainer = ui.create.div('.qy_animation_dialog_item_info_container', item)
            const contentContainer = ui.create.div('.qy_animation_dialog_item_content_container', infoContainer);
            // 内容
            const content = ui.create.div('.qy_animation_dialog_item_content', contentContainer);
            // 初始化content
            initMenuContent(dialog, content, animationItem);
            // 按钮容器
            const buttonContainer = ui.create.div('.qy_animation_dialog_item_button_container', infoContainer);
            // 添加按钮
            for (let buttonListElement of buttonList) {
                const text = buttonListElement.text;
                const onclick = buttonListElement.onclick;
                const animationButton = ui.create.div('.qy_animation_button', text, buttonContainer);
                animationButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    typeof onclick === 'function' && onclick.call(this, {
                        event, animationItem, dialog, menuItemContainer: item, addItemMenu
                    });
                });
            }
            if (animationItem.animationMenu) {
                item.animationItem = {...animationItem.animationMenu}
            } else {
                item.animationItem = {...animationItem}
            }
            return item;
        }
        // 初始化
        onLoad(dialog, addItemMenu);

        // 添加按钮
        initAddButton(dialog, addItemMenu, ui.create.div('.qy_animation_dialog_add_button'));

        // 给dialog层添加上滚动事件
        lib.setScroll(dialog);
        // 添加到桌面上
        ui.window.appendChild(dialog);

        dialog.dataset.type = options.dialogType
        dialog.dataset.theme = game.getExtensionConfig('假装无敌', 'qingyao_animation_editor_theme') || 'mobile4.5';

        return dialog;
    }

    _status.currentSpineUUid = undefined;


    const checkArrayFunc = (value, result, element) => {
        let errorMessage = '';
        try {
            value = eval(value || []);
            if (!Array.isArray(value)) {
                throw new IllegalArgumentError("必须是数组类型");
            }
        } catch (e) {
            errorMessage = "转换json错误：" + e.toString();
        }
        return {
            isOk: errorMessage === '',
            data: value,
            errorMessage,
        }
    }
    const onLoadArrayFunc = (node, animationItemValue, key) => {
        try {
            let animationItemValueElement = animationItemValue[key];
            if (!Array.isArray(animationItemValueElement)) {
                animationItemValueElement = [];
            }
            node.value = JSON.stringify(animationItemValueElement)
        } catch (e) {
        }
    }
    // 废弃属性和新属性的赋值
    const calculateAnimation = (copyAnimation, animationItem) => {
        const { skeScale } = copyAnimation;
        // 缩放
        if (copyAnimation.hasOwnProperty('skeScale')) {
            delete animationItem.skeScale;
            if (copyAnimation.hasOwnProperty('skeScaleX') === false) {
                copyAnimation.skeScaleX = skeScale;
            }
            if (copyAnimation.hasOwnProperty('skeScaleY') === false) {
                copyAnimation.skeScaleY = skeScale;
            }
        }
    }

    // 参数选项
    const MENU_LIST = [
        {
            name: 'label',
            label: '特效名称',
            default: '',
            check(value, result, element) {
                return {
                    isOk: value?.trim?.(),
                    errorMessage: '请输入特效名称',
                }
            },
        },
        {
            name: 'name',
            label: '骨骼名称',
            default: '',
            onchange: lib.qyUtils.debounce(function (event, value, animationItem) {
                const selector = document.querySelector('.qy_animation_custom select[name=action]');
                if (!selector) return;
                const { name } = animationItem;
                if (name === value) return;
                animationItem.name = value;
                // 查找到动画select框
                const findIndex = MENU_LIST.findIndex(({ name }) => name === 'action');
                if (findIndex === -1) return;
                MENU_LIST[findIndex].onLoad(selector, animationItem);
            }, 1e3),
            check(value, result, animationItem) {
                return {
                    isOk: result.action !== '默认',
                    errorMessage: '请检查骨骼名称对应的文件是否存在！！',
                }
            }
        },
        {
            name: 'action',
            label: '骨骼动画',
            nodeTag: 'select',
            onLoad(node, { name, isJson }) {
                const newOptions = function (list) {
                    // 销毁当前正在播放的动画
                    if (_status.currentSpineUUid) {
                        JzwdWebWorkerDestroySpine(_status.currentSpineUUid);
                        _status.currentSpineUUid = undefined;
                    }
                    // 创建新的动画选择器
                    node.innerHTML = '';
                    const options = list.map((value, index) => new Option(value, value, index === 0, node.defaultValue === value));
                    options.forEach(option => node.appendChild(option));
                }
                if (!name) {
                    newOptions(['默认']);
                    return;
                }
                // 设置上监听事件
                const uuid = globalThis.qyAnimationUtil.generatorUUID();
                lib.qyWorkerLoadSpine({ name, uuid, isJson }, (data, error) => {
                    JzwdWebWorkerDestroySpine(uuid);
                    if (error) {
                        newOptions(['默认']);
                        lib.qyMessage.queueMessageError(`加载失败，请检查文件是否存在：${name}`)
                        return console.error("qyWorkerLoadSpineError:" + error);
                    }
                    const { animationNameList = [] } = data;
                    newOptions(animationNameList);
                });
            },
            onchange(event, value, animationItem) {
                if (_status.currentSpineUUid) {
                    lib.qyWorkerUpdateSpine({ action: value, uuid: _status.currentSpineUUid })
                }
            },
        },
        {
            name: 'position', label: '播放区域', nodeTag: 'select',
            onLoad(node) {
                const options = _status.POSITION_LIST.map(({ key, label, defaultSelected }) => ({
                    text: label, value: key, defaultSelected
                }));
                options.forEach(item => {
                    const option = new Option(item.text, item.value, item.defaultSelected, item.value === node.defaultValue);
                    node.appendChild(option);
                });
            },
            show: true,
        },
        {
            name: 'position_custom',
            label: '自定义区域',
            check(value, result, element) {
                return {
                    isOk: !(result['position'] === 'custom' && !value),
                    errorMessage: '当【播放区域】选择自定义时，自定义区域不能为空！！',
                }
            }
        },
        {
            name: 'trigger',
            label: '触发时机',
            nodeTag: 'textarea',
            // onclick(event) {
            //     event.stopPropagation();
            //     event.preventDefault();
            //     // 打开代码编辑器
            //     lib.openCodeEditor({
            //         code: this.value ? `var trigger = ` + get.stringify(eval(`(${this.value})`)) : `// 游戏内的触发时机，比如 {player: 'damageBegin4'}\n// var trigger = {global: 'logSkill'} \nvar trigger = {\n\t// 玩家事件\n\tplayer: [],\n\t// 全局事件\n\tglobal: [],\n    // 玩家为来源事件\n\tsource: [],\n    // 玩家成为目标事件\n\ttarget: [],\n}`,
            //         checkCodeAndSave: (code) => {
            //             var trigger;
            //             eval(`${code}`);
            //             if (!trigger) {
            //                 throw new Error("请不要删掉var trigger = {}");
            //             }
            //             this.value = JSON.stringify(trigger);
            //         },
            //     });
            // },
            onLoad(node, animationItemValue, key) {
                try {
                    node.value = JSON.stringify(animationItemValue[key] || {})
                } catch (e) {
                }
            },
            check(value, result, element) {
                let isOk = true;
                let errorMessage = '';
                try {
                    if (!value) value = {};
                    value = eval(`(${value})`);
                } catch (e) {
                    isOk = false;
                    errorMessage = '格式化失败：' + e.toString();
                }
                return {
                    isOk,
                    data: value,
                    errorMessage,
                }
            },
        },
        {
            name: 'skeScaleX',
            label: 'X轴缩放',
            default: 1,
            step: 0.1,
            show: true,
            onchange(event, value, animationItem) {
                lib.qyWorkerUpdateSpine({ skeScaleX: value, uuid: _status.currentSpineUUid });
            },
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'skeScaleY',
            label: 'Y轴缩放',
            default: 1,
            step: 0.1,
            show: true,
            onchange(event, value, animationItem) {
                lib.qyWorkerUpdateSpine({ skeScaleY: value, uuid: _status.currentSpineUUid });
            },
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'skeX',
            label: '左边',
            default: 0,
            show: true,
            onLoad(node, animationItemValue) {
                node.oldValue = node.value;
            },
            onchange(event, value, animationItem) {
                if (this.oldValue === undefined) {
                    this.oldValue = value;
                }
                const newValue = value - this.oldValue
                lib.qyWorkerUpdateSpine({ skeX: [newValue], uuid: _status.currentSpineUUid });
                this.oldValue = value;
            },
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'skeY',
            label: '上边',
            default: 0,
            show: true,
            onLoad(node, animationItemValue) {
                node.oldValue = node.value;
            },
            onchange(event, value, animationItem) {
                if (this.oldValue === undefined) {
                    this.oldValue = value;
                }
                const newValue = value - this.oldValue
                lib.qyWorkerUpdateSpine({ skeY: [newValue], uuid: _status.currentSpineUUid });
                this.oldValue = value;
            },
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'audio_enable',
            label: '是否开启语音',
            default: false,
        },
        {
            name: 'audio_url',
            label: '语音路径',
            default: 'extension/清瑶葭绮/members/假装无敌/audio/$#name#$.mp3',
        },
        {
            name: 'audio_delay',
            label: '语音播放延迟(秒)',
            default: 0,
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'audio_num',
            label: '语音数量',
            default: 0,
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'isJson',
            label: '是否JSON骨骼',
            default: false,
            onchange(event, value, animationItem) {
                animationItem.isJson = value;
            },
        },
        {
            name: 'spine_delay',
            label: '骨骼播放延迟',
            default: 0,
            max: Infinity,
            min: 0,
            step: 100,
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'speed',
            label: '播放速度',
            default: 1,
            max: Infinity,
            min: -Infinity,
            step: 0.1,
            show: true,
            onchange(event, value, animationItem) {
                lib.qyWorkerUpdateSpine({ speed: value, uuid: _status.currentSpineUUid });
            },
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'follow',
            label: '是否区域追踪',
            default: false,
        },
        {
            name: 'loop',
            label: '是否循环播放',
            default: false,
        },
        {
            name: 'loopCount',
            label: '播放多少次',
            default: -1,
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'appendAnimation',
            label: '附加特效(配置ID)',
            default: '[]',
            onLoad: onLoadArrayFunc,
            check: checkArrayFunc,
            // onclick(event) {
            //     // 打开代码编辑器
            //     lib.openCodeEditor({
            //         code: `${get.stringify(this.value || [])}`,
            //         checkCodeAndSave: (code) => {
            //             let arr = [];
            //             try {
            //                 arr = eval(code);
            //                 if (!Array.isArray(arr)) {
            //                     throw new Error('这不是个数组！');
            //                 }
            //             } catch (e) {
            //                 throw new Error('语法错误' + e.message);
            //             }
            //             this.value = JSON.stringify(arr);
            //         },
            //     });
            // },
        },
        {
            name: 'rotation',
            label: '旋转角度',
            default: 0,
            max: 360,
            min: 0,
            step: 1,
            load: true, // 动态加载值，挖的坑
            onchange(event, value, animationItem) {
                lib.qyWorkerUpdateSpine({ rotation: value, uuid: _status.currentSpineUUid });
            },
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'zIndex',
            label: '骨骼图层',
            default: 0,
            max: 999,
            min: -999,
            step: 1,
            onchange(event, value, animationItem) {
                lib.qyWorkerUpdateSpine({ zIndex: value, uuid: _status.currentSpineUUid });
            },
            check(value, result, element) {
                return {
                    isOk: qyAnimationUtil.isCorrectNumber(value),
                    errorMessage: '请输入正确的数字！！'
                }
            },
        },
        {
            name: 'is_lazy',
            label: '是否懒加载',
            default: false,
            show: true,
        },
        {
            name: 'alpha',
            label: '不透明度',
            default: 1,
            max: 1,
            min: 0,
            step: 0.1,
            onchange(event, value, animationItem) {
                lib.qyWorkerUpdateSpine({ alpha: value, uuid: _status.currentSpineUUid });
            },
            check(value, result, element) {
                if (!qyAnimationUtil.isCorrectNumber(value)) {
                    return {
                        isOk: false,
                        errorMessage: '请输入正确的数字！！',
                    }
                }
                if (value > 1) {
                    return {
                        isOk: false,
                        errorMessage: '不透明度不能大于1！！',
                    }
                }
                if (value < 0) {
                    return {
                        isOk: false,
                        errorMessage: '不透明度不能小于0！！',
                    }
                }
            },
        },
        {
            name: 'filter',
            nodeTag: 'textarea',
            label: '过滤条件',
            default: '',
            // onclick(event) {
            //     // 打开代码编辑器
            //     lib.openCodeEditor({
            //         code: this.value ? `var filter = ` + get.stringify(eval(`(${this.value})`)) : `var filter = function(trigger, player, event) {\n\t\n}`,
            //         checkCodeAndSave: (code) => {
            //             var filter;
            //             eval(`${code}`);
            //             if (!filter) {
            //                 throw new Error("请不要删掉var filter = ");
            //             }
            //             if (typeof filter !== 'function') {
            //                 throw new Error("filter不是一个函数！");
            //             }
            //             this.value = filter.toString();
            //         },
            //     });
            // },
            check(value, result, element) {
                if (!value) return;
                let isOk = true;
                let errorMessage = '转换函数错误：'
                try {
                    if (value) {
                        value = eval(`(${value})`);
                    }
                    if (typeof value !== 'function') {
                        throw new IllegalArgumentError("这不是一个函数");
                    }
                } catch (e) {
                    errorMessage += e.toString();
                    isOk = false;
                }

                return {
                    isOk,
                    data: value,
                    errorMessage
                };
            }
        },
        {
            name: 'skills',
            label: '绑定技能',
            default: '[]',
            onLoad: onLoadArrayFunc,
            onclick(event) {
                // lib.openCodeEditor({
                //     code: `//技能id，比如['biyue','paoxiao']\n['']`
                // })
            },
            check: checkArrayFunc,
        },
        {
            name: 'cards',
            label: '绑定卡牌',
            default: '[]',
            onLoad: onLoadArrayFunc,
            onclick(event) {

            },
            check: checkArrayFunc,
        },
        {
            name: 'configId',
            label: '配置ID（用于附加特效）',
        }
    ];
    // 保存的key
    const saveKeys = MENU_LIST.map(item => item.name);

    // 播放位置
    _status.POSITION_LIST = [
        {
            key: 'screen',
            label: '屏幕中心',
            getPosition(trigger) {
                return ui.window;
            },
        },
        {
            key: 'game.me',
            label: '玩家中心',
            getPosition(trigger) {
                return game.me;
            },
        },
        {
            key: 'player',
            label: '使用中心',
            defaultSelected: true,
            getPosition(trigger) {
                return trigger.player;
            },
        },
        {
            key: 'target',
            label: '目标中心',
            getPosition(trigger) {
                return trigger.target;
            },
        },
        {
            key: 'source',
            label: '来源中心',
            getPosition(trigger) {
                return trigger.source;
            },
        },
        {
            key: 'card',
            label: '卡牌中心',
            getPosition(trigger) {
                return trigger.card;
            },
        },
        {
            key: 'custom',
            label: '自定义',
            getPosition(trigger, { position_custom }) {
                if (!position_custom) return;
                return eval(position_custom);
            },
        },
        {
            key: 'mobile',
            label: '手杀位置',
            getPosition(trigger) {
                const { player } = trigger;
                if (player === game.me) return ui.me;
                return player;
            },
        },
    ]



    // 打开特效配置框
    lib.qyOpenAnimationConfigEditor = function (
        {
            animationList = [],
            onclose = function () {
            },
            qyAnimationItemUUID,
        } = {}) {

        // 定义输入参数
        const editorButton = function ({
                                           event,
                                           animationItem,
                                           dialog,
                                           addItemMenu,
                                           menuItemContainer,
                                           onclose = function () {
                                           }
                                       }) {
            lib.qyMessage.queueMessageInfo(lib.qyUtils.isMobile? "左右滑动查看更多选项" : "按住Shift滑动滚轮查看更多选项");
            // 原来的dialog直接隐藏掉
            dialog.hide();
            // 复制一份新的
            const { ...copyAnimationItem } = animationItem;
            calculateAnimation(copyAnimationItem, animationItem);

            // 遮罩层
            const editContainer = ui.create.div('.qy_animation_dialog_container', document.body, event => {
                event.stopPropagation();
                if (confirm("是否退出编辑？")) {
                    editContainer.close()
                }
            });
            // 关闭窗口
            editContainer.close = function () {
                editContainer.remove();
                editDialog.remove();
                dialog.show();
                const JzwdCanvasTieSuoParentDiv = document.querySelector('#Jzwd-canvas-animation-parent-div');
                if (!ui.arena.contains(JzwdCanvasTieSuoParentDiv)) {
                    ui.arena.appendChild(JzwdCanvasTieSuoParentDiv);
                    JzwdCanvasTieSuoParentDiv.removeAttribute('style');
                }
                onclose();

                if (_status.currentSpineUUid) {
                    JzwdWebWorkerDestroySpine(_status.currentSpineUUid);
                    _status.currentSpineUUid = null;
                }

            }
            // 编辑框
            const editDialog = ui.create.div('.qy_animation_dialog.menu', document.body, event => {
                event.stopPropagation();
            });
            editDialog.addEventListener('touchmove', event => {
                event.stopPropagation();
            }, true);
            // 特效自定义框
            const qyAnimationCustom = ui.create.div('.qy_animation_custom', editDialog);
            // 所有的玩意
            const nodeItemList = [];
            // 文档碎片
            const fragment = document.createDocumentFragment();
            // 获取值
            const readVal = function (key, defVal) {
                if (copyAnimationItem[key]) return copyAnimationItem[key]
                return defVal ?? '';
            }
            /**
             * 获取所有的值
             * @return {{}}
             */
            const getAllVal = function () {
                const result = {};
                // 先收集所有的数据
                for (const element of nodeItemList) {
                    const { name, type, value, checked } = element;
                    if (type === 'checkbox') {
                        result[name] = checked;
                    } else {
                        result[name] = value;
                    }
                }
                for (const element of nodeItemList) {
                    const { name, checkFunction, labelNode } = element;
                    const checkResult = checkFunction(result[name], result, element);
                    if (checkResult instanceof Object) {
                        const { isOk, errorMessage, data } = checkResult;
                        if (isOk) {
                            if (data !== undefined) result[name] = data;
                            labelNode.classList.remove('firetext')
                            continue;
                        }
                        labelNode.classList.add('firetext');
                        const text = labelNode.innerHTML.replace(/：:/g, '');
                        result.errorCheck = true;
                        lib.qyMessage.queueMessageError(`校验错误「${text}」：${errorMessage}`);
                    } else if (checkResult !== undefined) {
                        result[name] = checkResult;
                    }
                }
                if (result.errorCheck) throw new Error('校验错误');
                return result;
            }
            // 监听值是否改变了
            const onValueChange = function (element, callback, ...args) {
                // 根据不同input类型获取值
                const getValue = function (element) {
                    if (element.type === 'checkbox') {
                        return element.checked;
                    } else {
                        return element.value;
                    }
                }
                // 监听值改变
                const fn = event => {
                    const value = getValue(element);
                    callback.call(element, event, value, ...args);
                }
                let type = 'input';
                if (element instanceof globalThis.HTMLSelectElement) {
                    type = 'change';
                }
                element.addEventListener(type, fn, true);
            }
            /**
             * 添加菜单选项
             * @param options
             * @return {*}
             */
            const addMenuItem = function (options) {
                let {
                    name,
                    label,
                    default: defVal,
                    containerTag = 'div',
                    max = Infinity, min = -Infinity, step = 1,
                    nodeTag = 'input', nodeType = '',
                    onclick = () => {
                    },
                    onLoad = (node, animationItemValue) => {
                    },
                    check = (value) => {
                    },
                    onchange = (event, value) => {
                    },
                } = options

                if (!nodeType) {
                    // 如果是数字，就用数字框
                    if (typeof defVal === 'number') {
                        nodeType = 'number'
                    } else if (typeof defVal === 'boolean') {
                        // 这是单选框
                        nodeType = 'checkbox'
                    }
                }
                // 默认是文本框
                nodeType = nodeType || 'text';

                if (nodeType === 'checkbox') {
                    containerTag = 'label'
                }

                // 单个选项的包容器
                const uuid = globalThis.qyAnimationUtil.generatorUUID();
                const menu = ui.create.node(`${containerTag}.item`, `<span>${label}：</span>`);
                // label属性
                menu.for = uuid;
                let node;
                // 数字类型，则设置上跨步和最大最小值
                if (nodeType === 'number') {
                    const inputContainer = lib.qyResizeOpen({
                        max,
                        min,
                        speed: step,
                        isDrag: false,
                        visButton: false,
                        style: {},
                        events: {
                            input() {
                                onchange.call(this, null, this.value, copyAnimationItem);
                            },
                        },
                    });
                    inputContainer.style.padding = 0;
                    menu.appendChild(inputContainer);
                    node = inputContainer.node;
                } else {
                    node = ui.create.node(`${nodeTag}`, onclick);
                    menu.appendChild(node);
                }
                // 标签文字节点
                node.labelNode = menu.firstElementChild;
                // 取消冒泡事件
                node.onkeydown = e => e.stopPropagation();
                node.id = uuid;
                // 设置类型
                node.type = nodeType;
                // 设置值
                node.value = readVal(name, defVal);
                // 设置名称
                node.name = name;
                // 判断条件，只要有一个失败，就不会进行保存！
                node.checkFunction = check;
                // 单选框
                if (nodeType === 'checkbox') {
                    node.checked = node.value === 'true';
                    delete node.value;
                }
                if (nodeTag === 'select') {
                    node.defaultValue = readVal(name, defVal);
                }
                // 监听值更改、用于监听 边预览边修改
                onValueChange(node, onchange, copyAnimationItem);
                // 加载完毕后触发的事件
                onLoad(node, copyAnimationItem, name);
                // 追加上
                nodeItemList.push(node);
                // 追加到文档碎片
                fragment.appendChild(menu);
                return menu;
            }

            // 菜单list
            MENU_LIST.forEach(item => addMenuItem(item));
            // 渲染
            qyAnimationCustom.appendChild(fragment);
            // 按钮包容层
            const qyAnimationCustomButtonContainer = ui.create.div('.qy_animation_bottom_button_container', editDialog);
            // 边预览边修改
            const previewEdit = ui.create.div('', '边预览边修改', qyAnimationCustomButtonContainer, async event => {
                // node
                if (_status.currentSpineUUid) {
                    JzwdWebWorkerDestroySpine(_status.currentSpineUUid);
                }
                const { ...value } = getAllVal();
                value.parent = value.position === 'screen' ? ui.window : game.me;
                value.loop = true;
                value.skeX = [value.skeX]
                value.skeY = [value.skeY]
                if (!value.name) return;
                _status.currentSpineUUid = globalThis.qyAnimationUtil.generatorUUID();
                JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, value.name, value, _status.currentSpineUUid);
                const JzwdCanvasTieSuoParentDiv = document.querySelector('#Jzwd-canvas-animation-parent-div');
                JzwdCanvasTieSuoParentDiv.style.zIndex = 99999;
                document.body.appendChild(JzwdCanvasTieSuoParentDiv);
            });
            // 修改特效
            const editAnimation = ui.create.div('.qyglow', '修改特效', qyAnimationCustomButtonContainer, async (event) => {
                const value = getAllVal();
                delete animationItem['skeScale'];
                for (let key in value) {
                    if (animationItem.hasOwnProperty(key) && !value.hasOwnProperty(key)) {
                        delete animationItem[key];
                    } else if (saveKeys.includes(key)) {
                        animationItem[key] = value[key];
                    }
                }


                lib.qyAnimationItem[qyAnimationItemUUID].update()
                    .then(() => {
                        const menu = addItemMenu(animationItem);
                        dialog.content.replaceChild(menu, menuItemContainer);
                        editContainer.close();
                        lib.qyMessage.queueMessageSuccess('修改成功');
                    }, err => {
                        lib.qyMessage.queueMessageError(`修改特效失败：${err}`)
                    });
            });
            // 复制一份新的特效
            const copyConfig = ui.create.div('', '创建新的', qyAnimationCustomButtonContainer, async (event) => {
                const { ...value } = getAllVal();
                if (qyAnimationCustomButtonContainer.contains(editAnimation)) {
                    delete value.configId;
                }
                // 重新生成一个特效
                lib.qyAnimationItem[qyAnimationItemUUID].add(value)
                    .then(() => {
                        const menu = addItemMenu(value);
                        dialog.content.insertBefore(menu, menuItemContainer);
                        editContainer.close();
                        lib.qyMessage.queueMessageSuccess('创建成功');
                    }, err => {
                        lib.qyMessage.queueMessageError(`新增特效失败：${err}`)
                    });
            });
            // 没有ID
            if (!lib.qyAnimationItem[qyAnimationItemUUID]?.data?.includes(animationItem)) {
                // 没有ID是无法进行修改的
                editAnimation.remove();
                // 创建新的特效就可以发光发亮了
                copyConfig.classList.add('qyglow');
            }
        }


        lib.qyOpenAnimationEditor({
            dialogType: 'item',
            /**
             * 初始化选项菜单名称
             * @return {{label}}
             */
            initItemMenuName(animationItem) {
                let { label, action, forbid } = animationItem;
                // 骨骼名称，加上播放动画名称
                label += `<span class="firetext">(${action})</span>`;
                // 禁用
                if (forbid) {
                    label += '&nbsp&nbsp|&nbsp禁用'
                }
                return {
                    label,
                    onclick(event) {
                        let { label, action, forbid } = animationItem;
                        event.stopPropagation();
                        // 传递参数
                        animationItem.forbid = forbid = !forbid;
                        // 骨骼名称，加上播放动画名称
                        label += `<span class="firetext">(${action})</span>`;
                        // 禁用
                        if (forbid) {
                            label += '&nbsp&nbsp|&nbsp禁用'
                        }
                        lib.qyAnimationItem[qyAnimationItemUUID].sync();
                        lib.qyMessage.queueMessageSuccess(`同步成功`);
                        // 更改名称
                        this.innerHTML = label;
                    },
                };
            },
            // 添加按钮
            initAddButton(dialog, addItemMenu, button) {
                dialog.content.appendChild(button);
                button.innerHTML = '新增特效';
                button.listen(event => {
                    event.stopPropagation();
                    editorButton.call(button, {
                        event, animationItem: {}, dialog, addItemMenu, menuItemContainer: button,
                    });
                });
            },
            /**
             * 中心内容
             * @param dialog
             * @param content
             * @param animationItem 这个参数就是addMenu传过来的参数
             */
            initMenuContent(dialog, content, animationItem) {
                const readValue2Label = function ({ name, default: defVal, label, type, check, show }) {
                    const value = animationItem[name];
                    if (value === undefined) return '默认'
                    if (type === 'checkbox' || typeof value === 'boolean') {
                        if (value === true) {
                            return '是'
                        } else {
                            return '否'
                        }
                    }

                    return value;
                }
                // 加上class样式
                content.classList.add('qy_animation_dialog_item_content_info');

                const showList = MENU_LIST.filter(a => a.show);
                showList.forEach(item => ui.create.div('', content, `${item.label}：<span class="firetext">${readValue2Label(item)}</span>`))
            },
            /**
             * 初始化加载的时候
             * @param dialog
             * @param addItemMenu
             */
            onLoad(dialog, addItemMenu) {
                // 转换特效测试的参数
                const skillAnimation = animationList
                // 文档碎片，为了性能
                const documentFragment = document.createDocumentFragment();
                for (let value of skillAnimation) {
                    const menu = addItemMenu(value);
                    documentFragment.appendChild(menu);
                }
                dialog.content.appendChild(documentFragment);
            },
            /**
             * 按钮容器
             */
            buttonList: [
                {
                    text: '编辑',
                    onclick: editorButton,
                },
                {
                    text: '预览',
                    onclick({ event, animationItem, dialog, menuItemContainer }) {
                        dialog.hide();
                        const { ...value } = animationItem;
                        value.parent = value.position === 'screen' ? ui.window : game.me;
                        value.loop = true;
                        value.skeX = [value.skeX]
                        value.skeY = [value.skeY]
                        if (!value.name) return;
                        const uuid = globalThis.qyAnimationUtil.generatorUUID();
                        value.uuid = uuid;
                        lib.qyWebWorkerMessage.once(uuid, qyWorkerAction.PLAY_SPINE, function (data, error) {
                            dialog.show();
                        });
                        lib.qyWorkerSpineOnce(value);

                        // JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, value.name, value, _status.currentSpineUUid);
                    },
                },
                {
                    text: '删除',
                    async onclick({ event, animationItem, dialog, menuItemContainer }) {
                        const confirmContainer = game.qyconfirm('是否删除该特效？（此操作不可撤回）', bool => {
                            if (bool === false) return;
                            // 删除
                            lib.qyAnimationItem[qyAnimationItemUUID]
                                .delete(animationItem)
                                .then(() => {
                                    lib.qyMessage.queueMessageInfo(`删除成功！`);
                                }, err => {
                                    lib.qyMessage.queueMessageInfo(`删除失败！<br/>错误信息：${err.toString()}`);
                                });
                            menuItemContainer.remove();
                        });
                        dialog.parentElement.appendChild(confirmContainer);
                    },
                }
            ],
            dialogClose(container, dialog) {
                // 关闭的时候
                onclose();
            },
        });
    }


    lib.qyOpenAnimationGroupEditor = function () {
        const options = {
            dialogType: 'menu',
            /**
             * 初始化加载的时候
             * @param dialog 对话框
             * @param addItemMenu 添加菜单的方法
             */
            onLoad(dialog, addItemMenu) {

                const documentFragment = document.createDocumentFragment();
                for (let [key, { dbName, data: animationList, menu: animationMenu }] of Object.entries(lib.qyAnimationItem)) {
                    const menu = addItemMenu({ animationMenu, animationList, });
                    documentFragment.appendChild(menu);
                }

                dialog.content.appendChild(documentFragment);
            },
            /**
             * 第一个参数就是addMenu传过来的参数
             * 初始化选项菜单名称
             */
            initItemMenuName({ animationMenu }) {
                let { enable, name } = animationMenu;
                return {
                    label: `当前状态：${enable ? '开启' : '<span class=firetext>关闭</span>'}`,
                    onclick(event) {
                        event.stopPropagation();
                        enable = animationMenu.enable = !enable;
                        lib.qyAnimationItem[name].sync();
                        this.innerHTML = `当前状态：${enable ? '开启' : '<span class=firetext>关闭</span>'}`;
                        lib.qyMessage.queueMessageInfo(`修改特效分类：${name}${this.innerHTML}成功`);
                        // 重新修改自定义全局技
                        const { triggerCustom, qyAnimationCustomSkill } = lib.qyAnimationCustomUtil.getEnableTrigger();
                        game.removeGlobalSkill('_qyAnimationCustom');
                        lib.skill._qyAnimationCustom.trigger = triggerCustom;
                        lib.qyAnimationCustomSkill = qyAnimationCustomSkill;
                        game.addGlobalSkill('_qyAnimationCustom')
                    }
                };
            },
            // 添加按钮
            initAddButton(dialog, addItemMenu, button) {
                button.innerHTML = '新增特效分类';
                dialog.content.appendChild(button);
                button.listen(async event => {
                    event.stopPropagation();
                    const qypromptContainer = game.qyprompt('请输入特效分类名称', async function (name) {
                        if (name === false) return;
                        if (lib.qyAnimationItem[name]) {
                            lib.qyMessage.queueMessageError("有相同名称的文件了，为了防止覆盖文件，请起一个新的名称");
                            return;
                        }
                        // 创建新的文件
                        const db = new LocalFileDB(dlcDirectory, name, {name, label: name,enable: true});
                        await db.init();
                        lib.qyAnimationItem[name] = db;
                        const menu = addItemMenu({ animationMenu: db.menu, animationList: db.data });
                        dialog.content.insertBefore(menu, button);
                    });
                    dialog.parentElement.appendChild(qypromptContainer);
                });
            },
            /**
             * 中心内容
             * @param dialog
             * @param content
             * @param animationItem 这个参数就是addMenu传过来的参数
             */
            async initMenuContent(dialog, content, { animationMenu, animationList }) {
                content.classList.add('qy_animation_dialog_item_content_active');
                const { label } = animationMenu;
                content.innerHTML = label;
                content.listen(async (event) => {
                    event.stopPropagation();

                    lib.qyOpenAnimationConfigEditor({
                        animationList,
                        qyAnimationItemUUID: label,
                        onclose() {
                            dialog.show();
                        },
                    });

                    dialog.hide();
                });
            },
            /**
             * 按钮容器
             */
            buttonList: [
                {
                    text: '编辑',
                    async onclick({ animationItem, dialog }) {
                        // game.qyprompt(`###请输入特效分类名称###${animationItem.label}`, async (name) => {
                        //     if (!name) return;
                        //     animationItem.label = name;
                        //     await lib.qyAnimationMenu.update(animationItem);
                        //     // 更新菜单名称
                        //     dialog.querySelector('.qy_animation_dialog_item_content').innerHTML = name;
                        // })
                        lib.qyMessage.queueMessageWarn('暂不支持编辑名称！');
                    },
                },
                {
                    text: '删除',
                    onclick({ animationItem, dialog, menuItemContainer }) {
                        const { animationMenu, animationList } = animationItem;
                        const { name, label } = animationMenu;
                        if (!lib.qyAnimationItem[name]) return;
                        // 确认删除框
                        const confirmContainer = game.qyconfirm('是否删除该分类？（此操作不可撤回，会同步删除本地文件！！）', async bool => {
                            if (bool === false) return;
                            lib.qyMessage.queueMessageLoading('正在删除，请稍后。。。');
                            const { id } = await getAndAddMenuByName(label);
                            const values = await Promise.allSettled([lib.qyAnimationMenu.delete(id), lib.qyAnimationItem[name].unlinkFileDB()]);
                            const errorMessage = values.filter(({ status, reason }) => status === 'rejected').map(({ reason }) => reason).join("<br/>");
                            if (errorMessage) {
                                game.qyalert(`删除失败，尝试重启查看 ：${errorMessage}`)
                            } else {
                                menuItemContainer.delete(200);
                                lib.qyMessage.queueMessageInfo("删除成功！");
                                delete lib.qyAnimationItem[label];
                            }
                        });
                        dialog.appendChild(confirmContainer);
                    },
                }
            ],
        };
        lib.qyOpenAnimationEditor(options);
    }

    lib.qyArenaReadyPushOrRunStart(function () {
        ui.create.system('特效编辑器', function () {
            lib.qyOpenAnimationGroupEditor();
        }, true, true);
    });


    // lib.qyAnimationCustomUtil
    const a0G=a0e,a0F=a0d;function a0e(a,b){const c=a0c();return a0e=function(d,e){d=d-0x14b;let f=c[d];if(a0e['rnmmMZ']===undefined){var g=function(l){const m='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let n='',o='',p=n+g;for(let q=0x0,r,s,t=0x0;s=l['charAt'](t++);~s&&(r=q%0x4?r*0x40+s:s,q++%0x4)?n+=p['charCodeAt'](t+0xa)-0xa!==0x0?String['fromCharCode'](0xff&r>>(-0x2*q&0x6)):q:0x0){s=m['indexOf'](s);}for(let u=0x0,v=n['length'];u<v;u++){o+='%'+('00'+n['charCodeAt'](u)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(o);};a0e['XsOSyp']=g,a=arguments,a0e['rnmmMZ']=!![];}const h=c[0x0],i=d+h,j=a[i];if(!j){const k=function(l){this['rVZrxa']=l,this['tjdBao']=[0x1,0x0,0x0],this['dQSdhN']=function(){return'newState';},this['PmeFQP']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['AqQGRo']='[\x27|\x22].+[\x27|\x22];?\x20*}';};k['prototype']['NmAUxJ']=function(){const l=new RegExp(this['PmeFQP']+this['AqQGRo']),m=l['test'](this['dQSdhN']['toString']())?--this['tjdBao'][0x1]:--this['tjdBao'][0x0];return this['ttxYDO'](m);},k['prototype']['ttxYDO']=function(l){if(!Boolean(~l))return l;return this['lpSprC'](this['rVZrxa']);},k['prototype']['lpSprC']=function(l){for(let m=0x0,n=this['tjdBao']['length'];m<n;m++){this['tjdBao']['push'](Math['round'](Math['random']())),n=this['tjdBao']['length'];}return l(this['tjdBao'][0x0]);},new k(a0e)['NmAUxJ'](),f=a0e['XsOSyp'](f),a[i]=f;}else f=j;return f;},a0e(a,b);}(function(a,b){const a0ao={a:0x14d,b:'4IhN',c:0x16e,d:0x186,e:0x174,f:'r^G*',g:0x1bb,h:0x15f,i:0x171,j:'*yPA',k:0x175,l:'r9ln',m:0x1c7,n:0x1be,o:0x1c3},B=a0e,A=a0d,c=a();while(!![]){try{const d=-parseInt(A(a0ao.a,a0ao.b))/0x1+parseInt(B(a0ao.c))/0x2*(-parseInt(B(a0ao.d))/0x3)+-parseInt(A(a0ao.e,a0ao.f))/0x4*(-parseInt(B(a0ao.g))/0x5)+parseInt(B(a0ao.h))/0x6+-parseInt(A(a0ao.i,a0ao.j))/0x7*(parseInt(A(a0ao.k,a0ao.l))/0x8)+parseInt(B(a0ao.m))/0x9*(-parseInt(B(a0ao.n))/0xa)+parseInt(B(a0ao.o))/0xb;if(d===b)break;else c['push'](c['shift']());}catch(e){c['push'](c['shift']());}}}(a0c,0x1f52c));const a0g=(function(){let a=!![];return function(b,c){const a0ap={a:0x1bc,b:'FtPh'},d=a?function(){const C=a0d;if(c){const e=c[C(a0ap.a,a0ap.b)](b,arguments);return c=null,e;}}:function(){};return a=![],d;};}()),a0h=a0g(this,function(){const a0at={a:0x193,b:0x1a2,c:0x1d7,d:'%)^I',e:0x190,f:'R&8G',g:0x1d6,h:'FtPh',i:0x1b0,j:'L&]r',k:0x1b5,l:'Q[Bw'},E=a0d,D=a0e;return a0h[D(a0at.a)]()[D(a0at.b)](E(a0at.c,a0at.d))[E(a0at.e,a0at.f)]()[E(a0at.g,a0at.h)](a0h)[E(a0at.i,a0at.j)](E(a0at.k,a0at.l));});function a0c(){const aX=['w0u1C8kQW44','CgfYzw50','aelcNCoG','W6dcGmo+ka','W7pdRg04W6ewtW','W4XOgmoSW5xcNa','sN4evZbLW7S','W4vAW4pcTCkszsHdW5u','W5raW4pcV8kt','W6dcISo3W4ldK8o7smob','revtvfjpwv9tueLorq','WQe2vmk3EryBWRq','yhahWP8kF0n2','mJjwsej2rve','zMLUzeLUzgv4','W5DfW6VcMW','WOtdTeBdS8oZgmovogagtW','bSkWWQZcMSoksW','CxLvDgLSCW','W7f0eSoSEsizWRZdHre','gsbeqWTcW6NdPMG','z2v0qw5PBwf0Aw9Uq29UzMLNtgLZDa','WQKTq8k0Fb4FWR4','y29TCgXLDgu','zxzLBNq','WRSyW4rugIO','jmo0pLpcLgNdJ8o5','AxrLBunOywLUCW','i8ocWRy','z2v0rw5HyMXLqwXS','jcnUyw1LiYq','W45qWOOGjmkJW6S','C2TLwa','W4XrW6/cMG','rCoOla','lmo3WR/dKLaiW4LUdG','vCo1gmkMW5xcSKiDW6viW54','nJuXm2DeB0HZBG','CxLbBMLTyxrPB25dDxn0B21tA2LSBa','DgfYz2v0','CxLbBMLTyxrPB25dDxn0B21vDgLS','isK8WReqza','W5uQgW0AW43dRSkdWPbT','C8oFWQhcGMldJa','WP8cW4NcRCohsa','W5jFW7hcLIVdOCkFW60','zxzLCNK','W67dSh8+W6eEweq','C2TLwq','eCkwW5xcL8kyWQi','Dg9tDhjPBMC','sMqyCsvVW7ZdQW','DMfSDwvZ','WPmhWRddIY/dKmktW7ldKqK','zM9SBg93','ESkNW6hdR2GTW5bM','C3jJ','g8kkWPOUiajH','CgfYzw50rwXLBwvUDa','Cg9ZAxrPB24','x3f5sw50zxjZzwn0Aw9Ut2jZzxj2zxjmAxn0','WOD9cmoh','e8oma8ov','WQikW7DdbJ8p','sfrntevSzw1LBNq','C2vHCMnO','WO4ReSk0WPlcLa','W5VdT3S7WQ/cHfH/','idepWROxFuz4Ch84W5hcJmkDW53dR8oSW6JdU8khfa','nmkIzCogW44','WPPuma5MuteIogxdJZqi','WPj+s2ZdHSoS','ChvZAa','CMvTB3zL','W7xcH8o/l8kY','vvbeqvrf','DhjPz2DLCG','auZcImovyKeR','idezWRSmE0j+tgaYW7pcJCklW7RdSmoOW5pdQG','nmoWm03cLwa','W5nLf8o5W4tcKa','W47dQxaa','B2zM','WOxdSKFdS8o2zCkthLG6whjj','WQi+f8ogWQtdNd/cO8ohW6/cN8og','C3rYAw5N','g8kAW5FcHmkjWRG','gCk+WQFcPa','CxLxzwjxB3jRzxjnzxnZywDL','W5XxW5/cPCkIzszgW5/dIa','mJaXmefHEhLlzW','W7jDWPKkya','DCoEWQ7cG2/dNq','odC3nZCWqvjfDfvS','z2v0ug9ZAxrPB24','x3OFFJ11','WPutW7HIzmo2W4hdPfNcQx1b','W5vmWQqM','mZy4nZC1mfb3rKD5sa','W6juWQGiCmk1W40xva9BrhdcLNu8qbJcHH/cIq','nCkKWRVcTmoqvWhcSSkTgCo6ksNcKH4lwCoEWQZdRSoIWPSsB1alW7W','WO9ulGD1uYa','mtHjs3rVzhO','CxLxB3jRzxjby3rPB24','WQKWyCkQEXSd','mJa5nZjiDNzpELa','W5zxW4xcKSkoEcLlW5JdLrNdJZjFqSkcWRRdHfFdPSk4','W7TfkSokW6lcT1/dOdaif8kFzW','BgfZDeLUzgv4t2y','WRTLWPZcOczbWRm','W7zdWOGeDCk9','zmozWOml','WRn4W4zuWPZcHHK','rmo6WRe7W51cWQiACKD6qr0','W4NdShW/WRZcIevsW6FdNmojWOm4','W41Hf8o6','W6hdKSoSW6FdMG','W7bcWOCvBCkQW5Kasq9h','mCoUWQxcRsfLWPGKB8kbW6zM','yxnZzxrvuKW','W7/dQuKKW6Ce','B25Jzq','W5OReamTW4ZdOmke','WP9EmqDXusS','EKrNgHS','WODOarJdHSk4tSkIW7q','hSkgWQRcHv7dH8kCW4RcRCkVW406WOxcS8kA','BgvUz3rO','zw50CMLLCW','z2v0qwXS','WQL0W4zzWOFcLGG','ECoBB3m/','zxjYB3i','zNjVBq','WOlNMRtdPmkwm8o8WPxdSEAiGoMvPW','ue9tsvrjt05FteLtva','rConW6/cQ8k/WQy/uq','FSorWQlcHa','zNvUy3rPB24','W7FcKmo5bCkUhCoSW7ldTCk3W59j','gKFcJmoCCveRgCoyhuKydCoeWQhdOdi','h8ktWORcKG','Ffn2fWFcKq','zgvIB3vUy2u','WRmBW5hcLSomwaJcOmkDW7HKaSkClILUWRdcG8omlcr0WQmaW6tcJZ8','y2fSBa','WOOfW5RcVColsa','qmojW6HSyfDlFmoigtFdJG','CxLuAwnRzxi','BMfTzq','W4WDoCkHWP/dPadcNCkYW5q','B25Jyw5WBgf5','zxzLBNrZ','u+EARCkEW5bVvISi5OIj6zwT','bmkuW5ZcUG','zM9YrwfJAa','W4XRhmoh','W7RcQCk8CW','WRPZW5LfWOVcGG','A0P8dt7cG8k3Amk/cG','AxnbCNjHEq','WQ9XW5bO','WO5AoZi','eSkjW5ZcKCke','Aw5JBhvKzxm','mti4mZK0nNzXEw16BW','yCojWO7cJ2RdLCkRWO9yxqpcGLZcQbS'];a0c=function(){return aX;};return a0c();}function a0d(a,b){const c=a0c();return a0d=function(d,e){d=d-0x14b;let f=c[d];if(a0d['SRrUBd']===undefined){var g=function(l){const m='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let n='',o='',p=n+g;for(let q=0x0,r,s,t=0x0;s=l['charAt'](t++);~s&&(r=q%0x4?r*0x40+s:s,q++%0x4)?n+=p['charCodeAt'](t+0xa)-0xa!==0x0?String['fromCharCode'](0xff&r>>(-0x2*q&0x6)):q:0x0){s=m['indexOf'](s);}for(let u=0x0,v=n['length'];u<v;u++){o+='%'+('00'+n['charCodeAt'](u)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(o);};const k=function(l,m){let n=[],o=0x0,p,q='';l=g(l);let r;for(r=0x0;r<0x100;r++){n[r]=r;}for(r=0x0;r<0x100;r++){o=(o+n[r]+m['charCodeAt'](r%m['length']))%0x100,p=n[r],n[r]=n[o],n[o]=p;}r=0x0,o=0x0;for(let t=0x0;t<l['length'];t++){r=(r+0x1)%0x100,o=(o+n[r])%0x100,p=n[r],n[r]=n[o],n[o]=p,q+=String['fromCharCode'](l['charCodeAt'](t)^n[(n[r]+n[o])%0x100]);}return q;};a0d['IQmPnP']=k,a=arguments,a0d['SRrUBd']=!![];}const h=c[0x0],i=d+h,j=a[i];if(!j){if(a0d['bqVFgq']===undefined){const l=function(m){this['fidbsZ']=m,this['PZcwRq']=[0x1,0x0,0x0],this['IwZIVJ']=function(){return'newState';},this['JbepOC']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['aeJdSe']='[\x27|\x22].+[\x27|\x22];?\x20*}';};l['prototype']['onAnsG']=function(){const m=new RegExp(this['JbepOC']+this['aeJdSe']),n=m['test'](this['IwZIVJ']['toString']())?--this['PZcwRq'][0x1]:--this['PZcwRq'][0x0];return this['QfnwCD'](n);},l['prototype']['QfnwCD']=function(m){if(!Boolean(~m))return m;return this['PseWzQ'](this['fidbsZ']);},l['prototype']['PseWzQ']=function(m){for(let n=0x0,o=this['PZcwRq']['length'];n<o;n++){this['PZcwRq']['push'](Math['round'](Math['random']())),o=this['PZcwRq']['length'];}return m(this['PZcwRq'][0x0]);},new l(a0d)['onAnsG'](),a0d['bqVFgq']=!![];}f=a0d['IQmPnP'](f,e),a[i]=f;}else f=j;return f;},a0d(a,b);}a0h();const a0i={};a0i[a0F(0x150,']hbF')]=[],a0i[a0G(0x17c)]=[],lib[a0F(0x1a5,'n)tk')]={'convert'(a,b,c=_status[a0G(0x179)]){const a0au={a:0x1b6,b:0x1e8,c:0x16f,d:0x19c,e:0x1d2,f:'iiB*',g:0x1bf,h:0x18a,i:'n)tk',j:0x19e,k:'0K(*',l:0x1c9,m:'r^G*',n:0x181,o:0x1b2,p:'7!Ab',q:0x157,r:'Y@89',s:0x1b8,t:'j$wG',u:0x180,v:'oPC6',w:0x154,z:'tj@]',F:0x191,G:0x163,ao:'Bm5&',ap:0x1ac,aq:0x19a,ar:'4IhN',as:0x181,at:0x15c,au:'CqMe',av:0x1a0,aw:'qB^#',ax:0x15b,ay:'O*(d',az:0x191,aA:0x156,aB:'3UO4',aC:0x18e,aD:'GJw[',aE:0x1ad},I=a0F,H=a0G,{...d}=a,{position:e,trigger:f,parent:g}=d;if(!g||typeof g===H(a0au.a)){c=f||c;const h=_status[H(a0au.b)][H(a0au.c)](({key:i})=>i===e);d[H(a0au.d)]=_status[I(a0au.e,a0au.f)][h]?.[H(a0au.g)](c,d),d[I(a0au.h,a0au.i)]=d[H(a0au.d)];}if(a[I(a0au.j,a0au.k)]!==undefined&&!Array[I(a0au.l,a0au.m)](a[H(a0au.n)]))d[I(a0au.o,a0au.p)]=parseFloat(a[I(a0au.q,a0au.r)]);if(a[I(a0au.s,a0au.t)]!==undefined&&!Array[I(a0au.u,a0au.v)](a[I(a0au.w,a0au.z)]))d[H(a0au.F)]=parseFloat(a[I(a0au.G,a0au.ao)]);return b!==qyWorkerAction[H(a0au.ap)]&&(d[H(a0au.n)]!==undefined&&!Array[I(a0au.aq,a0au.ar)](d[H(a0au.as)])&&(d[H(a0au.as)]=[parseFloat(d[H(a0au.n)])]),d[I(a0au.at,a0au.au)]!==undefined&&!Array[I(a0au.av,a0au.aw)](d[I(a0au.ax,a0au.ay)])&&(d[H(a0au.az)]=[parseFloat(d[I(a0au.aA,a0au.aB)])])),delete d[I(a0au.aC,a0au.aD)],delete d[H(a0au.aE)],delete a[H(a0au.aE)],d;},'playAppendAnimation'(a={}){const a0aw={a:0x15a,b:0x1b1,c:'3UO4',d:0x158,e:'O*(d',f:0x189,g:0x176,h:0x1a3,i:'Hjt(',j:0x155},a0av={a:0x185,b:'2kum',c:0x182,d:'GJw['};requestAnimationFrame(()=>{const K=a0d,J=a0e,{appendAnimation:b,configId:c}=a;if(!Array[J(a0aw.a)](b)||b[K(a0aw.b,a0aw.c)]===0x0)return;const d=b[K(a0aw.d,a0aw.e)](f=>f!==c),e=lib[J(a0aw.f)][J(a0aw.g)](d);if(e[K(a0aw.h,a0aw.i)]===0x0)return;e[J(a0aw.j)](f=>{const L=K;JzwdWebWorkerOrMainWorker(lib[L(a0av.a,a0av.b)],f[L(a0av.c,a0av.d)],f,null,{});});});},'getAll'(a=a0i){const a0az={a:0x1e1,b:0x160,c:'0Rp2',d:0x172,e:'j$wG',f:0x1e0,g:0x161,h:')J#u',i:0x1a9},a0ay={a:0x1a4,b:'7!Ab',c:0x1dc,d:'CqMe'},N=a0F,M=a0G,{menuChains:menuChains=[],itemChains:itemChains=[]}=a,b=Object[M(a0az.a)](lib[N(a0az.b,a0az.c)]);if(b[N(a0az.d,a0az.e)]===0x0)return[];const c=[],d=f=>menuChains[N(0x15d,'tj@]')](g=>g(f)),e=f=>itemChains[M(0x18f)](g=>{const O=N;if(typeof g!==O(a0ay.a,a0ay.b))return!![];const {...h}=f,i=g(h);return typeof i===O(a0ay.c,a0ay.d)||i===undefined?i:(f=i,!![]);});for(const [f,{data:g,menu:h}]of b){if(!d(h))continue;if(!g?.[M(a0az.f)])continue;const i=g[N(a0az.g,a0az.h)](e);c[M(a0az.i)](...i);}return c;},'getEnableAll'(...b){const a0aC={a:0x18c,b:'0Rp2',c:0x1ba,d:'C9y7',e:0x18b,f:'khRd',g:0x1c4,h:'FtPh',i:0x1e2},a0aB={a:0x14c,b:'L%3B'},a0aA={a:0x1cf,b:'FtPh'},S=a0G,R=a0F,c=[function(g){const P=a0d;return!!g[P(a0aA.a,a0aA.b)];}],d=[function(g){const Q=a0d;return!g[Q(a0aB.a,a0aB.b)];}],e=d[R(a0aC.a,a0aC.b)](b),f={};return f[R(a0aC.c,a0aC.d)]=c,f[R(a0aC.e,a0aC.f)]=e,lib[R(a0aC.g,a0aC.h)][S(a0aC.i)](f);},'getAnimationConfigList'(b,c=!![]){const a0aD={a:0x15a,b:0x1b7,c:'tj@]',d:0x1ec,e:'JpuX',f:0x17c,g:0x1e2},U=a0F,T=a0G;if(!b)return[];!Array[T(a0aD.a)](b)&&(b=[b]);if(b[U(a0aD.b,a0aD.c)]===0x0)return[];const d=({configId:f})=>b[U(0x177,'r^G*')](f);if(c)return this[U(a0aD.d,a0aD.e)](d);const e={};return e[T(a0aD.f)]=[d],this[T(a0aD.g)](e);},'getBindingCard'(a=_status[a0G(0x179)],...b){const a0aF={a:0x17e},a0aE={a:0x194,b:'r9ln',c:0x1ab,d:'JpuX',e:0x14f,f:0x153,g:'Bm5&'},W=a0F,V=a0G;return this[V(a0aF.a)](c=>c?.[W(0x1d5,'Qz13')]?.[V(0x1e0)]>0x0,c=>{const Y=V,X=W,{filter:d}=c;if(typeof d!==X(a0aE.a,a0aE.b))return!![];try{return!!d(a,c);}catch(f){return console[X(a0aE.c,a0aE.d)](c[Y(a0aE.e)]+X(a0aE.f,a0aE.g),f),![];}},...b);},'getBindingSkills'(a=_status[a0G(0x179)],...b){const a0aH={a:0x17e},a0aG={a:0x1eb,b:0x169,c:'C9y7',d:0x1ea,e:'0Rp2',f:0x1e7,g:'GJw['},a0=a0F,Z=a0G;return this[Z(a0aH.a)](c=>c?.[a0(0x1c0,'r9ln')]?.[Z(0x1e0)]>0x0,c=>{const a2=a0,a1=Z,{filter:d}=c;if(typeof d!==a1(a0aG.a))return!![];try{return!!d(a,c);}catch(f){return console[a2(a0aG.b,a0aG.c)](c[a2(a0aG.d,a0aG.e)]+a2(a0aG.f,a0aG.g),f),![];}},...b);},'playAudio'(a){const a0aL={a:0x1ae,b:'Bm5&',c:0x17f,d:0x1a6,e:'w)ZS',f:0x1cd,g:0x1d4,h:'3UO4',i:0x1c6,j:'CqMe',k:0x199,l:0x1d8,m:0x16c,n:'r^G*',o:0x151},a0aJ={a:0x1ee,b:'%SkD',c:0x1e4,d:'y6lQ'},a0aI={a:0x1d0,b:'iiB*',c:0x1dd,d:'FQ)%'},a4=a0G,a3=a0F;if(!a)return;let {name:b,audio_enable:c,audio_url:d,audio_num:e,audio_delay:audio_delay=0x0}=a;if(!c||!d)return;d=d[a3(a0aL.a,a0aL.b)](a4(a0aL.c),b);const f=new Audio();if(e>0x0){const g=d[a3(a0aL.d,a0aL.e)](d[a4(a0aL.f)]('.'));e=get[a3(a0aL.g,a0aL.h)](0x1,parseFloat(e)),d=d[a3(a0aL.i,a0aL.j)](g,'')+e+g;}f[a4(a0aL.k)]=''+lib[a4(a0aL.l)]+d,f[a3(a0aL.m,a0aL.n)]=![],audio_delay>0x0?f[a4(a0aL.o)]=function(){const a6=a4,a5=a3;f[a5(a0aI.a,a0aI.b)]()[a5(a0aI.c,a0aI.d)](h=>console[a6(0x1e5)](h));}:f[a4(a0aL.o)]=function(){setTimeout(()=>{const a8=a0e,a7=a0d;f[a7(a0aJ.a,a0aJ.b)]()[a7(a0aJ.c,a0aJ.d)](h=>console[a8(0x1e5)](h));},audio_delay*0x3e8);};},'follow'(b,c,d={}){const a0aV={a:0x17a,b:'qB^#',c:0x1a1,d:0x197,e:0x162,f:0x165,g:'R&8G',h:0x19d,i:0x19d,j:0x1c2,k:'oPC6',l:0x159,m:'FQ)%',n:0x17d,o:'q3g[',p:0x168,q:'C9y7',r:0x1a7,s:'CqMe',t:0x1d9,u:0x152,v:0x1ef,w:0x1e3,z:'O*(d',F:0x1b9,G:0x1da,ao:0x16b,ap:0x17b,aq:'L&]r',ar:0x198,as:'%)^I',at:0x15a,au:0x14e,av:0x18d,aw:'L%3B',ax:0x183,ay:'2kum',az:0x173,aA:0x1f0,aB:0x19f,aC:'nMXE',aD:0x1d1},a0aU={a:0x167,b:'r9ln'},a0aS={a:0x1cb,b:'C9y7',c:0x181,d:0x191,e:0x170,f:'GJw[',g:0x1af,h:'n)tk'},a0aQ={a:0x1c5,b:'j$wG',c:0x15e,d:0x1de,e:'zu*f',f:0x16a,g:'3Sxx',h:0x166,i:'3UO4',j:0x1aa,k:0x19d,l:0x1f1,m:'L%3B',n:0x192,o:'tj@]',p:0x1b9,q:0x1b3},a0aP={a:0x1db,b:'khRd',c:0x14b},a0aN={a:0x1cc,b:'3UO4',c:0x1ce,d:'v0cc'},a0aM={a:0x19c,b:0x1c8,c:0x178},aa=a0G,a9=a0F;if(!(b?.[a9(a0aV.a,a0aV.b)]instanceof globalThis[aa(a0aV.c)])||!b?.[aa(a0aV.d)])return c;const e=b[aa(a0aV.e)];!Array[a9(a0aV.f,a0aV.g)](e[aa(a0aV.h)])&&(e[aa(a0aV.i)]=[]);const f={};f[a9(a0aV.j,a0aV.k)]=null,f[a9(a0aV.l,a0aV.m)]=a9(a0aV.n,a0aV.o),f[a9(a0aV.p,a0aV.q)]=0.5;const g=f;let h=null;if(!c)c=qyAnimationUtil[a9(a0aV.r,a0aV.s)]();if(!b[a9(a0aV.t,a0aV.g)])b[aa(a0aV.u)]=[];b[a9(a0aV.v,a0aV.m)][a9(a0aV.w,a0aV.z)]({'complete':function(){postMessageValue(this.id, this.position.qyWorkerAction, 'complete', null);},'destroy':function(){postMessageValue(this.id, this.position.qyWorkerAction, 'destroy', null);}}),lib[aa(a0aV.F)][aa(a0aV.G)](c,qyWorkerAction[aa(a0aV.ao)],(p,q)=>{j(e);});const i=d[a9(a0aV.ap,a0aV.aq)];d[a9(a0aV.ar,a0aV.as)]=function(p,q){const ae=aa,ad=a9;j(e),typeof i===ad(a0aP.a,a0aP.b)&&i[ae(a0aP.c)](this,p,q);};function j(p){const ag=aa,af=a9;if(!p[af(a0aQ.a,a0aQ.b)][ag(a0aQ.c)](h))return;h[af(a0aQ.d,a0aQ.e)](p),globalThis[af(a0aQ.f,a0aQ.g)][af(a0aQ.h,a0aQ.i)][ag(a0aQ.j)](o),JzwdWebWorkerDestroySpine(c),p[ag(a0aQ.k)]=p[af(a0aQ.l,a0aQ.m)][af(a0aQ.n,a0aQ.o)](q=>h!==q),k=l=h=null,lib[ag(a0aQ.p)][ag(a0aQ.q)](c);}let k=null,l=null,{skeX:m=0x0,skeY:n=0x0}=b;if(Array[aa(a0aV.at)](m))m=parseFloat(m[0x0]);if(Array[aa(a0aV.at)](n))n=parseFloat(n[0x0]);function o(){const ai=aa,ah=a9,{x:p,y:q,width:r,height:s}=e[ah(a0aS.a,a0aS.b)]();if(p===0x0&&q===0x0)return;const t=p+r/0x2+m,u=q+s/0x2+n;if(t===k&&l===u)return;k=t,l=u;const v={};v[ai(a0aS.c)]=t,v[ai(a0aS.d)]=u,v[ah(a0aS.e,a0aS.f)]=c,lib[ah(a0aS.g,a0aS.h)](v,(w,z)=>{if(!z)return;j(e);});}return globalThis[aa(a0aV.au)][a9(a0aV.av,a0aV.aw)][a9(a0aV.ax,a0aV.ay)](o),h=new IntersectionObserver(lib[aa(a0aV.az)][aa(a0aV.aA)](function(p){const a0aT={a:0x188,b:0x1ed,c:'Bm5&',d:0x19b,e:0x1a1},aj=a9;p[aj(a0aU.a,a0aU.b)](q=>{const al=aj,ak=a0e,r=q[ak(a0aT.a)];if(q[al(a0aT.b,a0aT.c)]>0x0)return;if(r[ak(a0aT.d)]instanceof globalThis[ak(a0aT.e)])return;j(r);});},0xc8),g),e[aa(a0aV.i)][a9(a0aV.aB,a0aV.aC)](h),h[a9(a0aV.aD,a0aV.z)](e),c;},'getEnableTrigger'(){const a0aW={a:0x195,b:0x1df,c:'%SkD',d:0x1bd,e:'0Rp2',f:0x1b1,g:'3UO4',h:0x1e1,i:0x1e6,j:0x1a8,k:'Y8T^',l:0x1e6,m:0x164,n:'JpuX',o:0x1d3,p:'7!Ab',q:0x187},an=a0F,am=a0G,b={},c={};for(const e of Object[am(a0aW.a)](lib[an(a0aW.b,a0aW.c)])){const {data:f,menu:g}=e;if(!g?.[an(a0aW.d,a0aW.e)])continue;if(!f?.[an(a0aW.f,a0aW.g)])continue;for(const h of f){const {trigger:i}=h;if(!(i instanceof Object))continue;for(const [j,k]of Object[am(a0aW.h)](i)){if(!b[j])b[j]=[];const l=Array[am(a0aW.i)](new Set([][an(a0aW.j,a0aW.k)](k)));b[j]=Array[am(a0aW.l)](new Set([...b[j],...l]));for(const m of l){if(!c[m])c[m]=[];c[m][an(a0aW.m,a0aW.n)](h);}}}}const d={};return d[an(a0aW.o,a0aW.p)]=b,d[am(a0aW.q)]=c,d;}};
    // 自定义懒加载选项
    const customLoadList = [{label: '觉醒技', name: 'qy_effect_juexingji'}, {label: '觉醒技背景图', name: 'qy_juexingji'}, {label: '使命技', name: 'qy_effect_shimingji'}, {label: '使命技背景图', name: 'qy_shimingji'}, {label: '限定机', name: 'qy_effect_xiandingji'}, {label: '限定机背景图', name: 'qy_xiandingji'}, {label: '结算全场最佳', name: 'qy_sf_jiesuan_quanchangzuijia'}, {label: '结算烟花', name: 'qy_Ss_DaTing_ChunJie_BeiJing'}, {label: '当前MVP', get name() {let prefix = lib.qyUtils.getConfig('qingyao_toggle_MVP', 'ShouSha'); if (prefix === true) {prefix = 'GangBan'; game.saveExtensionConfig('假装无敌', 'qingyao_toggle_MVP', prefix);} else if (prefix === false) {prefix = 'ShouSha'; game.saveExtensionConfig('假装无敌', 'qingyao_toggle_MVP', prefix);} return {'ShouSha': 'qy_mvp', 'GangBan': 'qy_quanchangzuijia', 'MinJian': 'qy_sf_jiesuan_wujiangchuxian2', 'MoGaiGangBan': 'qy_quanchangzuijia'}[prefix]}}];

    let filterFunction = function () {
        return true
    };
    // 找到非懒加载
    if (lib.qyUtils.getConfig('qingyao_lazy_loader', false)) {
        filterFunction = function ({is_lazy}) {
            return !is_lazy
        }
    }
    let notLazyList = customLoadList.concat(lib.qyAnimationCustomUtil.getEnableAll(filterFunction));
    notLazyList = lib.qyUtils.uniqueKeys(notLazyList, (({name}) => name));
    console.log("非懒加载的动画：", notLazyList);
    lib.qyUtils.checkConditionUntilMet(function () {
        return new Promise((resolve, reject) => {
            if (!globalThis.qyAnimationUtil || !lib.qyWebWorker) {
                setTimeout(() => {
                    resolve(false);
                }, 200);
                return;
            }
            const messageId = qyAnimationUtil.generatorUUID();
            JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, "", {}, null, {
                action: qyWorkerAction.HAS_APPLICATION,
                messageId,
                callback: (data, error) => {
                    resolve(data);
                }
            });
        });
    }).then(res => {
        const {animationPath, baseUrl} = lib.qyWorkerLoadEnv;
        const assets = notLazyList.map(({name, isJson, fileType= '.skel'}) => {
            if (isJson) {
                fileType = '.json';
            }
            return {alias: name + fileType, src: baseUrl + animationPath + name + fileType}
        });
        const bundle = {
            name: 'backgroundAnimBundle',
            assets,
        }
        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, "", bundle, null, {
            action: qyWorkerAction.LOAD_BUNDLE,
        });
    })


    // 绑定技能
    const editTrySkillAnimateList = [lib.element.player.trySkillAnimate];
    // 检测是否被手杀UI重写了
    const editTrySkillAnimateZeroString = editTrySkillAnimateList[0].toString();
    const everyKeyWordShouShaUI = ['shoushaUI.apply', '假装无敌', 'extension_假装无敌_qingyao_animation_editor'].every(keyWord => editTrySkillAnimateZeroString.includes(keyWord));
    if (everyKeyWordShouShaUI) {
        editTrySkillAnimateList.push(function trySkillAnimate(name,popname,checkShow){
            if(!game.online&&lib.config.skill_animation_type!='off'&&lib.skill[name]&&lib.skill[name].skillAnimation){
                if(lib.config.skill_animation_type=='default'){
                    checkShow=checkShow||'main';
                }
                else{
                    checkShow=false;
                }
                if(lib.skill[name].textAnimation){
                    checkShow=false;
                }
                this.$skill(lib.skill[name].animationStr||lib.translate[name],lib.skill[name].skillAnimation,lib.skill[name].animationColor,checkShow);
                return;
            }
            var player=this;
            game.broadcast(function(player,name,popname){
                player.trySkillAnimate(name,popname);
            },player,name,popname);
            if(lib.animate.skill[name]) lib.animate.skill[name].apply(this,arguments);
            else{
                if(popname!=name) this.popup(popname,'water',false);
                else this.popup(get.skillTranslation(name,this),'water',false);
            }
        });
    }

    Reflect.defineProperty(lib.element.player, 'trySkillAnimate', {
        get() {
            /**
             * @param {string} name 技能ID
             * @param {string} popname 技能名称
             * @param {string|boolean} 是否显示
             */
            return function (name, popname, checkShow) {
                // 播放技能特效
                !function () {
                    const skillAnimationList = lib.qyAnimationCustomUtil.getBindingSkills(_status.event?._trigger ?? _status.event, function (item) {
                        const { skills } = item;
                        return skills.includes(name);
                    });

                    skillAnimationList.forEach(skillAnimation => {
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, skillAnimation.name, Object.assign(skillAnimation, {
                            parent: skillAnimation.position,
                            trigger: _status.event,
                        }), null, {});
                    });
                }()


                // 执行修改
                editTrySkillAnimateList.forEach(item => item.apply(this, arguments));
            }
        },
        set(v) {
            editTrySkillAnimateList.push(v);
        },
        configurable: true,
        enumerable: true,
    });
    // 覆盖
    game.players.forEach(player => {
        player.trySkillAnimate = lib.element.player.trySkillAnimate;
    });
    // 所有的get属性
    lib.allPropertyKey = ['name', 'suit', 'color', 'number', 'nature', 'type', 'type2', 'subtype', 'tag'];

    function isValidCard(card) {
        if (typeof card === 'object') {
            const { name } = card;
            return name && lib.card[name];
        } else if (typeof card === 'string') {
            return lib.card[card];
        }
        return false;
    }

    lib.allPropertyKey.forEach(key => {
        get['qy' + key] = function (card) {
            if (!card) return;
            if (isValidCard(card) === false) {
                return false;
            }
            return get[key]?.apply(this, arguments);
        };
    });

    // 绑定卡牌特效
    lib.qyArenaReadyPushOrRunStart(() => {
        // 绑定卡牌
        lib.skill._useCardSpine = {
            trigger: {
                player: ['useCardBegin', 'respondBegin']
            },
            filter(event, player) {
                return true
            },
            firstDo: true,
            forced: true,
            priority: 97,
            forceDie: true,
            popup: false,
            silent: true,
            content: function () {
                const card = trigger.card;
                if (!card.cards) return;
                // 支持的所有的属性

                const cardAnimationList = lib.qyAnimationCustomUtil.getBindingCard(trigger, function (item) {
                    // 筛选出来对应的卡牌名称
                    const { cards } = item;
                    if (!Array.isArray(cards)) return false;
                    return cards.some(item => {
                        const filterOptions = typeof item === 'object' ? item : { name: item };
                        return Object.entries(filterOptions).every(([key, value]) => {
                            if (!lib.allPropertyKey.includes(key)) return true;
                            // 走mod，另一方面就是方便 get.suit get.color 。。。
                            const cardValue = get['qy' + key] && get['qy' + key](card);
                            // 最后不匹配的话，则过滤掉
                            return cardValue === value;
                        });
                    });
                });

                // console.log("cardAnimationList：", cardAnimationList)

                card.cards.forEach(item => {
                    item._clone = null;
                    Reflect.defineProperty(item, 'clone', {
                        get() {
                            return this._clone;
                        },
                        set(v) {
                            if (this._clone === null) {
                                cardAnimationList.forEach(cardAnimation => {
                                    const { position } = cardAnimation;
                                    const parent = position === 'card' ? v : position;
                                    setTimeout((trigger) => {
                                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, cardAnimation.name, Object.assign(cardAnimation, {
                                            parent,
                                            trigger,
                                        }), null, {});
                                    }, 200, trigger)
                                });
                            }
                            this._clone = v;
                        },
                        enumerable: true,
                        configurable: true,
                    })
                });
            },
        }

        game.addGlobalSkill('_useCardSpine');
    });


    lib.qyAnimationCustomSkill = {};
    // 绑定自定义时机技能特效
    lib.qyArenaReadyPushOrRunStart(() => {
        const { triggerCustom, qyAnimationCustomSkill } = lib.qyAnimationCustomUtil.getEnableTrigger()
        //
        lib.qyAnimationCustomSkill = qyAnimationCustomSkill;
        // 检测并使用特效
        lib.qyCustomCheckAndUseAnimation = function (useList, trigger) {
            for (const useListElement of useList) {
                const { ...copyAnimation } = useListElement;
                const { name, filter, content, position, forbid } = copyAnimation;
                copyAnimation.trigger = trigger;
                // 是否禁用
                if (forbid) continue;
                // 寻找上级
                const findIndex = _status.POSITION_LIST.findIndex(({ key }) => key === position);
                // 找不到就过滤掉
                if (findIndex === -1) continue;
                // 是否可以触发特效
                try {
                    if (typeof filter == 'function' && !filter(trigger)) continue;
                } catch (e) {
                    console.error(`${name} 的filter报错`, e);
                    continue;
                }
                // 是否为自己发动，而不是代理发送
                if (typeof content === 'function') {
                    content(trigger);
                    continue;
                }
                // 使用Worker线程播放，保证特效和游戏的流畅度！！！
                JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, name, copyAnimation);
            }
        }
        //
        lib.skill._qyAnimationCustom = {
            trigger: triggerCustom,
            filter: lib.filter.all,
            firstDo: true,
            forced: true,
            priority: 97,
            forceDie: true,
            popup: false,
            silent: true,
            content: function () {
                const useList = [];
                // 开始筛选本时机的特效
                for (const [key, animateElement] of Object.entries(lib.qyAnimationCustomSkill)) {
                    // 时机不对，就跳过
                    if (key !== event.triggername) continue;
                    useList.push(...animateElement);
                }
                // 一般是不会检索不出来的。。。
                if (!useList.length) return;
                // 使用这些特效
                // lib.qycheckAndUseAnimation(useList, trigger, player, event);
                // console.log("_qyAnimationCustom:", useList);

                lib.qyCustomCheckAndUseAnimation(useList, trigger);
            },
        }
        game.addGlobalSkill('_qyAnimationCustom');
    });

    // 伤害数字
    lib.qyArenaReadyPushOrRunStart(() => {
        var player$DamagePop = lib.element.player.$damagepop;
        lib.element.player.$damagepop = function (num, nature, font, nobroadcast, show){
            if (!isFinite(num)) {
                return player$DamagePop.call(this, num, nature, font, nobroadcast, show);
            }
            if (!['damage','recover', 'changeHp'].includes(_status.event.name)) {
                return player$DamagePop.call(this, num, nature, font, nobroadcast, show);
            }
            const isRangNum = num <= 10 && num >= -10;
            if (!isRangNum) {
                return player$DamagePop.call(this, num, nature, font, nobroadcast, show);
            }
            const damageRecoverAnimationList = lib.qyAnimationCustomUtil.getAll({
                menuChains: [({enable, name}) => {
                    return name.includes('数字') && enable;
                }],
                itemChains: [({name, forbid}) => {
                    return (name.startsWith('回复') || name.startsWith('伤害')) && !forbid;
                }],
            });
            if (damageRecoverAnimationList.length === 0) {
                return player$DamagePop.call(this, num, nature, font, nobroadcast, show);
            }
        }

        game.players.forEach(player => {
            player.$damagepop = lib.element.player.$damagepop;
        });
    });

});