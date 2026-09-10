window.qyPreContent = function (lib, game, ui, get, ai, _status, config) {
    /**
     * 皮肤通用管理模块 (Legacy 兼容版)
     * 采用声明式 DOM 构建，优化代码结构与可维护性
     */
    lib.qyUtils.SkinCommon = (function () {

        /**
         * 皮肤管理器
         * 负责管理皮肤项列表及当前选中状态
         */
        class SkinManager {
            /**
             * @param {HTMLElement} container - 挂载容器
             * @param {string} characterID - 武将ID
             */
            constructor(container, characterID) {
                this.container = container;
                this.characterID = characterID;
                this.currentSkin = null;
                this.skinItems = [];
            }

            /**
             * 创建皮肤项 (同步)
             */
            createSkinItem(data) {
                const item = new SkinItem(this, data);
                this.skinItems.push(item);
                return item;
            }

            /**
             * 创建皮肤项 (异步/延迟渲染)
             */
            asyncCreateSkinItem(data) {
                const item = new SkinItem(this, { ...data, isAsync: true });
                this.skinItems.push(item);
                return item;
            }

            /**
             * 移除皮肤项
             */
            removeSkinItem(item) {
                const index = this.skinItems.indexOf(item);
                if (index > -1) {
                    this.skinItems.splice(index, 1);
                    item.destroy();
                }

                if (this.currentSkin === item) {
                    this.currentSkin = null;
                    if (!lib.qySkinAudio.isInSkinName(this.characterID, item.imageSrc)) {
                        lib.qySkinAudio.setCurrentSkin(this.characterID, null);
                        this.refreshCurrent();
                    }
                }
            }

            /**
             * 根据名称移除
             */
            removeSkinItemByName(name) {
                const item = this.skinItems.find(i => i.name === name);
                if (item) this.removeSkinItem(item);
            }

            /**
             * 设置当前选中
             */
            setCurrentSkin(item) {
                if (this.currentSkin) this.currentSkin.setActive(false);
                this.currentSkin = item;
                if (item) item.setActive(true);
            }

            /**
             * 刷新选中状态
             */
            refreshCurrent() {
                this.skinItems.forEach(item => {
                    if (lib.qySkinAudio.isInSkinName(this.characterID, item.imageSrc, false)) {
                        this.setCurrentSkin(item);
                        item.element?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                    }
                });
            }
        }

        /**
         * 皮肤项组件
         */
        class SkinItem {
            constructor(manager, data) {
                this.manager = manager;
                this.name = data.name;
                this.imageSrc = data.imageSrc;
                this.isDynamic = data.isDynamic;
                this.isOrigin = data.isOrigin;
                this.level = data.level;
                this.characterID = data.characterID;
                this.skin = data.skin;

                this.element = null;

                if (!data.isAsync) {
                    this.render(data.num);
                }
            }

            /**
             * 渲染 DOM
             */
            render(num) {
                const { createElement } = lib.qyUtils;

                this.element = createElement({
                    class: 'qy_dateil_skin_item',
                    parent: this.manager.container,
                    positionIndex: num,
                    event: {
                        contextmenu: (e) => this.handleContextMenu(e)
                    },
                    children: [
                        // 1. 等级背景
                        {
                            class: 'qy_camp-rate-back',
                            attributes: { 'data-rate': this.level },
                            id: 'rate'
                        },
                        // 2. 等级标签
                        {
                            class: `qy_camp-rate-rank qy_rank_label qy_rank_label_${this.level}`,
                            id: 'rank'
                        },
                        // 3. 图片层
                        {
                            class: 'qy_dateil_skin_item_character',
                            id: 'image',
                            click: () => this.handleClick(),
                            children: [
                                {
                                    class: 'qy_detail_skin_item_dynamic' + (this.isDynamic ? '' : ' hidden'),
                                    id: 'dynamicIcon'
                                }
                            ]
                        },
                        // 4. 音频层 (默认隐藏)
                        {
                            class: 'qy_dateil_skin_item_audio qy_hidden',
                            id: 'audio',
                            children: [
                                { class: 'qy_dateil_skin_item_audio_icon' },
                                { class: 'qy_dateil_skin_item_audio_text' }
                            ]
                        },
                        // 5. 名称层
                        {
                            class: 'qy_dateil_skin_item_name',
                            innerHTML: this.name,
                            id: 'nameNode'
                        }
                    ]
                });

                // 建立快捷引用以兼容旧代码
                const el = this.element;
                el.rate = el.querySelector('.qy_camp-rate-back');
                el.rank = el.querySelector('.qy_camp-rate-rank');
                el.image = el.querySelector('.qy_dateil_skin_item_character');
                el.$dynamic = el.querySelector('.qy_detail_skin_item_dynamic');
                el.audio = el.querySelector('.qy_dateil_skin_item_audio');
                el.nameNode = el.querySelector('.qy_dateil_skin_item_name');

                el.name = this.name;
                el.nameLink = this.name;
                el._link = this.imageSrc;

                if (this.imageSrc) {
                    el.image.setBackgroundImage(this.imageSrc);
                    lib.qyUtils.isImageOutcrop(this.imageSrc).then(res => {
                        el.image.classList.toggle('qy-outcrop', !!res);
                    });
                }
            }

            handleClick() {
                if (this.element?.viewState?.cancelClick) return;
                if (this.manager.currentSkin === this || !this.imageSrc) return;
                if (lib.qySkinAudio.isInSkinName(this.characterID, this.imageSrc)) return;
                this.manager.setCurrentSkin(this);
            }

            handleContextMenu(e) {
                if (this.element.qydateil_skin_item_menu) return;
                e.stopPropagation();
                e.preventDefault();
                if (!this.imageSrc || this.isOrigin) return;

                const menu = lib.qyUtils.createElement({
                    class: 'qydateil_skin_item_menu',
                    parent: this.element,
                    click: (ev) => ev.stopPropagation(),
                    children: [
                        {
                            text: lib.qyCharacterSkinList?.contains?.(this.characterID, this.imageSrc) ? '移除此皮肤' : '删除此皮肤',
                            click: () => {
                                const isDelete = !lib.qyCharacterSkinList?.contains?.(this.characterID, this.imageSrc);
                                if (isDelete) {
                                    game.removeFile(this.imageSrc, () => this.manager.removeSkinItem(this));
                                } else {
                                    lib.qyCharacterSkinList?.del?.(this.characterID, this.imageSrc);
                                    this.manager.removeSkinItem(this);
                                }
                            }
                        },
                        {
                            text: '取消',
                            click: () => {
                                menu.remove();
                                delete this.element.qydateil_skin_item_menu;
                            }
                        }
                    ]
                });
                this.element.qydateil_skin_item_menu = menu;
            }

            setRate(rate) {
                this.level = rate;
                if (this.element) {
                    if (this.element.rate) this.element.rate.dataset.rate = rate;
                    if (this.element.rank) {
                        this.element.rank.className = `qy_camp-rate-rank qy_rank_label qy_rank_label_${rate}`;
                    }
                }
            }

            setActive(active) {
                this.element?.classList.toggle('qy_dateil_skin_item_active', active);
            }

            destroy() {
                if (this.element) {
                    this.element.remove();
                    this.element = null;
                }
            }
        }

        return { SkinManager, SkinItem };
    }());
}
