import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default function () {
    if (!ui.create?.menu) return;
    const onclickInterface = function () {
        const menuItems = Object.keys(lib.characterSort.WeChatkill);
        const overlay = document.createElement('div');
        overlay.id = 'overlay-container';
        //创建左侧导航列
        const leftNav = document.createElement('div');
        leftNav.id = 'overlay-left-nav';
        const leftNavScrollContainer = document.createElement('div');
        leftNavScrollContainer.id = 'left-nav-scroll-container';
        leftNavScrollContainer.style.overflow = 'scroll';
        leftNav.appendChild(leftNavScrollContainer);
        overlay.appendChild(leftNav);
        //创建右侧内容区域
        const dialog = document.createElement('div');
        dialog.id = 'overlay-dialog';
        //顶部栏
        const dialogHeader = document.createElement('div');
        dialogHeader.id = 'overlay-dialog-header';
        //分包标题
        const dialogTitle = document.createElement('div');
        dialogTitle.id = 'overlay-dialog-title';
        dialogTitle.innerHTML = '武将包';
        //返回按钮
        const backButton = document.createElement('button');
        backButton.id = 'overlay-back-btn';
        backButton.textContent = '返回';
        dialogHeader.appendChild(dialogTitle);
        dialogHeader.appendChild(backButton);
        //内容区域
        const dialogContent = document.createElement('div');
        dialogContent.className = 'dialog-content';
        dialog.appendChild(dialogHeader);
        dialog.appendChild(dialogContent);
        overlay.appendChild(dialog);
        //大的来了孩子们
        //页面更迭函数
        const changeDialog = function (item, dialogContainer) {
            if (!dialogContainer) return;
            dialogContainer.innerHTML = '';
            const list = lib.characterSort.WeChatkill[item.link].filter(character => lib.character[character] && !lib.character[character].isUnseen);
            if (list.length > 0) {
                const container = document.createElement('div');
                container.className = 'grid-layout';
                const buttons = ui.create.buttons([...list].sort(lib.sort.character), 'character', container);
                buttons.forEach(button => {
                    button.classList.add('noclick');
                    if (button.node?.hp) {
                        button.node.hp.style.transition = "all 0s";
                        button.node.hp._innerHTML = button.node.hp.innerHTML;
                    }
                    button.listen(function (e) {
                        ui.click.charactercard(this.link, this);
                    });
                });
                dialogContainer.appendChild(container);
            }
        };
        //创建导航项
        let currentActiveItem = null, str = `${get.plainText(lib.translate['WeChatkill_character_config'])}·`;
        menuItems.forEach((link, index) => {
            const navItem = document.createElement('button');
            navItem.className = 'nav-item';
            navItem.link = link;
            navItem.innerHTML = lib.translate[link];
            if (navItem.innerHTML.startsWith('小程序·')) navItem.innerHTML = navItem.innerHTML.slice('小程序·'.length);
            navItem.onclick = function () {
                currentActiveItem?.classList.remove('active');
                this.classList.add('active');
                currentActiveItem = this;
                dialogTitle.innerHTML = `${str}${this.innerHTML}`;
                changeDialog(this, dialogContent);
            };
            leftNavScrollContainer.appendChild(navItem);
            if (index === 0) {
                currentActiveItem = navItem;//默认选中第一个
                dialogTitle.innerHTML = `${str}${navItem.innerHTML}`;
            }
        });
        document.body.appendChild(overlay);
        setTimeout(() => {
            if (currentActiveItem) {
                currentActiveItem.classList.add('active');
                changeDialog(currentActiveItem, dialogContent);
            }
        }, 0);
        const closeOverlay = function () {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
            }
        };
        backButton.onclick = closeOverlay;
        const escHandler = function (e) {
            if (e.key === 'Escape') {
                closeOverlay();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    };
    const originLoading = ui.create.menu;
    ui.create.menu = function () {
        const result = originLoading.apply(this, arguments);
        const characterPack = Array.from(document.getElementsByTagName('div')).find(div => div.innerHTML === '武将');
        if (characterPack) {
            const originClick = characterPack.onclick;
            characterPack.onclick = () => {
                originClick?.apply(this, arguments);
                const characterPackage = Array.from(document.querySelectorAll('.menubutton.large')).find(div => div.innerHTML === lib.translate['WeChatkill_character_config']);
                if (characterPackage) {
                    const originClick2 = characterPackage.onclick;
                    characterPackage.onclick = () => {
                        originClick2?.apply(this, arguments);
                        const rightPane = document.querySelector('.menu-buttons.leftbutton');
                        if (rightPane && !rightPane.init) {
                            rightPane.init = true;
                            const cfgNodes = rightPane.querySelectorAll('.config.toggle');
                            for (let i = 0; i < cfgNodes.length; i++) {
                                if (cfgNodes[i].textContent === '仅点将可用') {
                                    const addIntro = document.createElement('div');
                                    addIntro.onclick = onclickInterface;
                                    addIntro.classList.add('config', 'pointerspan');
                                    addIntro.innerHTML = (() => {
                                        //孩子们，牢大在天上化为彩虹看着你们（bushi）
                                        const text = '点击进入三国杀小程序武将单独页';
                                        if (!document.getElementById('WeChatkill-rainbow-style')) {
                                            const style = document.createElement('style');
                                            style.id = 'WeChatkill-rainbow-style';
                                            let css = '';
                                            for (let i = 0; i < text.length; i++) {
                                                const animName = `WeChatkill-${i}`;
                                                css += `@keyframes ${animName}{`;
                                                for (let j = 0; j <= 20; j++) {
                                                    const r = Math.floor(Math.random() * 255);
                                                    const g = Math.floor(Math.random() * 255);
                                                    const b = Math.floor(Math.random() * 255);
                                                    css += `${j * 5}%{color:rgb(${r},${g},${b});text-shadow:0 0 5px rgba(${r},${g},${b},0.8);}`;
                                                }
                                                css += `}`;
                                            }
                                            style.innerHTML = css;
                                            document.head.appendChild(style);
                                        }
                                        return [...text].map((ch, i) => {
                                            const delay = (i * 0.3).toFixed(1);
                                            return `<span style="display:inline-block; animation:WeChatkill-${i} 3s linear ${delay}s infinite; font-family: 'SimSun','宋体',serif; font-weight:bold; transition:color 0.5s;">${ch}</span>`;
                                        }).join('');
                                    })();
                                    cfgNodes[i].parentNode.insertBefore(addIntro, cfgNodes[i].nextSibling);
                                    break;
                                }
                            }
                        }
                    };
                }
            };
        }
        return result;
    };
};