/**
 * 假装无敌扩展 - 引导程序 (Bootstrapper)
 * 负责异步加载核心模块并初始化
 */

window.qyPreContent = async function (lib, game, ui, get, ai, _status, config) {
    try {
        // 异步加载皮肤核心引擎
        const { SkinCore } = await lib.qyUtils.importModule('./js/skin/modules/skinCore/index.js');
        // 初始化核心接口 (qyGetSkinList, qyGetSkinLevel 等)
        SkinCore.init(lib, game);
    } catch (e) {
        console.error('[Mobeil] Failed to initialize SkinCore:', e);
    }
};

window.qyImport(function (lib, game, ui, get, ai, _status) {
    if (!lib.qyLoading) {
        return console.error("Mobeil: 关键工具未加载！！！");
    }

    _status.qyPhotoImages = {};

    const mods = {
        OVERRIDE: 'override',
        PUSH: 'push',
        OVERRIDE_SUPER: 'override_super',
    };

    function override(dest, src) {
        var ok = true;
        var key;
        for (key in src) {
            if (dest[key]) {
                ok = override(dest[key], src[key]);
                if (ok) {
                    dest[key] = src[key];
                }
            } else {
                dest[key] = src[key];
            }
            ok = false;
        }
        return ok;
    }

    function overrides(dest, src) {
        if (!dest._super) dest._super = {};
        for (const key in src) {
            const { value, mode } = src[key];
            switch (mode) {
                case mods.OVERRIDE:
                    dest[key] = value;
                    break;
                case mods.PUSH:
                    if (!dest[key] || !Array.isArray(dest[key])) {
                        dest[key] = [];
                    }
                    dest[key] = dest[key].concat(value);
                    break;
                case mods.OVERRIDE_SUPER:
                    if (dest[key])
                        dest._super[key] = dest[key];
                    dest[key] = value;
                    break;
            }
        }
    }

    // 武将节点扩展
    const Player = (function (Player) {
        Player._super = {};
        Player.inits = {
            value: [async function (player) {
                if (player.changeSkinElement) return;

                try {
                    const { PlayerOverride } = await lib.qyUtils.importModule('./js/skin/modules/skinSwitcher/index.js');
                    PlayerOverride.inits[0].call(this, player);
                } catch (e) {
                    console.error('Failed to load PlayerOverride:', e);
                }
            }],
            mode: mods.PUSH,
        };
        Player.reinits = { value: [], mode: mods.OVERRIDE };
        Player.uninits = { value: [], mode: mods.OVERRIDE };
        Player.reinit = {
            value() {
                const args = arguments;
                this._super.reinit.apply(this, args);
                lib.element.player.reinits.forEach((func) => func.apply(this, args));
            },
            mode: mods.OVERRIDE_SUPER,
        };
        Player.uninit = {
            value() {
                const args = arguments;
                this._super.uninit.apply(this, args);
                lib.element.player.uninits.forEach((func) => func.apply(this, args));
            },
            mode: mods.OVERRIDE_SUPER,
        };
        return Player;
    })({});

    lib.qyArenaReadyPushOrRunStart(() => {
        overrides(lib.element.player, Player);
        override(window, window.overrideFunc);
        game.players.forEach(player => overrides(player, Player));
    });

    // 覆盖或新增方法
    window.overrideFunc = {
        lib: {
            async openSelectSkinDialog(avatar) {
                try {
                    const { openSelectSkinDialog } = await lib.qyUtils.importModule('./js/skin/modules/skinSwitcher/index.js');
                    return openSelectSkinDialog(avatar);
                } catch (e) {
                    alert('皮肤选择对话框加载失败。');
                }
            },
        },
        game: {
            async openChangeSkinWindow(name, player, isZhuJiang) {
                try {
                    const { openChangeSkinWindow } = await lib.qyUtils.importModule('./js/skin/modules/skinSwitcher/index.js');
                    return await openChangeSkinWindow(name, player, isZhuJiang);
                } catch (e) {
                    alert('皮肤切换窗口加载失败。');
                }
            },
        },
    };
});
