import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    return {
        name: "势小乔",
        content: function (config, pack) {},
        precontent: function () {},
        config: {},
        help: {},
        package: {
            character: {
                character: {
                    ca_xiaoqiao: ['female', 'wu', 3, ['ca_heyun', 'ca_yinhui']],
                },
                translate: {
                    ca_xiaoqiao: '势小乔',
                },
                characterPrefix: {
                    ca_xiaoqiao: '势',
                },
            },
            card: {
                card: {},
                translate: {},
                list: [],
            },
            skill: {
                skill: {
                    ca_xiaoqiao_vfx: {
                        charlotte: true,
                        popup: false,
                        assets: {
                            main: '../../../势小乔/animation/Ss_vfx_sxq_ui_jm',
                            title: '../../../势小乔/animation/Ss_vfx_sxq_ui_hy',
                            select: '../../../势小乔/animation/Ss_vfx_sxq_ui_xz',
                            flower: '../../../势小乔/animation/Ss_vfx_sxq_ui_hh',
                            progress: '../../../势小乔/animation/Ss_vfx_sxq_ui_jdt',
                        },
                        uiImages: {
                            card: 'jnmb_sxq_txt_di.png',
                            cardSelected: 'jnmb_sxq_txt_di2.png',
                            confirm: 'jnmb_sxq_btn.png',
                            cancel: 'jnmb_sxq_btn2.png',
                            progress: 'jnmb_sxq_txt_jindutiao2.png',
                            progressBase: 'jnmb_sxq_txt_jindutiao1.png',
                            flowerLoop: 'jnmb_sxq_hh_loop.webp',
                        },
                        _sessions: {},
                        getAnimation: function () {
                            if (typeof window != 'undefined') {
                                if (window.dcdAnim && window.dcdAnim.loadSpine && window.dcdAnim.playSpine) return window.dcdAnim;
                                if (window.decadeUI && window.decadeUI.animation && window.decadeUI.animation.loadSpine && window.decadeUI.animation.playSpine) {
                                    return window.decadeUI.animation;
                                }
                            }
                            if (typeof dcdAnim != 'undefined' && dcdAnim && dcdAnim.loadSpine && dcdAnim.playSpine) return dcdAnim;
                            return null;
                        },
                        getSessionId: function (type, owner) {
                            var id = 'local';
                            if (owner) id = owner.playerid || owner.playerId || owner.name || (owner.dataset && owner.dataset.position) || 'local';
                            return String(type || 'skill') + '_' + String(id);
                        },
                        getUIImageURL: function (name) {
                            var file = this.uiImages && this.uiImages[name];
                            if (!file) return '';
                            return String(lib.assetURL || '') + 'extension/势小乔/image/' + file;
                        },
                        ensureStyleLocal: function () {
                            if (typeof document == 'undefined') return;
                            var style = document.getElementById('mobile-shi-xiaoqiao-choice-style');
                            if (!style) {
                                style = document.createElement('style');
                                style.id = 'mobile-shi-xiaoqiao-choice-style';
                                (document.head || document.documentElement).appendChild(style);
                            }
                            style.textContent = [
                                '.sxq-choice-backdrop{position:fixed;left:0;top:0;width:100%;height:100%;z-index:2147483000;overflow:hidden;background:rgba(0,0,0,.14);backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:none;}',
                                '.sxq-choice-backdrop:before{display:none!important;content:none!important;background:none!important;}',
                                '.sxq-choice-overlay{position:fixed;left:0;top:0;width:100%;height:100%;z-index:2147483101;overflow:hidden;background:transparent;font-family:"shousha","KaiTi","Microsoft YaHei",sans-serif;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;}',
                                '.sxq-choice-overlay *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}',
                                '.sxq-choice-vfx{position:absolute;inset:0;pointer-events:none;z-index:1000;overflow:visible;}',
                                '.sxq-choice-list{position:absolute;left:7.5%;right:7.5%;top:29.5%;height:30.5%;z-index:10;display:flex;align-items:center;justify-content:center;gap:1.35vw;overflow-x:auto;overflow-y:visible;padding:2.1vh 1.3vw 2.8vh;scroll-behavior:smooth;}',
                                '.sxq-choice-list.sxq-choice-long{justify-content:flex-start;}',
                                '.sxq-choice-list::-webkit-scrollbar{height:0;display:none;}',
                                '.sxq-choice-card{position:relative;flex:0 0 clamp(242px,22.3vw,392px);width:clamp(242px,22.3vw,392px);height:clamp(132px,12.1vw,213px);background-image:var(--sxq-card-bg);background-repeat:no-repeat;background-position:center;background-size:100% 100%;color:#e9f4dc;cursor:pointer;transition:transform .14s ease,filter .14s ease;overflow:visible;border:0!important;outline:0!important;box-shadow:none!important;}',
                                '.sxq-choice-card:hover{transform:translateY(-2px);filter:brightness(1.04);}',
                                '.sxq-choice-card.sxq-selected{transform:translateY(-3px);filter:brightness(1.06);border:0!important;outline:0!important;box-shadow:none!important;}',
                                '.sxq-choice-card-selected{display:none;position:absolute;left:-1.25%;top:-4%;width:102.5%;height:108%;z-index:1;background-image:var(--sxq-card-selected);background-repeat:no-repeat;background-position:center;background-size:100% 100%;pointer-events:none;border:0!important;outline:0!important;box-shadow:none!important;}',
                                '.sxq-choice-card.sxq-selected .sxq-choice-card-selected{display:block;}',
                                '.sxq-choice-card-title{position:absolute;left:26%;right:26%;top:1%;height:24%;z-index:3;display:flex;align-items:center;justify-content:center;color:#eaf4da;font-size:clamp(18px,1.65vw,29px);font-weight:700;letter-spacing:.12em;text-indent:.12em;text-shadow:0 2px 2px rgba(0,0,0,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
                                '.sxq-choice-card-info{position:absolute;left:7%;right:7%;top:30%;bottom:8%;z-index:3;overflow-y:auto;line-height:1.52;text-align:left;font-size:clamp(12px,1.05vw,18px);letter-spacing:.035em;text-shadow:0 1px 2px rgba(0,0,0,.76);padding:0 3px;}',
                                '.sxq-choice-card-info::-webkit-scrollbar{width:3px}.sxq-choice-card-info::-webkit-scrollbar-thumb{background:rgba(220,255,231,.5);border-radius:4px;}',
                                '.sxq-choice-progress-layer{position:fixed;left:25%;right:25%;bottom:14.5%;height:10.5%;z-index:2147483101;pointer-events:none;overflow:visible;}',
                                '.sxq-choice-prompt-wrap{position:absolute;left:25%;right:25%;bottom:14.5%;height:10.5%;z-index:40;pointer-events:none;overflow:visible;}',
                                '.sxq-choice-progress{position:absolute;left:0;right:0;top:0;height:27%;min-height:15px;overflow:visible;}',
                                '.sxq-choice-progress-base,.sxq-choice-progress-fill{position:absolute;inset:0;background-repeat:no-repeat;background-position:center;background-size:100% 100%;pointer-events:none;}',
                                '.sxq-choice-progress-base{z-index:2;background-image:var(--sxq-progress-base);}',
                                '.sxq-choice-progress-jdt{position:absolute;inset:-120% -2%;z-index:0;pointer-events:none;overflow:visible;}',
                                '.sxq-choice-progress-flower{position:absolute;left:100%;top:50%;width:clamp(165px,12.8vw,245px);height:clamp(125px,10.2vw,195px);z-index:6;transform:translate(-50%,-65%);background-image:var(--sxq-flower-loop);background-repeat:no-repeat;background-position:center;background-size:contain;filter:hue-rotate(18deg) saturate(1.12) brightness(1.08);animation:sxqChoiceFlowerMove 11.5s linear infinite;pointer-events:none;overflow:visible;}',
                                '.sxq-choice-progress-fill{z-index:3;background-image:var(--sxq-progress);clip-path:inset(0 0 0 0);-webkit-clip-path:inset(0 0 0 0);animation:sxqChoiceProgress 11.5s linear infinite;}',
                                '.sxq-choice-prompt{position:absolute;z-index:5;top:48%;left:-10%;right:-10%;text-align:center;color:#e9e7bb;font-size:clamp(15px,1.55vw,26px);letter-spacing:.07em;text-shadow:0 2px 3px #000,0 0 4px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
                                '.sxq-choice-buttons{position:absolute;right:35%!important;bottom:28%!important;z-index:50;display:flex;flex-direction:row;align-items:center;justify-content:flex-end;gap:clamp(8px,1vw,18px);}',
                                '.sxq-choice-button{position:relative;display:flex;align-items:center;justify-content:center;border:0!important;outline:0!important;box-shadow:none!important;background-repeat:no-repeat;background-position:center;background-size:100% 100%;color:#f4e4ad;font-weight:700;text-shadow:0 2px 2px #000;cursor:pointer;}',
                                '.sxq-choice-button.confirm{width:clamp(147px,14.35vw,294px);height:clamp(45px,4.39vw,90px);background-image:var(--sxq-confirm-btn);font-size:clamp(19px,1.7vw,28px);letter-spacing:.15em;text-indent:.15em;color:#6b5522;text-shadow:0 1px 1px rgba(255,255,255,.55),0 0 3px rgba(255,250,190,.8);}',
                                '.sxq-choice-button.cancel{width:clamp(103px,7.52vw,154px);height:clamp(40px,2.93vw,60px);background-image:var(--sxq-cancel-btn);font-size:clamp(17px,1.4vw,24px);letter-spacing:.1em;text-indent:.1em;}',
                                '.sxq-choice-button.disabled{filter:grayscale(.78) brightness(.65);opacity:.62;cursor:default;}',
                                '.sxq-choice-button:not(.disabled):active{transform:translateY(1px);filter:brightness(1.13);}',
                                '@keyframes sxqChoiceProgress{0%{clip-path:inset(0 0 0 0);-webkit-clip-path:inset(0 0 0 0)}100%{clip-path:inset(0 100% 0 0);-webkit-clip-path:inset(0 100% 0 0)}}',
                                '@keyframes sxqChoiceFlowerMove{0%{left:100%}100%{left:0}}',
                                '@media(max-width:900px){.sxq-choice-list{left:3%;right:3%;top:28.5%;height:33%;gap:10px;justify-content:center}.sxq-choice-list.sxq-choice-long{justify-content:flex-start}.sxq-choice-card{flex-basis:24.2vw;width:24.2vw;height:13.2vw;min-width:24.2vw;min-height:13.2vw}.sxq-choice-progress-layer,.sxq-choice-prompt-wrap{left:25%;right:25%;bottom:13.5%}.sxq-choice-buttons{right:6%;bottom:5%}.sxq-choice-card-info{line-height:1.42}}',
                                '@media(max-height:560px){.sxq-choice-list{top:27%;height:35%}.sxq-choice-progress-layer,.sxq-choice-prompt-wrap{bottom:11.5%}.sxq-choice-buttons{bottom:3.5%}.sxq-choice-card-info{font-size:12px;line-height:1.35}}',
                                '.sxq-choice-buttons.sxq-choice-buttons-heyun{right:45%!important;bottom:28%!important;}',
                                '.sxq-choice-buttons.sxq-choice-buttons-yinhui{right:35%!important;bottom:28%!important;}',
                            ].join('');
                        },
                        getAnimationCanvasLocal: function (animation) {
                            if (!animation) return null;
                            return animation.canvas ||
                                (animation.renderer && (animation.renderer.view || animation.renderer.canvas)) ||
                                animation.view || animation.domElement || null;
                        },
                        // 全局Spine画布仅放在暗化背景与技能框之间，避免特效覆盖技能文字和按钮。
                        elevateGlobalCanvasLocal: function (session, animation) {
                            if (!session || session.globalCanvasRaised) return;
                            var canvas = this.getAnimationCanvasLocal(animation);
                            if (!canvas || !canvas.style) return;
                            var computedPosition = '';
                            try { computedPosition = window.getComputedStyle ? window.getComputedStyle(canvas).position : ''; }
                            catch (e) {}
                            var names = ['z-index', 'pointer-events', 'position'];
                            var old = { canvas: canvas, values: {}, priorities: {} };
                            for (var i = 0; i < names.length; i++) {
                                var name = names[i];
                                old.values[name] = canvas.style.getPropertyValue(name);
                                old.priorities[name] = canvas.style.getPropertyPriority(name);
                            }
                            session.globalCanvasRaised = old;
                            canvas.style.setProperty('z-index', '2147483100', 'important');
                            canvas.style.setProperty('pointer-events', 'none', 'important');
                            if (!computedPosition || computedPosition == 'static') {
                                canvas.style.setProperty('position', 'fixed', 'important');
                            }
                        },
                        restoreGlobalCanvasLocal: function (session) {
                            var old = session && session.globalCanvasRaised;
                            if (!old || !old.canvas || !old.canvas.style) return;
                            var canvas = old.canvas;
                            var names = ['z-index', 'pointer-events', 'position'];
                            for (var i = 0; i < names.length; i++) {
                                var name = names[i];
                                var value = old.values[name];
                                var priority = old.priorities[name] || '';
                                if (value) canvas.style.setProperty(name, value, priority);
                                else canvas.style.removeProperty(name);
                            }
                            session.globalCanvasRaised = null;
                        },
                        hideDefaultProgressLocal: function (session) {
                            if (!session || typeof document == 'undefined') return;
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            if (!session.hiddenDefaultProgress) session.hiddenDefaultProgress = [];
                            var selectors = [
                                '#time', '#time2', '#time3',
                                '#jindutiaopl', '#wuxiejindutiao1', '#wuxiejindutiao2',
                                '.jindutiaopl', '.wuxiejindutiao1', '.wuxiejindutiao2',
                                '.timebar', '.time-bar', '.timerbar', '.timer-bar',
                                '.choose-progress', '.choose-timebar',
                                '.skill-progress', '.skill-timebar',
                                '[id*="jindutiao"]'
                            ].join(',');
                            var hideNode = function (node) {
                                if (!node || !node.style || node.nodeType != 1) return;
                                if (node.closest && node.closest('.sxq-choice-overlay,.sxq-choice-progress-layer')) return;
                                for (var i = 0; i < session.hiddenDefaultProgress.length; i++) {
                                    if (session.hiddenDefaultProgress[i].node == node) return;
                                }
                                session.hiddenDefaultProgress.push({
                                    node: node,
                                    display: node.style.getPropertyValue('display'),
                                    displayPriority: node.style.getPropertyPriority('display'),
                                    visibility: node.style.getPropertyValue('visibility'),
                                    visibilityPriority: node.style.getPropertyPriority('visibility'),
                                });
                                node.style.setProperty('display', 'none', 'important');
                                node.style.setProperty('visibility', 'hidden', 'important');
                            };
                            var scan = function () {
                                if (!session.active) return;
                                var direct = [
                                    ui && ui.time, ui && ui.time2, ui && ui.time3,
                                    ui && ui.timer, ui && ui.timerbar,
                                    ui && ui.jindutiaopl, ui && ui.wuxiejindutiao1, ui && ui.wuxiejindutiao2
                                ];
                                for (var i = 0; i < direct.length; i++) hideNode(direct[i]);
                                var nodes = document.querySelectorAll(selectors);
                                for (var j = 0; j < nodes.length; j++) hideNode(nodes[j]);
                            };
                            scan();
                            if (typeof MutationObserver != 'undefined' && !session.defaultProgressObserver) {
                                session.defaultProgressObserver = new MutationObserver(scan);
                                session.defaultProgressObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
                            }
                        },
                        restoreDefaultProgressLocal: function (session) {
                            if (!session) return;
                            if (session.defaultProgressObserver) {
                                try { session.defaultProgressObserver.disconnect(); }
                                catch (e) {}
                                session.defaultProgressObserver = null;
                            }
                            var list = session.hiddenDefaultProgress || [];
                            for (var i = 0; i < list.length; i++) {
                                var item = list[i];
                                if (!item.node || !item.node.style) continue;
                                if (item.display) item.node.style.setProperty('display', item.display, item.displayPriority || '');
                                else item.node.style.removeProperty('display');
                                if (item.visibility) item.node.style.setProperty('visibility', item.visibility, item.visibilityPriority || '');
                                else item.node.style.removeProperty('visibility');
                            }
                            session.hiddenDefaultProgress = [];
                        },
                        removeSpriteRecord: function (session, record) {
                            if (!session || !session.sprites) return;
                            var index = session.sprites.indexOf(record);
                            if (index != -1) session.sprites.splice(index, 1);
                        },
                        stopSpriteRecord: function (session, record) {
                            if (!record || record.stopped) return;
                            record.stopped = true;
                            try {
                                if (record.animation && record.animation.stopSpine) record.animation.stopSpine(record.sprite);
                            }
                            catch (e) {}
                            this.removeSpriteRecord(session, record);
                        },
                        stopSessionLocal: function (type, owner) {
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            var key = helper.getSessionId(type, owner);
                            var session = helper._sessions[key];
                            if (!session) return;
                            session.active = false;
                            if (session.loopTimer) clearTimeout(session.loopTimer);
                            if (session.selectedRecords) {
                                var selected = session.selectedRecords.slice(0);
                                for (var j = 0; j < selected.length; j++) helper.stopSpriteRecord(session, selected[j]);
                            }
                            var records = session.sprites ? session.sprites.slice(0) : [];
                            for (var i = 0; i < records.length; i++) helper.stopSpriteRecord(session, records[i]);
                            helper.restoreDefaultProgressLocal(session);
                            helper.restoreGlobalCanvasLocal(session);
                            if (session.overlay && session.overlay.parentNode) session.overlay.parentNode.removeChild(session.overlay);
                            if (session.progressLayer && session.progressLayer.parentNode) session.progressLayer.parentNode.removeChild(session.progressLayer);
                            if (session.backdrop && session.backdrop.parentNode) session.backdrop.parentNode.removeChild(session.backdrop);
                            delete helper._sessions[key];
                        },
                        playSessionLocal: function (session, key, action, options, duration, callback) {
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            var animation = helper.getAnimation();
                            var name = helper.assets[key];
                            if (!session || !session.active || !animation || !name) return null;
                            if (session.overlay) helper.elevateGlobalCanvasLocal(session, animation);
                            var record = { animation: animation, sprite: null, stopped: false };
                            session.sprites.push(record);
                            try {
                                animation.loadSpine(name, 'skel', function () {
                                    if (!session.active || record.stopped) return;
                                    try {
                                        var asset = { name: name, action: action || 'play' };
                                        options = options || {};
                                        if (action == 'loop' || action == 'loop2' || action == 'normal' || options.loop) asset.loop = true;
                                        var playOptions = {};
                                        for (var i in options) if (i != 'loop' && options[i] !== undefined) playOptions[i] = options[i];
                                        record.sprite = animation.playSpine(asset, playOptions);
                                        if (!record.sprite) {
                                            helper.removeSpriteRecord(session, record);
                                            return;
                                        }
                                        if (duration) setTimeout(function () { helper.stopSpriteRecord(session, record); }, duration);
                                        if (callback) callback(record);
                                    }
                                    catch (e) {
                                        helper.removeSpriteRecord(session, record);
                                        if (typeof console != 'undefined' && console.error) console.error('[势小乔] Spine播放失败：' + key, e);
                                    }
                                });
                            }
                            catch (e) {
                                helper.removeSpriteRecord(session, record);
                                if (typeof console != 'undefined' && console.error) console.error('[势小乔] Spine加载失败：' + key, e);
                            }
                            return record;
                        },
                        playOnceLocal: function (key, action, options, duration) {
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            var animation = helper.getAnimation();
                            var name = helper.assets[key];
                            if (!animation || !name) return;
                            try {
                                animation.loadSpine(name, 'skel', function () {
                                    try {
                                        options = options || {};
                                        var asset = { name: name, action: action || 'play' };
                                        if (action == 'loop' || action == 'loop2' || options.loop) asset.loop = true;
                                        var playOptions = {};
                                        for (var i in options) if (i != 'loop' && options[i] !== undefined) playOptions[i] = options[i];
                                        var sprite = animation.playSpine(asset, playOptions);
                                        if (sprite && duration && animation.stopSpine) setTimeout(function () {
                                            try { animation.stopSpine(sprite); }
                                            catch (e) {}
                                        }, duration);
                                    }
                                    catch (e) {}
                                });
                            }
                            catch (e) {}
                        },
                        createOverlayLocal: function (session, type) {
                            if (typeof document == 'undefined') return;
                            this.ensureStyleLocal();
                            // 仅添加轻微暗化，不使用模糊，保持角色、卡牌和背景清晰可见。
                            var backdrop = document.createElement('div');
                            backdrop.className = 'sxq-choice-backdrop';
                            var overlay = document.createElement('div');
                            overlay.className = 'sxq-choice-overlay';
                            overlay.style.setProperty('--sxq-card-bg', 'url("' + this.getUIImageURL('card') + '")');
                            overlay.style.setProperty('--sxq-card-selected', 'url("' + this.getUIImageURL('cardSelected') + '")');
                            overlay.style.setProperty('--sxq-confirm-btn', 'url("' + this.getUIImageURL('confirm') + '")');
                            overlay.style.setProperty('--sxq-cancel-btn', 'url("' + this.getUIImageURL('cancel') + '")');
                            overlay.style.setProperty('--sxq-progress', 'url("' + this.getUIImageURL('progress') + '")');
                            overlay.style.setProperty('--sxq-progress-base', 'url("' + this.getUIImageURL('progressBase') + '")');
                            overlay.style.setProperty('--sxq-flower-loop', 'url("' + this.getUIImageURL('flowerLoop') + '")');
                            overlay.oncontextmenu = function () { return false; };
                            overlay.addEventListener('mousedown', function (e) { e.stopPropagation(); });
                            overlay.addEventListener('touchstart', function (e) { e.stopPropagation(); }, false);
                            var vfx = document.createElement('div');
                            vfx.className = 'sxq-choice-vfx';
                            overlay.appendChild(vfx);
                            var root = document.body || ((ui && ui.window) ? ui.window : document.documentElement);
                            root.appendChild(backdrop);
                            root.appendChild(overlay);
                            session.backdrop = backdrop;
                            session.overlay = overlay;
                            session.vfxLayer = vfx;
                        },
                        startSelectionLocal: function (type, owner, withOverlay) {
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            helper.stopSessionLocal(type, owner);
                            var key = helper.getSessionId(type, owner);
                            var session = {
                                key: key,
                                type: type,
                                owner: owner,
                                active: true,
                                sprites: [],
                                selectedRecords: [],
                                loopTimer: null,
                                backdrop: null,
                                overlay: null,
                                vfxLayer: null,
                                progressLayer: null,
                                globalCanvasRaised: null,
                                hiddenDefaultProgress: [],
                                defaultProgressObserver: null,
                            };
                            helper._sessions[key] = session;
                            helper.hideDefaultProgressLocal(session);
                            if (withOverlay) helper.createOverlayLocal(session, type);
                            var commonParent = session.vfxLayer || undefined;
                            var mainIntro = helper.playSessionLocal(session, 'main', 'play', {
                                speed: 0.9,
                                scale: withOverlay ? 0.84 : 0.72,
                                x: [0, 0.5],
                                y: [0, 0.51],
                                parent: commonParent,
                            });
                            session.loopTimer = setTimeout(function () {
                                if (!session.active || helper._sessions[key] != session) return;
                                helper.stopSpriteRecord(session, mainIntro);
                                helper.playSessionLocal(session, 'main', 'loop', {
                                    speed: 0.82,
                                    scale: withOverlay ? 0.84 : 0.72,
                                    x: [0, 0.5],
                                    y: [0, 0.51],
                                    parent: commonParent,
                                    loop: true,
                                });
                                helper.playSessionLocal(session, 'title', type == 'yinhui' ? 'loop2' : 'loop', {
                                    speed: 0.82,
                                    scale: withOverlay ? 0.82 : 0.82,
                                    x: [0, 0.5],
                                    y: [0, 0.88],
                                    parent: commonParent,
                                    loop: true,
                                });
                            }, 860);
                            return session;
                        },
                        clearSelectedVfxLocal: function (session) {
                            if (!session || !session.selectedRecords) return;
                            var list = session.selectedRecords.slice(0);
                            session.selectedRecords.length = 0;
                            for (var i = 0; i < list.length; i++) this.stopSpriteRecord(session, list[i]);
                        },
                        playSelectedVfxLocal: function (session, card) {
                            if (!session || !card) return;
                            this.clearSelectedVfxLocal(session);
                        },
                        attachTargetLocal: function () {},
                        renderChoiceLocal: function (session, items, prompt, allowCancel, done) {
                            if (!session || !session.overlay) return false;
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            var overlay = session.overlay;
                            var list = document.createElement('div');
                            list.className = 'sxq-choice-list';
                            if (items.length > 4) list.classList.add('sxq-choice-long');
                            overlay.appendChild(list);

                            var root = document.body || ((ui && ui.window) ? ui.window : document.documentElement);
                            var progressLayer = document.createElement('div');
                            progressLayer.className = 'sxq-choice-progress-layer';
                            progressLayer.innerHTML = '<div class="sxq-choice-progress"><div class="sxq-choice-progress-jdt"></div><div class="sxq-choice-progress-base"></div><div class="sxq-choice-progress-fill"></div><div class="sxq-choice-progress-flower"></div></div>';
                            progressLayer.style.setProperty('--sxq-progress', 'url(\"' + helper.getUIImageURL('progress') + '\")');
                            progressLayer.style.setProperty('--sxq-progress-base', 'url(\"' + helper.getUIImageURL('progressBase') + '\")');
                            progressLayer.style.setProperty('--sxq-flower-loop', 'url("' + helper.getUIImageURL('flowerLoop') + '")');
                            root.appendChild(progressLayer);
                            session.progressLayer = progressLayer;

                            var promptWrap = document.createElement('div');
                            promptWrap.className = 'sxq-choice-prompt-wrap';
                            promptWrap.innerHTML = '<div class="sxq-choice-prompt"></div>';
                            promptWrap.firstChild.textContent = prompt || '请选择一个技能';
                            overlay.appendChild(promptWrap);

                            var progressAnchor = progressLayer.querySelector('.sxq-choice-progress-jdt');
                            var progressRect = progressLayer.getBoundingClientRect ? progressLayer.getBoundingClientRect() : null;
                            var progressScale = progressRect && progressRect.width ? Math.max(0.58, Math.min(1.15, progressRect.width / 895)) : 0.82;
                            helper.playSessionLocal(session, 'progress', 'play', {
                                speed: 0.48,
                                scale: progressScale,
                                x: [0, 0.5],
                                y: [1, 0.5],
                                parent: progressAnchor,
                                follow: true,
                                loop: true,
                            });
                            // HH循环特效改由其atlas帧动画挂在进度条端点上层，避免全局Spine画布层级冲突。

                            var buttons = document.createElement('div');
                            buttons.className = 'sxq-choice-buttons sxq-choice-buttons-' + session.type;
                            var cancel = document.createElement('div');
                            cancel.className = 'sxq-choice-button cancel';
                            cancel.textContent = '取消';
                            var confirm = document.createElement('div');
                            confirm.className = 'sxq-choice-button confirm disabled';
                            confirm.textContent = '确定';
                            buttons.appendChild(confirm);
                            if (allowCancel !== false) buttons.appendChild(cancel);
                            overlay.appendChild(buttons);

                            var selected = null;
                            var finished = false;
                            var finish = function (value) {
                                if (finished) return;
                                finished = true;
                                done(value);
                            };
                            for (var i = 0; i < items.length; i++) {
                                (function (item) {
                                    var card = document.createElement('div');
                                    card.className = 'sxq-choice-card';
                                    card.innerHTML = '<div class="sxq-choice-card-selected"></div><div class="sxq-choice-card-title"></div><div class="sxq-choice-card-info"></div>';
                                    card.children[1].textContent = item.title || get.translation(item.id) || String(item.id);
                                    card.children[2].innerHTML = item.info || get.translation(item.id + '_info') || '';
                                    card.onclick = function () {
                                        var cards = list.querySelectorAll('.sxq-choice-card');
                                        for (var j = 0; j < cards.length; j++) cards[j].classList.remove('sxq-selected');
                                        card.classList.add('sxq-selected');
                                        selected = item.id;
                                        confirm.classList.remove('disabled');
                                        helper.playSelectedVfxLocal(session, card);
                                    };
                                    card.ondblclick = function () {
                                        if (selected == item.id) finish(selected);
                                    };
                                    list.appendChild(card);
                                })(items[i]);
                            }
                            confirm.onclick = function () {
                                if (confirm.classList.contains('disabled') || selected == null) return;
                                finish(selected);
                            };
                            cancel.onclick = function () { finish(null); };
                            session.finishChoice = finish;
                            return true;
                        },
                        canUseCustomChoice: function (chooser) {
                            if (typeof document == 'undefined' || !chooser) return false;
                            if (_status.connectMode) return false;
                            if (chooser == game.me) return true;
                            if (chooser.isUnderControl) {
                                try { return chooser.isUnderControl(true); }
                                catch (e) {}
                            }
                            return false;
                        },
                        chooseFullscreen: function (event, type, chooser, effectOwner, items, prompt, aiChoice, allowCancel, target) {
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            if (!helper.canUseCustomChoice(chooser) || !items || !items.length) return false;
                            var session = helper.startSelectionLocal(type, effectOwner || chooser, true);
                            if (target) helper.attachTargetLocal(type, effectOwner || chooser, target);
                            var completed = function (value) {
                                event._result = value == null ? { bool: false } : { bool: true, control: value };
                                helper.stopSessionLocal(type, effectOwner || chooser);
                                if (game.resume) game.resume();
                            };
                            if (!helper.renderChoiceLocal(session, items, prompt, allowCancel, completed)) {
                                helper.stopSessionLocal(type, effectOwner || chooser);
                                return false;
                            }
                            event.switchToAuto = function () {
                                var value = typeof aiChoice == 'function' ? aiChoice() : aiChoice;
                                if (value == null && items.length) value = items[0].id;
                                if (session.finishChoice) session.finishChoice(value);
                            };
                            if (game.pause) game.pause();
                            return true;
                        },
                        playConfirmLocal: function (owner, target) {
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            if (target) helper.playOnceLocal('flower', 'play', {
                                speed: 0.92,
                                scale: 0.66,
                                x: [0, 0.5],
                                y: [0, 0.5],
                                parent: target,
                            });
                        },
                        opening: function (type, owner) {
                            this.startSelectionLocal(type, owner, false);
                        },
                        selectTarget: function (type, owner, target) {
                            this.attachTargetLocal(type, owner, target);
                        },
                        finish: function (type, owner, target, confirmed) {
                            var helper = lib.skill.ca_xiaoqiao_vfx;
                            helper.stopSessionLocal(type, owner);
                            if (confirmed) {
                                if (game.broadcastAll) game.broadcastAll(function (owner, target) {
                                    var current = lib.skill.ca_xiaoqiao_vfx;
                                    if (current) current.playConfirmLocal(owner, target);
                                }, owner, target);
                                else helper.playConfirmLocal(owner, target);
                            }
                        },
                    },

                    ca_heyun: {
                        enable: 'phaseUse',
                        usable: 2,
                        audio: "ext:势小乔:2",
                        getComparableSkills: function (player) {
                            return player.getSkills(null, false, false).filter(function (skill) {
                                var info = lib.skill[skill];
                                var doudizhuSpecial = skill == 'feiyang' || skill == 'bahu';
                                if (!info) return false;
                                if (!doudizhuSpecial && (info.charlotte || info.hiddenSkill || info.equipSkill || info.sub)) return false;
                                if (!lib.translate[skill] || !lib.translate[skill + '_info']) return false;
                                return true;
                            });
                        },
                        getCommonSkills: function (player, target) {
                            var list1 = lib.skill.ca_heyun.getComparableSkills(player);
                            var list2 = lib.skill.ca_heyun.getComparableSkills(target);
                            return list1.filter(function (skill) {
                                return list2.indexOf(skill) != -1;
                            });
                        },
                        hasCommonSkillCharacter: function (player) {
                            if (player && player.isIn()) return true;
                            return game.hasPlayer(function (current) {
                                return current != player && current.isIn() && lib.skill.ca_heyun.getCommonSkills(player, current).length > 0;
                            });
                        },
                        getLoseableSkills: function (target) {
                            return target.getSkills(null, false, false).filter(function (skill) {
                                var info = lib.skill[skill];
                                var doudizhuSpecial = skill == 'feiyang' || skill == 'bahu';
                                if (!info) return false;
                                if (!doudizhuSpecial && (info.charlotte || info.hiddenSkill || info.equipSkill || info.sub)) return false;
                                if (!lib.translate[skill] || !lib.translate[skill + '_info']) return false;
                                return true;
                            });
                        },
                        removeChosenSkill: function (target, skill) {
                            if (!target || !skill) return;
                            if (target.storage.ca_yinhui_skill == skill) {
                                lib.skill.ca_yinhui.clearGainedSkill(target);
                            }
                            else if (target.removeSkill) {
                                target.removeSkill(skill);
                            }
                        },
                        filter: function (event, player) {
                            return lib.skill.ca_heyun.getLoseableSkills(player).length > 0 &&
                                lib.skill.ca_heyun.hasCommonSkillCharacter(player);
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget(true, '合韵：选择你或一名与你有相同技能的角色，然后你失去一个技能并令其摸两张牌', function (card, player, target) {
                                if (!target.isIn()) return false;
                                if (target == player) return true;
                                return lib.skill.ca_heyun.getCommonSkills(player, target).length > 0;
                            }).set('ai', function (target) {
                                return get.attitude(_status.event.player, target);
                            });
                            'step 1'
                            if (!result.bool) {
                                event.finish();
                                return;
                            }
                            event.target = result.targets[0];
                            player.logSkill('ca_heyun', event.target);
                            event.skills = lib.skill.ca_heyun.getLoseableSkills(player);
                            if (!event.skills.length) {
                                event.finish();
                                return;
                            }
                            event.loseSkillItems = event.skills.map(function (skill) {
                                return {
                                    id: skill,
                                    title: get.translation(skill),
                                    info: get.translation(skill + '_info'),
                                };
                            });
                            event.loseSkillAI = function () {
                                var best = event.skills[0];
                                var rank = Infinity;
                                for (var i = 0; i < event.skills.length; i++) {
                                    var value = get.skillRank ? get.skillRank(event.skills[i], 'in') : 1;
                                    if (value < rank) {
                                        rank = value;
                                        best = event.skills[i];
                                    }
                                }
                                return best;
                            };
                            if (lib.skill.ca_xiaoqiao_vfx.chooseFullscreen(
                                event,
                                'heyun',
                                player,
                                player,
                                event.loseSkillItems,
                                '合韵：请选择你要失去的一个技能',
                                event.loseSkillAI,
                                false,
                                event.target
                            )) return;
                            player.chooseControl(event.skills).set('choiceList', event.skills.map(function (skill) {
                                return '失去技能〖' + get.translation(skill) + '〗：' + get.translation(skill + '_info');
                            })).set('prompt', '合韵：请选择你要失去的一个技能').set('ai', function () {
                                var list = _status.event.controls;
                                var best = list[0];
                                var rank = Infinity;
                                for (var i = 0; i < list.length; i++) {
                                    var value = get.skillRank ? get.skillRank(list[i], 'in') : 1;
                                    if (value < rank) {
                                        rank = value;
                                        best = list[i];
                                    }
                                }
                                return best;
                            });
                            'step 2'
                            if (!result.control) {
                                lib.skill.ca_xiaoqiao_vfx.finish('heyun', player, event.target, false);
                                event.finish();
                                return;
                            }
                            event.loseSkill = result.control;
                            lib.skill.ca_heyun.removeChosenSkill(player, event.loseSkill);
                            game.log(player, '失去了技能', '#g〖' + get.translation(event.loseSkill) + '〗');
                            lib.skill.ca_xiaoqiao_vfx.finish('heyun', player, event.target, false);
                            event.target.draw(2);
                        },
                        ai: {
                            order: 7,
                            result: {
                                player: function (player) {
                                    var skills = lib.skill.ca_heyun.getLoseableSkills(player);
                                    var min = Infinity;
                                    for (var i = 0; i < skills.length; i++) {
                                        var rank = get.skillRank ? get.skillRank(skills[i], 'in') : 1;
                                        min = Math.min(min, rank || 1);
                                    }
                                    return min <= 1 ? 1 : 0;
                                },
                            },
                        },
                    },

                    ca_yinhui: {
                        trigger: { global: 'roundStart' },
                        direct: true,
                        lastDo: true,
                        priority: -100,
                        audio: "ext:势小乔:2",
                        group: ['ca_yinhui_feiyang', 'ca_yinhui_bahu'],
                        onremove: function (player) {
                            lib.skill.ca_yinhui.clearGainedSkill(player);
                        },
                        getGainableSkills: function (target, player) {
                            return target.getSkills(null, false, false).filter(function (skill) {
                                var info = lib.skill[skill];
                                var doudizhuSpecial = skill == 'feiyang' || skill == 'bahu';
                                // 飞扬、跋扈虽然是欢乐斗地主的charlotte模式技能，但允许被音洄获得。
                                if (!info) return false;
                                if (!doudizhuSpecial && (info.charlotte || info.hiddenSkill || info.equipSkill || info.sub)) return false;
                                if (!lib.translate[skill] || !lib.translate[skill + '_info']) return false;
                                if (player.hasSkill(skill, null, false, false) && skill != player.storage.ca_yinhui_skill) return false;
                                return true;
                            });
                        },
                        clearGainedSkill: function (player) {
                            if (!player) return;
                            if (player.enableSkill) {
                                try {
                                    player.enableSkill('ca_yinhui_limit');
                                }
                                catch (e) {}
                            }
                            if (player.removeAdditionalSkill) player.removeAdditionalSkill('ca_yinhui_gain');
                            delete player.storage.ca_yinhui_skill;
                            delete player.storage.ca_yinhui_count;
                            if (player.unmarkSkill) player.unmarkSkill('ca_yinhui_mark');
                            if (player.syncStorage) player.syncStorage('ca_yinhui_skill');
                        },
                        runNewRoundStartSkill: function (player, skill, roundEvent) {
                            var info = lib.skill[skill];
                            if (!player || !skill || !info || !info.trigger || !info.trigger.global) return;

                            var timings = Array.isArray(info.trigger.global)
                                ? info.trigger.global
                                : [info.trigger.global];
                            if (timings.indexOf('roundStart') == -1) return;

                            // 必须通过本体 createTrigger 进入标准触发流程。
                            // 直接 setContent(info.content) 会跳过技能归属检查、触发日志、
                            // sourceSkill、子技能和部分扩展自定义的触发初始化。
                            if (typeof game.createTrigger == 'function') {
                                game.createTrigger(
                                    'roundStart',
                                    skill,
                                    player,
                                    roundEvent || _status.event
                                );
                            }
                        },
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current != player && current.isIn() && lib.skill.ca_yinhui.getGainableSkills(current, player).length > 0;
                            });
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget(get.prompt('ca_yinhui'), '选择一名其他角色，清除你此前通过“音洄”获得的技能，然后获得其当前拥有的一个技能', function (card, player, target) {
                                return target != player && target.isIn() && lib.skill.ca_yinhui.getGainableSkills(target, player).length > 0;
                            }).set('ai', function (target) {
                                var skills = lib.skill.ca_yinhui.getGainableSkills(target, _status.event.player);
                                var value = 0;
                                for (var i = 0; i < skills.length; i++) {
                                    var rank = get.skillRank ? get.skillRank(skills[i], 'in') : 1;
                                    value = Math.max(value, rank);
                                }
                                return value;
                            });
                            'step 1'
                            if (!result.bool) {
                                event.finish();
                                return;
                            }
                            event.target = result.targets[0];
                            event.skills = lib.skill.ca_yinhui.getGainableSkills(event.target, player);
                            if (!event.skills.length) {
                                event.finish();
                                return;
                            }
                            event.yinhuiItems = event.skills.map(function (skill) {
                                return {
                                    id: skill,
                                    title: get.translation(skill),
                                    info: get.translation(skill + '_info'),
                                };
                            });
                            event.yinhuiAI = function () {
                                var best = event.skills[0];
                                var rank = -Infinity;
                                for (var i = 0; i < event.skills.length; i++) {
                                    var value = get.skillRank ? get.skillRank(event.skills[i], 'in') : 1;
                                    if (value > rank) {
                                        rank = value;
                                        best = event.skills[i];
                                    }
                                }
                                return best;
                            };
                            if (lib.skill.ca_xiaoqiao_vfx.chooseFullscreen(
                                event,
                                'yinhui',
                                player,
                                player,
                                event.yinhuiItems,
                                '请选择' + get.translation(event.target) + '的一个武将技能',
                                event.yinhuiAI,
                                true,
                                event.target
                            )) return;
                            player.chooseControl(event.skills).set('choiceList', event.skills.map(function (skill) {
                                return '获得技能〖' + get.translation(skill) + '〗：' + get.translation(skill + '_info');
                            })).set('prompt', '音洄：请选择获得' + get.translation(event.target) + '的一个技能').set('ai', function () {
                                var list = _status.event.controls;
                                var best = list[0];
                                var rank = -Infinity;
                                for (var i = 0; i < list.length; i++) {
                                    var value = get.skillRank ? get.skillRank(list[i], 'in') : 1;
                                    if (value > rank) {
                                        rank = value;
                                        best = list[i];
                                    }
                                }
                                return best;
                            });
                            'step 2'
                            if (!result.control) {
                                lib.skill.ca_xiaoqiao_vfx.finish('yinhui', player, event.target, false);
                                event.finish();
                                return;
                            }
                            event.gainSkill = result.control;
                            event.oldGainSkill = player.storage.ca_yinhui_skill;
                            player.logSkill('ca_yinhui', event.target);

                            
                            if (event.oldGainSkill == event.gainSkill) {
                                var additional = player.additionalSkills && player.additionalSkills.ca_yinhui_gain;
                                var stillOwned = false;
                                if (typeof additional == 'string') {
                                    stillOwned = additional == event.gainSkill;
                                }
                                else if (Array.isArray(additional)) {
                                    stillOwned = additional.indexOf(event.gainSkill) != -1;
                                }
                                if (!stillOwned) {
                                    player.addAdditionalSkill('ca_yinhui_gain', event.gainSkill, true, true);
                                }
                                player.storage.ca_yinhui_skill = event.gainSkill;
                                delete player.storage.ca_yinhui_count;
                                if (player.syncStorage) player.syncStorage('ca_yinhui_skill');
                                player.markSkill('ca_yinhui_mark');
                                lib.skill.ca_xiaoqiao_vfx.finish('yinhui', player, event.target, true);
                                game.log(player, '通过', '#g〖音洄〗', '保留了技能', '#g〖' + get.translation(event.gainSkill) + '〗');
                                event.finish();
                                return;
                            }

                            lib.skill.ca_yinhui.clearGainedSkill(player);
                            player.addAdditionalSkill('ca_yinhui_gain', event.gainSkill, false, true);
                            player.storage.ca_yinhui_skill = event.gainSkill;
                            delete player.storage.ca_yinhui_count;
                            if (player.syncStorage) player.syncStorage('ca_yinhui_skill');
                            player.markSkill('ca_yinhui_mark');
                            lib.skill.ca_xiaoqiao_vfx.finish('yinhui', player, event.target, true);
                            game.log(player, '通过', '#g〖音洄〗', '获得了技能', '#g〖' + get.translation(event.gainSkill) + '〗');

                            
                            var ownedSkills = player.getSkills ? player.getSkills(null, false, false).slice(0) : [];
                            if (game.expandSkills) game.expandSkills(ownedSkills);
                            if (ownedSkills.indexOf(event.gainSkill) != -1) {
                                lib.skill.ca_yinhui.runNewRoundStartSkill(player, event.gainSkill, trigger);
                            }
                            else {
                                game.log(player, '通过音洄获得的技能注册失败：', '#g〖' + get.translation(event.gainSkill) + '〗');
                            }
                        },
                    },

                    ca_yinhui_feiyang: {
                        charlotte: true,
                        popup: false,
                        trigger: { player: 'phaseJudgeBegin' },
                        direct: true,
                        filter: function (event, player) {
                            return player != game.zhu &&
                                player.storage.ca_yinhui_skill == 'feiyang' &&
                                player.countCards('j') > 0 &&
                                player.countCards('he') > 1;
                        },
                        content: function () {
                            'step 0'
                            player.chooseToDiscard(
                                'he',
                                2,
                                get.prompt('feiyang'),
                                '弃置两张牌，然后弃置判定区里的所有牌'
                            ).set('logSkill', 'feiyang').set('ai', function (card) {
                                var player = _status.event.player;
                                if (player.hasSkillTag && player.hasSkillTag('rejudge') && player.countCards('j') < 2) return 0;
                                return 6 - get.value(card);
                            });
                            'step 1'
                            if (result.bool && player.countCards('j')) {
                                player.discardPlayerCard(player, 'j', true, player.countCards('j'));
                            }
                        },
                    },

                    ca_yinhui_bahu: {
                        charlotte: true,
                        popup: false,
                        trigger: { player: 'phaseZhunbeiBegin' },
                        forced: true,
                        filter: function (event, player) {
                            return player != game.zhu && player.storage.ca_yinhui_skill == 'bahu';
                        },
                        content: function () {
                            player.draw();
                        },
                        mod: {
                            cardUsable: function (card, player, num) {
                                if (player != game.zhu &&
                                    player.storage.ca_yinhui_skill == 'bahu' &&
                                    card.name == 'sha') {
                                    return num + 1;
                                }
                            },
                        },
                    },


                    ca_yinhui_mark: {
                        charlotte: true,
                        mark: true,
                        marktext: '洄',
                        intro: {
                            content: function (storage, player) {
                                var skill = player.storage.ca_yinhui_skill;
                                if (!skill) return '当前未通过“音洄”获得技能';
                                return '当前通过“音洄”获得：〖' + get.translation(skill) + '〗<br>该技能没有发动次数限制';
                            },
                        },
                    },
                },
                translate: {
                    ca_heyun: '合韵',
                    ca_heyun_info: '出牌阶段限两次，你可选择你或一名与你有相同技能的角色，然后你失去一个技能并令其摸两张牌。',
                    ca_yinhui: '音洄',
                    ca_yinhui_info: '每轮开始时，你可以清除此前通过此技能获得的其他技能，然后选择一名其他角色当前拥有的一个技能并获得之。',
                    ca_yinhui_mark: '音洄',
                },
            },
            intro: '势小乔美化版',
            author: 'soyo',
            diskURL: '',
            forumURL: '',
            version: '1.5.1-yinhui-standard-trigger-fix',
        },
        files: {
            character: ['ca_xiaoqiao.jpg'],
            card: [],
            skill: [],
        },
    };
};
