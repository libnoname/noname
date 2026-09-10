const isArray = Array.isArray;

/**
 * 将字符串转为可执行的function
 * @param strFunc function.toString()
 */
function parseFunction(strFunc) {
    return eval(`(${strFunc})`)
}

/* 判断这个数值是否正确有效的 */
const numberRegExp = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
function isCorrectNumber(value) {
    if (!numberRegExp.test(value)) return false;
    value = parseFloat(value);
    return Number.isFinite(value) && !Number.isNaN(value);
}


const qyWorkerAction = {
    IS_IMAGE_OUTCROP: 'IS_IMAGE_OUTCROP',
    CANCEL: 'CANCEL',
    CREATE: 'CREATE',
    HAS_APPLICATION: 'HAS_APPLICATION',
    INFO: 'INFO',
    PLAY_SPINE: 'PLAY_SPINE',
    PLAY_LINE: 'PLAY_LINE',
    UPDATE: 'UPDATE',
    STOP: 'STOP',
    STOP_ALL: 'STOP_ALL',
    LOAD_SPINE: 'LOAD_SPINE',
    REST_APPLICATION_VIEW: 'REST_APPLICATION_VIEW',
    DESTROY_APP: 'DESTROY_APP',
    DESTROY_SPINE: 'DESTROY_SPINE',
    DESTROY_APP_ALL: 'DESTROY_APP_ALL',
    DESTROY_SPINE_ALL: 'DESTROY_SPINE_ALL',
    LOAD_BUNDLE: 'LOAD_BUNDLE',
    PLAY_DYNAMIC: 'PLAY_DYNAMIC',
    STOP_DYNAMIC: 'STOP_DYNAMIC',
    PLAY_ACTION: 'PLAY_ACTION',
    COMMON_ANIMATION_INIT: 'COMMON_ANIMATION_INIT',
};

globalThis.qyWorkerAction = { ...qyWorkerAction };
const {
    IS_IMAGE_OUTCROP,
    CANCEL,
    CREATE,
    HAS_APPLICATION,
    INFO,
    PLAY_SPINE,
    PLAY_LINE,
    UPDATE,
    STOP,
    STOP_ALL,
    LOAD_SPINE,
    REST_APPLICATION_VIEW,
    DESTROY_APP,
    DESTROY_SPINE,
    DESTROY_APP_ALL,
    DESTROY_SPINE_ALL,
    LOAD_BUNDLE,
    PLAY_DYNAMIC,
    STOP_DYNAMIC,
    PLAY_ACTION,
    COMMON_ANIMATION_INIT,
} = qyWorkerAction;

const defENVSettings = {
    baseUrl: '',
}

/**
 * 指示线类型
 * @type {{STRETCH: number, MOVE: number}} STRETCH: 拉伸；MOVE: 移动；
 */
const LINE_TYPE = {
    STRETCH: 1,
    MOVE: 2,
    STRETCH_SECTION: 3,
}
globalThis.qyLineType = {...LINE_TYPE}

const FUNC_PREFIX = 'func:'

// 加载失败的特效路径
const LOAD_ERROR_FILE_SET = new Set();
/**
 * 缓存
 * @type {Set<Spine2D | Sprite2D>}
 */
globalThis.qyCacheAnimation = new Set();


'use strict';
class Base2D {
    #container

    get container() {
        // 子类实现
        return this.#container;
    }
    /**
     * 构造
     */
    constructor({container}) {
        this.#container = container;
    }
    /**
     * 获取要以移动过去的值
     * @param value 要计算的值 ['append', ''] 在当前的基础上追加，也可简写为[50] <br/> [100, 0.6] 暂时还没想好，目前是两个数值追加
     * @param originValue
     * @returns {*}
     */
    getMoveMergeValue(value, originValue = 0) {
        if (Array.isArray(value)) {
            const [operation, newValue] = value.length === 1 ? ['append', parseFloat(value[0])] : value;
            if (operation === 'append') {
                value = originValue + newValue;
            } else {
                value = operation + originValue * newValue;
            }
        }
        return value;
    }

    // container的x，y轴移动
    move(x, y) {
        if (!this.container) return;
        x = this.getMoveMergeValue(x, this.container?.x);
        y = this.getMoveMergeValue(y, this.container?.y);
        if (isCorrectNumber(x)){
            this.container.x = x;
        }
        if (isCorrectNumber(y)) {
            this.container.y = y;
        }
    }

    /** 如果pixi的key存在, 则不进行加载, 原来pixi会进行覆盖 */
    addPixiResource(alias, src, data = {}) {
        if (!PIXI.Assets.cache.has(src) && !PIXI.Assets.cache.has(alias)) {
            PIXI.Assets.add({alias, src, data});
        }
    }


    getUrl({baseUrl = '', animationPath = '', dynamicPath = ''}, {name, baseUrl: fullBaseURL, baseURL: optionsBaseUrl}){
        dynamicPath = fullBaseURL ??  (baseUrl + (optionsBaseUrl ?? (dynamicPath || animationPath)));
        return new URL(name, dynamicPath).toString();
    }

    ease(obj2D, attributes, duration = 1000) {
        const ease = new Ease.Ease()
        ease.add(obj2D, attributes, {repeat: false, duration});
        return ease;
    }

}
'use strict';
globalThis.qyAnimation = class Spine2D extends Base2D {

    #source_position = {
        x: undefined,
        y: undefined,
        action: undefined,                                      // 播放的动画，如果没有，则播放默认的动画
        speed: 1,                                               // 动画播放速度
        rotation: 0,                                            // 旋转角度
        // spine本身缩放
        scale: undefined,                                       // spine scale 如果为数组[scaleX,scaleY]，否则就是scaleX = scaleY = scale
        scaleX: undefined,                                      // spine X轴缩放 @{link getMoveMergeValue}
        scaleY: undefined,                                      // spine Y轴缩放 @{link getMoveMergeValue}
        // spine的骨架skeleton缩放
        skeScale: undefined,                                    // skeleton 缩放 @{link spine scale}
        skeScaleX: undefined,                                   // skeleton X轴缩放 @{link getMoveMergeValue}
        skeScaleY: undefined,                                   // skeleton Y轴缩放 @{link getMoveMergeValue}
        // spine的骨架skeleton的坐标移动
        skeX: undefined,                                        // skeleton的坐标移动 X轴
        skeY: undefined,                                        // skeleton的坐标移动 Y轴
        // 自动居中屏幕
        autoCenter: false,
        // 播放完动画后自动销毁，只有loop为false时才会生效
        autoDestroy: true,
        // 默认不会循环播放
        loop: false,
        // 位置是否居中
        centerPosition: false,
        // 是否适应屏幕缩放（骨骼大小不一致有误差）
        autoScale: false,
        // 跟随上级定位
        parent: undefined,
        // 加载完毕后触发的事件，只要有资源必会触发 回调 resources 参数
        onLoad: [],
        prepLoad: undefined,                                     // 预加载spine的事件，在此可以更改骨骼位置
        loopCount: -1,                                           // 播放多少遍自动销毁，需配合loop或者多次播放动画
        fileType: '.skel',                                       // ['.skel'，'.json']
        alpha: 1,                                               // 透明度
        baseUrl: null,                                            // 基础路径
    };
    // 加载完毕spine后的事件
    #onLoad = [];
    // 加载素材失败的事件
    #onError = [(error, spineName, resource, resources) => {        // 删掉加载失败的
        globalThis?.lib?.qyMessage?.queueMessageError(`${spineName}：特效不存在或无法解析，请检查，如果放入文件，请重启游戏！`);
        LOAD_ERROR_FILE_SET.add(spineName);
    }, (spineName, resource, resources) => {
        PIXI.Assets.unload(spineName);
    }];
    #loopCount = 0;                                             // 播放了多少遍
    // 容器
    #container = null;
    currentAnimation = null
    id;
    position;

    constructor(app = null, position = {}) {
        const container = new PIXI.Container();
        super({container});
        this.id = qyAnimationUtil.generatorUUID();
        this.app = app;
        this.#container = container;
        if (this.app) {
            this.app.stage.addChild(this.#container);
        }
        this.spine = null;
        this.dragZoom = null;
        this.position = {};
        this.isLoading = false;
        Object.assign(this.position, this.#source_position, position);
        globalThis.qyCacheAnimation.add(this);
    }

    // Application的第一个子节点包裹层
    get stage() {
        return this.app?.stage
    }

    // ske骨骼
    get ske() {
        return this.spine?.skeleton || null;
    }

    // 不透明度
    get alpha() {
        return this.spine?.alpha
    }

    set alpha(v) {
        if (this.alpha === undefined) return;
        this.spine.alpha = parseFloat(v)
    }

    // 包容器
    get container() {
        return this.#container;
    }

    // WebGL状态
    get state() {
        return this.spine?.state || null;
    }

    get rotation() {
        return this.spine?.rotation ?? null;
    }

    // spine旋转
    set rotation(v) {
        if (this.rotation === null) return;
        this.spine.rotation = parseFloat(v);
    }

    // 获取所有的动画
    get animations() {
        if (!this.spine?.spineData) return [];
        return this.spine.spineData.animations;
    }

    // 获取动画名称
    get animationNameList() {
        return this.animations.map(({ name }) => name);
    }

    // 获取默认的动画
    get defaultAnimation() {
        return this.animations[0];
    }

    // 获取默认的动画名称
    get defaultAnimationName() {
        return this.defaultAnimation?.name;
    }

    // 获取当前播放动画的轨道
    get currentTrack() {
        return this.state?.getCurrent(0);
    }

    // 当前动画播放速度
    get timeScale() {
        return this.currentTrack?.timeScale || this.state?.timeScale;
    }

    set timeScale(v) {
        if (!this.currentTrack) return;
        this.currentTrack.timeScale = parseFloat(v);
    }

    // container的XY轴 container的移动跟屏幕一致
    get skeX() {
        return this.container?.x ?? null
    }

    set skeX(v) {
        if (v === null || v === undefined || this.skeX === null) return;
        this.move(v);
    }

    get skeY() {
        return this.container?.y ?? null
    }

    set skeY(v) {
        if (v === null || v === undefined || this.skeY === null) return;
        this.move(null, v);
    }

    get zIndex() {
        return this.container?.zIndex ?? null
    }

    set zIndex(v) {
        if (!isCorrectNumber(v) || this.zIndex === null) {
            return
        }
        this.container.zIndex = parseFloat(v);
    }

    get angle() {
        return this.spine.angle - 180;
    }

    set angle(v) {
        v = this.getMoveMergeValue(v, this.angle);
        this.spine.angle = v + 180;
    }

    /**
     * 当前动画时长
     * @return {number|null}
     */
    get currentAnimationTime(){
        return this.currentTrack?.animationEnd ?? null;
    }

    async loadSpine2D(spineSrc, position = this.#source_position) {
        if (this.isLoading) {
            return true;
        }
        let suffix = '.skel'
        if (this.position?.fileType === 'json' || position.isJson) suffix = '.json'
        const keysIn = spineSrc + suffix;
        const url = this.getUrl(position.env ?? this.app?.ENVSettings ?? {}, {...position, name: keysIn,});
        this.addPixiResource(keysIn, url, {});
        try {
            const resource = await PIXI.Assets.load(keysIn);
            // 预加载
            if (typeof position.prepLoad === 'function') position.prepLoad(resource.spineData, resource);
            // 创建实例spine
            this.spine = new PIXI.spine.Spine(resource.spineData);
            if (!this.position) this.position = {};
            this.prepSpine2D(Object.assign(this.position, this.#source_position, position));
            this.spineName = keysIn;
            this.isLoading = true;
            while (this.#onLoad.length) this.#onLoad.pop().call(this, resource.spineData, resource);
            return true;
        } catch (e) {
            while (this.#onError.length) this.#onError.pop().call(this, e, spineSrc, PIXI.Assets.get(spineSrc));
            throw e;
        }
    }

    // 准备spine动画，设置位置和添加到舞台，也可以用于更新，反正大部分逻辑都写好了
    prepSpine2D(position) {
        if (!this.spine) return;
        let {
            x, y, skeX, skeY, event, events, parent, loop, autoDestroy, rotation, alpha, zIndex
        } = position;
        // 居中
        this.#centerSpine(position);
        // spine移动
        this.move(x, y);
        // spine缩放
        this.#scaleSpine(position);

        // 跟随
        if (parent !== null) {
            // 兼容Worker
            const { x, y } = qyAnimationUtil.getCenter(parent);
            this.move(x, y);
        }

        // skeleton骨架移动
        this.move(skeX, skeY);
        // skeleton骨架缩放
        this.#scaleContainer(position);
        // 添加事件
        if (Array.isArray(events)) {
            events.forEach(evt => this.addListener(evt));
        }
        // 添加事件
        if (event) {
            this.addListener(event);
        }
        // 播放完了就销毁，释放资源
        if (autoDestroy && !loop) {
            this.addListener({
                complete: (entry) => {
                    this.#loopCount++;
                    const loopCount = this.position?.loopCount;
                    if (loopCount) {
                        if (this.#loopCount < loopCount) return;
                    }
                    this.destroySpine();
                }
            });
        }
        // 添加上加载完毕后的事件
        if (typeof position.onLoad === 'function') position.onLoad = [position.onLoad];
        if (Array.isArray(position.onLoad)) {
            this.#onLoad.push(...position.onLoad);
            delete position.onLoad;
        }

        // 添加上加载失败的事件
        if (typeof position.onError === 'function') position.onError = [position.onError];
        if (Array.isArray(position.onError)) {
            this.#onError.push(...position.onError);
            delete position.onError;
        }
        if (isCorrectNumber(zIndex)) {
            this.zIndex = zIndex;
        }
        if (isCorrectNumber(alpha)) {
            this.alpha = alpha;
        }
        // 添加到舞台
        if (this.spine.parent !== this.container) {
            this.container.addChild(this.spine);
        }
    }

    // 内部方法，缩放
    #scaleSpine({ scale, scaleX, scaleY }) {
        // 缩放
        if (isCorrectNumber(scale)) {
            scaleX = scale
            scaleY = scale
        }
        this.scaleSpine(scaleX, scaleY);
    }

    // skeleton骨架缩放
    #scaleContainer({ skeScale, skeScaleX, skeScaleY }) {
        // 缩放
        if (isCorrectNumber(skeScale)) {
            skeScaleX = skeScale
            skeScaleY = skeScale
        }
        if (isArray(skeScale)) {
            skeScaleX = skeScale[0]
            skeScaleY = skeScale[1]
        }

        this.scaleContainer(skeScaleX, skeScaleY);
    }

    // 内部方法，居中缩放
    #centerSpine({ autoCenter, centerPosition, autoScale }) {
        let options = { isPosition: false, isScale: false }
        if (centerPosition) options.isPosition = true;
        if (autoScale) options.isScale = true;
        if (autoCenter) options.isPosition = options.isScale = true;
        this.centerSpine(options);
        // this.resizeObserver = new ResizeObserver(entries => {
        //     entries.forEach(entry => {
        //         this.centerSpine(options)
        //     });
        // });
        // this.resizeObserver.observe(document.body)
    }

    // 居中
    centerSpine({ isPosition, isScale }) {
        if (!this.spine || !this.app) return;
        const { width, height } = this.app.renderer.screen;
        // 是否缩放
        if (isScale) {
            const { x } = this.getScaleSpine();
            let originWidth = Math.floor(this.spine.width) / x;
            let scale = ((Math.floor(width) / Math.floor(originWidth))).toFixed(2)
            this.scaleSpine(scale, scale);
        }
        // 是否居中
        if (isPosition) {
            this.move(width / 2, height / 2)
        }
    }

    // 移动骨骼位置 - 废弃
    moveSpine(x, y) {
        this.move(x, y);
    }

    // 获取移动的x轴和y轴 - 废弃
    getMoveSpine() {
        return this.getMove();
    }

    // 缩放骨骼
    scaleSpine(scaleX, scaleY) {
        if (!this.spine) return;
        scaleX = this.getMoveMergeValue(scaleX, this.spine.scale.x);
        scaleY = this.getMoveMergeValue(scaleY, this.spine.scale.y);
        if (typeof scaleX === 'number' || isCorrectNumber(scaleX)) {
            this.spine.scale.x = scaleX;
        }
        if (typeof scaleY === 'number' || isCorrectNumber(scaleY)) {
            this.spine.scale.y = scaleY;
        }
    }

    // 获取缩放的x轴和y轴
    getScaleSpine() {
        if (!this.spine) return;
        return { x: this.spine.scale.x, y: this.spine.scale.y }
    }

    // 获取移动的x轴和y轴
    getMove() {
        if (!this.container) {
            return {x: 0, y: 0}
        }
        return {
            x: this.container.x,
            y: this.container.y
        }
    }

    // skeleton骨架缩放
    scaleContainer(scaleX, scaleY) {
        if (!this.container) return;
        scaleX = this.getMoveMergeValue(scaleX, this.container.scale.x);
        scaleY = this.getMoveMergeValue(scaleY, this.container.scale.y);
        if (isCorrectNumber(scaleX)) {
            this.container.scale.x = scaleX;
        }
        if (isCorrectNumber(scaleY)) {
            this.container.scale.y = scaleY;
        }
    }

    // 获取skeleton缩放的x轴和y轴
    getScale() {
        if (!this.container) return;
        return { x: this.container.scale.x, y: this.container.scale.y }
    }

    moveTo(x, y, duration) {
        const ease = new Ease.Ease()
        ease.add(this.container, {x, y}, {repeat: false, duration: duration})
        return ease
    }

    moveToRect({ x, y, width, height }, duration, callable) {
        const targetX = x + width / 2;
        const targetY = y + height / 2;
        const ease = new Ease.Ease()
        ease.add(this.container, {x: targetX, y: targetY}, {repeat: false, duration: duration});
        ease.once('complete', () => {
            if (typeof callable === 'function') callable.call(this);
        })
        return ease;
    }

    addListener(event) {
        if (!this.state) return;
        for (let [key, value] of Object.entries(event)) {
            if (typeof value === 'string') {
                value = parseFunction(value).bind(this);
            } else if (typeof value === 'function') {
                value = value.bind(this);
            }
            event[key] = value
        }
        this.state.addListener(event);
    }

    removeLister(event) {
        if (!this.state) return;
        this.state.removeListener(event);
    }

    clearLister() {
        if (!this.state) return;
        this.state.clearListeners();
    }

    hasAnimation(name) {
        return this.animationNameList.includes(name);
    }

    /**
     * 延迟播放
     * @param {String} animation 动画标签
     * @param {Boolean} loop 是否循环
     * @param {Boolean|Number} delay 延迟时间
     * @return {Promise<true>}
     */
    async delayPlaySpine(animation, loop = true, delay = true) {
        return new Promise(resolve => {
            if (delay === true) {
                requestAnimationFrame(() => {
                    this.playSpine(animation, loop);
                    resolve(true);
                });
            } else if(isCorrectNumber(delay)) {
                setTimeout(() => {
                    this.playSpine(animation, loop);
                    resolve(true);
                }, delay);
            } else {
                this.playSpine(animation, loop);
                resolve(true);
            }
        });
    }

    // 播放spine动画
    playSpine(animation, loop = true) {
        return new Promise( (resolve) => {
            if (!this.isLoading) {
                this.#onLoad.push(async () => {
                    if (!animation) animation = this.defaultAnimationName;
                    if (!animation) return console.error("未找到可播放的动作【" + this.spineName + "】");
                    await this.playSpine(animation, loop);
                    resolve(true);
                });
                return;
            }
            if (!this.state || !animation) return;
            this.state.setAnimation(0, animation, loop);
            this.currentAnimation = animation;
            if (isCorrectNumber(this.position?.speed)) {
                requestAnimationFrame(time => {
                    this.timeScale = this.position?.speed;
                    resolve(true);
                })
            }
        })
    }

    // 更改spine动画
    changeAnimation(animation, loop = true) {
        this.playSpine(animation, loop);
    }

    /**
     *  追加动画
     * @param animation 动画名称
     * @param loop 是否循环
     * @param delay 距离下一次播放延迟多长时间
     */
    addAnimation(animation, loop = false, delay = 0) {
        if (!this.state || !animation) return;
        this.state.addAnimation(0, animation, loop, delay);
    }

    // @Deprecated
    // 获取动画名称
    getAnimationNames() {
        if (!this.state) return;
        return this.spine.spineData.animations.map(Animation => Animation.name);
    }

    findAnimationByName(playAction){
        if (!this.state) return;
        return this.spine.spineData.animations.find(Animation => Animation.name === playAction);
    }


    // 停止动画
    stopAnimation() {
        if (!this.state) return;
        this.state.clearTracks();
    }

    // 销毁spine动画
    destroySpine() {
        // 这个肯定是可以清空的。。。呃呃呃
        this.#onLoad.length = 0;
        globalThis.qyCacheAnimation.delete(this);
        if (!this.spine) {
            this.#onLoad.push(() => {
                this.destroySpine();
            });
            return;
        }
        this.state.clearListeners();
        this.stopAnimation();
        this.destroyDragZoom();
        const spine = this.spine;
        this.spine = null;
        // 不这样的话，会报错，必须先停止动画，异步销毁
        requestAnimationFrame(() => {
            this.stage?.removeChild(this.container);
            this.container?.removeChild(spine);
            spine.emit('destroyed', spine);
            typeof this.position?.destroy === 'function' && this.position.destroy.call(this, spine);
            if (Array.isArray(this.position?.events)) {
                this.position.events.forEach(item => {
                    if (typeof item?.destroy !== 'function') {
                        return;
                    }
                    item.destroy.call(this, spine);
                })
            }
            spine.destroy();
            this.position = null;
            this.app = null;
        });
    }

    // 启用骨骼拖拽
    onDragZoom(spineId) {
        if (!spineId) return;
        if (!this.spine) return;
        if (!this.dragZoom) {
            DragZoomHelperUtils.start({spineId}, val => {
                this.dragZoom = val;
            });
        }
    }

    // 销毁拖拽缩放骨骼动作
    destroyDragZoom(spineId) {
        if (!this.spine) return;
        if (this.dragZoom) {
            DragZoomHelperUtils.close(spineId);
            this.dragZoom = null;
        }
    }

}

'use strict';
globalThis.qySprite = class Sprite2D extends Base2D {
    #container;
    #texture
    #source_position = {}
    id
    #onLoad = []

    get stage() {
        return this.app?.stage
    }

    get scale(){
        return this.sprite?.scale ?? null;
    }

    get scaleX(){
        return this.scale?.x ?? null;
    }

    set scaleX(v){
        if (this.scaleX === null || !isCorrectNumber(v)) return;
        this.scale.x = this.getMoveMergeValue(v, this.scaleX);
    }

    get scaleY() {
        return this.scale?.y ?? null;
    }

    set scaleY(v) {
        if (this.scaleY === null || !isCorrectNumber(v)) return;
        this.scale.y = this.getMoveMergeValue(v, this.scaleY);
    }

    get container(){
        return this.#container ?? null
    }

    get texture(){
        return this.#texture ?? null
    }

    get x(){
        return this.container?.x ?? null;
    }

    set x(v){
        if (this.x === null || !isCorrectNumber(v)) return;
        this.container.x = this.getMoveMergeValue(v, this.x);
    }

    get y() {
        return this.container?.y ?? null;
    }

    set y(v) {
        if (this.y === null || !isCorrectNumber(v)) return;
        this.container.y = this.getMoveMergeValue(v, this.y);
    }

    get zIndex(){
        return this.container?.zIndex ?? null;
    }

    set zIndex(v){
        if (this.zIndex === null || !isCorrectNumber(v)) return;
        this.container.zIndex = parseFloat(v);
    }

    get rotation(){
        return this.sprite?.rotation ?? null
    }

    set rotation(v){
        if (this.rotation === null || !isCorrectNumber(v)) return;
        this.sprite.rotation = parseFloat(v);
    }

    get angle() {
        const angle = this.sprite?.angle ?? null
        if (angle === null) {
            return angle;
        }
        return angle - 180;
    }

    set angle(v) {
        if (this.angle === null || !isCorrectNumber(v)) return;
        v = this.getMoveMergeValue(v, this.angle);
        this.sprite.angle = v + 180;
    }

    // 不透明度
    get alpha() {
        return this.sprite?.alpha
    }

    set alpha(v) {
        if (this.alpha === undefined || !isCorrectNumber(v)) return;
        this.sprite.alpha = parseFloat(v)
    }

    get anchor(){
        return this.sprite?.anchor ?? null
    }

    set anchorX(v){
        if (!this.anchor) return;
        this.anchor.x = parseFloat(v);
    }

    set anchorY(v){
        if (!this.anchor) return;
        this.anchor.y = parseFloat(v);
    }

    constructor(app = null, position = {}) {
        const container = new PIXI.Container()
        super({container});
        this.id = qyAnimationUtil.generatorUUID();
        this.app = app;
        this.#container = container;
        if (this.stage) {
            this.stage.addChild(this.#container);
        }
        this.sprite = null;
        this.position = {};
        this.isLoading = false;
        Object.assign(this.position, this.#source_position, position);
        globalThis.qyCacheAnimation.add(this);
    }

    async loadSprite2DV7(spriteSrc, position = this.#source_position) {
        if (this.isLoading) {
            return true;
        }
        let suffix = '.png'
        if (this.position?.fileType === 'webp') suffix = '.webp'
        const keysIn = spriteSrc + suffix;
        const url = this.getUrl(position.env ?? this.app?.ENVSettings, {...position, name: keysIn,});
        this.addPixiResource(keysIn, url, {});
        try {
            await PIXI.Assets.load(keysIn);
            // 先创建Texture
            this.#texture = PIXI.Texture.from(keysIn);
            this.sprite = new PIXI.Sprite(this.texture, this.texture.width, this.texture.height);
            if (!this.position) this.position = {};
            this.prepSprite(Object.assign(this.position, this.#source_position, position));
            this.isLoading = true;
            while (this.#onLoad.length) this.#onLoad.pop().call(this);
            return true;
        } catch (e) {
            throw e;
        }
    }

    scaleSprite({scale, scaleX, scaleY}) {
        if (scale) {
            scaleY = scale;
            scaleX = scale;
        }
        if (isCorrectNumber(scaleX)) {
            this.scaleX = scaleX;
        }
        if (isCorrectNumber(scaleY)) {
            this.scaleY = scaleY;
        }
        return this;
    }


    prepSprite(position) {
        let { x = 0, y = 0, rotation = 0, alpha = 1, zIndex = 0} = position;
        // 缩放
        this.scaleSprite(position);
        // 移动
        this.move(x, y);
        // 图层
        this.zIndex = zIndex;
        // 不透明度
        this.alpha = alpha;
        // 旋转角度
        this.angle = rotation;
        // 添加到舞台上
        this.container.addChild(this.sprite);
        // 添加上加载完毕后的事件
        if (typeof position.onLoad === 'function') position.onLoad = [position.onLoad];
        if (Array.isArray(position.onLoad)) {
            this.#onLoad.push(...position.onLoad);
            delete position.onLoad;
        }
        return this;
    }

    destroy() {
        this.container?.destroy({children: true});
        this.#texture = null;
        this.sprite = null;
    }
}

'use strict';
globalThis.qyNineSlicePlane = class NineSlicePlane2D extends Base2D {
    #container;
    #texture
    #source_position = {}
    id
    #onLoad = []

    get stage() {
        return this.app?.stage
    }

    get scale() {
        return this.nineSlicePlane?.scale ?? null;
    }

    get scaleX() {
        return this.scale?.x ?? null;
    }

    set scaleX(v) {
        if (this.scaleX === null || !isCorrectNumber(v)) return;
        this.scale.x = this.getMoveMergeValue(v, this.scaleX);
    }

    get scaleY() {
        return this.scale?.y ?? null;
    }

    set scaleY(v) {
        if (this.scaleY === null || !isCorrectNumber(v)) return;
        this.scale.y = this.getMoveMergeValue(v, this.scaleY);
    }

    get container() {
        return this.#container ?? null
    }

    get texture() {
        return this.#texture ?? null
    }

    get x() {
        return this.container?.x ?? null;
    }

    set x(v) {
        if (this.x === null || !isCorrectNumber(v)) return;
        this.container.x = this.getMoveMergeValue(v, this.x);
    }

    get y() {
        return this.container?.y ?? null;
    }

    set y(v) {
        if (this.y === null || !isCorrectNumber(v)) return;
        this.container.y = this.getMoveMergeValue(v, this.y);
    }

    get zIndex() {
        return this.container?.zIndex ?? null;
    }

    set zIndex(v) {
        if (this.zIndex === null || !isCorrectNumber(v)) return;
        this.container.zIndex = parseFloat(v);
    }

    get rotation() {
        return this.nineSlicePlane?.rotation ?? null
    }

    set rotation(v) {
        if (this.rotation === null || !isCorrectNumber(v)) return;
        this.nineSlicePlane.rotation = parseFloat(v);
    }

    get angle() {
        const angle = this.nineSlicePlane?.angle ?? null
        if (angle === null) {
            return angle;
        }
        return angle - 180;
    }

    set angle(v) {
        if (this.angle === null || !isCorrectNumber(v)) return;
        v = this.getMoveMergeValue(v, this.angle);
        this.nineSlicePlane.angle = v + 180;
    }

    // 不透明度
    get alpha() {
        return this.nineSlicePlane?.alpha
    }

    set alpha(v) {
        if (this.alpha === undefined || !isCorrectNumber(v)) return;
        this.nineSlicePlane.alpha = parseFloat(v)
    }

    get pivot() {
        return this.nineSlicePlane?.pivot ?? null
    }

    set pivotX(v) {
        if (!this.pivot) return;
        this.nineSlicePlane.pivot.x = parseFloat(v);
    }

    set pivotY(v) {
        if (!this.pivot) return;
        this.nineSlicePlane.pivot.y = parseFloat(v);
    }

    constructor(app = null, position = {}) {
        const container = new PIXI.Container()
        super({ container });
        this.id = qyAnimationUtil.generatorUUID();
        this.app = app;
        this.#container = container;
        if (this.stage) {
            this.stage.addChild(this.#container);
        }
        this.nineSlicePlane = null;
        this.position = {};
        this.isLoading = false;
        Object.assign(this.position, this.#source_position, position);
        globalThis.qyCacheAnimation.add(this);
    }

    async loadSprite2DV7(spriteSrc, position = this.#source_position) {
        if (this.isLoading) {
            return true;
        }
        let suffix = '.png'
        if (this.position?.fileType === 'webp') suffix = '.webp'
        const keysIn = spriteSrc + suffix;
        const url = this.getUrl(position.env ?? this.app?.ENVSettings, { ...position, name: keysIn, });
        this.addPixiResource(keysIn, url, {});
        try {
            await PIXI.Assets.load(keysIn);
            // 先创建Texture
            this.#texture = PIXI.Texture.from(keysIn);
            this.nineSlicePlane = new PIXI.NineSlicePlane(this.texture, 0, 0, 80, 0);
            this.nineSlicePlane.width = this.texture.width
            this.nineSlicePlane.height = this.texture.height
            if (!this.position) this.position = {};
            this.prepSprite(Object.assign(this.position, this.#source_position, position));
            this.isLoading = true;
            while (this.#onLoad.length) this.#onLoad.pop().call(this);
            return true;
        } catch (e) {
            throw e;
        }
    }

    scaleSprite({ scale, scaleX, scaleY }) {
        if (scale) {
            scaleY = scale;
            scaleX = scale;
        }
        if (isCorrectNumber(scaleX)) {
            this.scaleX = scaleX;
        }
        if (isCorrectNumber(scaleY)) {
            this.scaleY = scaleY;
        }
        return this;
    }


    prepSprite(position) {
        let { x = 0, y = 0, rotation = 0, alpha = 1, zIndex = 0 } = position;
        // 缩放
        this.scaleSprite(position);
        // 移动
        this.move(x, y);
        // 图层
        this.zIndex = zIndex;
        // 不透明度
        this.alpha = alpha;
        // 旋转角度
        this.angle = rotation;
        // 添加到舞台上
        this.container.addChild(this.nineSlicePlane);
        // 添加上加载完毕后的事件
        if (typeof position.onLoad === 'function') position.onLoad = [position.onLoad];
        if (Array.isArray(position.onLoad)) {
            this.#onLoad.push(...position.onLoad);
            delete position.onLoad;
        }
        return this;
    }

    destroy() {
        this.container?.destroy({ children: true });
        this.#texture = null;
        this.nineSlicePlane = null;
    }
}


// TODO：播放序列帧，待完善
'use strict';
globalThis.qyAnimatedSprite = class AnimatedSprite2D extends Base2D {
    #container;
    #texture
    #source_position = {}
    id
    #onLoad = []

    get stage() {
        return this.app?.stage
    }

    get scale() {
        return this.animatedSprite?.scale ?? null;
    }

    get scaleX() {
        return this.scale?.x ?? null;
    }

    set scaleX(v) {
        if (this.scaleX === null || !isCorrectNumber(v)) return;
        this.scale.x = this.getMoveMergeValue(v, this.scaleX);
    }

    get scaleY() {
        return this.scale?.y ?? null;
    }

    set scaleY(v) {
        if (this.scaleY === null || !isCorrectNumber(v)) return;
        this.scale.y = this.getMoveMergeValue(v, this.scaleY);
    }

    get container() {
        return this.#container ?? null
    }

    get texture() {
        return this.#texture ?? null
    }

    get x() {
        return this.container?.x ?? null;
    }

    set x(v) {
        if (this.x === null || !isCorrectNumber(v)) return;
        this.container.x = this.getMoveMergeValue(v, this.x);
    }

    get y() {
        return this.container?.y ?? null;
    }

    set y(v) {
        if (this.y === null || !isCorrectNumber(v)) return;
        this.container.y = this.getMoveMergeValue(v, this.y);
    }

    get zIndex() {
        return this.container?.zIndex ?? null;
    }

    set zIndex(v) {
        if (this.zIndex === null || !isCorrectNumber(v)) return;
        this.container.zIndex = parseFloat(v);
    }

    get rotation() {
        return this.animatedSprite?.rotation ?? null
    }

    set rotation(v) {
        if (this.rotation === null || !isCorrectNumber(v)) return;
        this.animatedSprite.rotation = parseFloat(v);
    }

    get angle() {
        const angle = this.animatedSprite?.angle ?? null
        if (angle === null) {
            return angle;
        }
        return angle - 180;
    }

    set angle(v) {
        if (this.angle === null || !isCorrectNumber(v)) return;
        v = this.getMoveMergeValue(v, this.angle);
        this.animatedSprite.angle = v + 180;
    }

    // 不透明度
    get alpha() {
        return this.animatedSprite?.alpha
    }

    set alpha(v) {
        if (this.alpha === undefined || !isCorrectNumber(v)) return;
        this.animatedSprite.alpha = parseFloat(v)
    }

    get anchor() {
        return this.animatedSprite?.anchor ?? null
    }

    set anchorX(v) {
        if (!this.anchor) return;
        this.anchor.x = parseFloat(v);
    }

    set anchorY(v) {
        if (!this.anchor) return;
        this.anchor.y = parseFloat(v);
    }

    get speed() {
        return this.animationSpeed
    }

    constructor(app = null, position = {}) {
        const container = new PIXI.Container()
        super({ container });
        this.id = qyAnimationUtil.generatorUUID();
        this.app = app;
        this.#container = container;
        if (this.stage) {
            this.stage.addChild(this.#container);
        }
        this.animatedSprite = null;
        this.position = {};
        this.isLoading = false;
        Object.assign(this.position, this.#source_position, position);
        globalThis.qyCacheAnimation.add(this);
    }

    async loadSprite2DV7(spriteSrc, position = this.#source_position) {
        if (this.isLoading) {
            return true;
        }
        let suffix = '.png'
        if (this.position?.fileType === 'webp') suffix = '.webp'
        const keysIn = spriteSrc + suffix;
        const url = this.getUrl(position.env ?? this.app?.ENVSettings, { ...position, name: keysIn, });
        this.addPixiResource(keysIn, url, {});
        try {
            await PIXI.Assets.load(keysIn);
            // 先创建Texture
            this.#texture = PIXI.Texture.from(keysIn);
            this.animatedSprite = new PIXI.AnimatedSprite(this.texture, this.texture.width, this.texture.height);
            if (!this.position) this.position = {};
            this.prepSprite(Object.assign(this.position, this.#source_position, position));
            this.isLoading = true;
            while (this.#onLoad.length) this.#onLoad.pop().call(this);
            return true;
        } catch (e) {
            throw e;
        }
    }

    scaleSprite({ scale, scaleX, scaleY }) {
        if (scale) {
            scaleY = scale;
            scaleX = scale;
        }
        if (isCorrectNumber(scaleX)) {
            this.scaleX = scaleX;
        }
        if (isCorrectNumber(scaleY)) {
            this.scaleY = scaleY;
        }
        return this;
    }


    prepSprite(position) {
        let { x = 0, y = 0, rotation = 0, alpha = 1, zIndex = 0 } = position;
        // 缩放
        this.scaleSprite(position);
        // 移动
        this.move(x, y);
        // 图层
        this.zIndex = zIndex;
        // 不透明度
        this.alpha = alpha;
        // 旋转角度
        this.angle = rotation;
        // 添加到舞台上
        this.container.addChild(this.sprite);
        // 添加上加载完毕后的事件
        if (typeof position.onLoad === 'function') position.onLoad = [position.onLoad];
        if (Array.isArray(position.onLoad)) {
            this.#onLoad.push(...position.onLoad);
            delete position.onLoad;
        }
        return this;
    }

    destroy() {
        this.container?.destroy({ children: true });
        this.#texture = null;
        this.animatedSprite = null;
    }
}

'use strict';
globalThis.qyAnimationUtil = {
    // 构造随机UUID
    generatorUUID() {
        // return Math.random().toString(16).slice(2)
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); // 使用高精度计时器进一步增加唯一性
        }
        return 'xxxx-yyyy-xxxx-yyyy-xxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },

    // 停止全部动画
    stopSpineAll() {
        if (!qyCacheAnimation.size) return;
        for (const spine of qyCacheAnimation) {
            spine.stopAnimation();
        }
    },

    // 销毁全部动画
    destroySpineAll() {
        if (!qyCacheAnimation.size) return;
        for (const spine of qyCacheAnimation) {
            spine.destroySpine();
        }
    },

    /**
     * 找到指定的spine实例
     * @param spineId
     * @return {Spine2D}
     */
    getSpineById(spineId) {
        if (spineId === void 0) return null;
        return Array.from(qyCacheAnimation).find(spine => spine.id === spineId);
    },

    // 查找是否存在当前实例的spine
    hasSpineById(spineId) {
        return qyAnimationUtil.getSpineById(spineId) !== null;
    },

    // 因为BoundingClientRect的toJSON转换比穷举耗时 *2 倍，所以写这个方法
    rect2JSON({ x, y, left, top, bottom, right, width, height }) {
        return { x, y, left, top, bottom, right, width, height }
    },

    // 将JSONObject类型转为JSONString类型，兼容function
    stringify(position) {
        if (!(typeof position === 'object' && position !== null)) return '{}';
        return JSON.stringify(position, (key, value) => {
            // 不需要转换的类型
            if (['string', 'number', 'undefined', 'boolean'].includes(typeof value)) return value;
            if (value === null) return null;
            // 父节点，返回坐标位置
            // if (key === 'parent' && value instanceof HTMLElement) return qyAnimationUtil.rect2JSON(value.getBoundingClientRect());
            if (value instanceof HTMLElement) return qyAnimationUtil.rect2JSON(value.getBoundingClientRect());
            if (typeof value === 'function') return FUNC_PREFIX + value.toString();
            return value;
        })
    },
    // 将JSONString转为JSONObject
    parse(str) {
        return JSON.parse(str, (key, value) => {
            if (typeof value === 'string' && value.indexOf(FUNC_PREFIX) === 0) {
                value = parseFunction(value.replace(FUNC_PREFIX, ''));
            }
            if (typeof value === 'string' && isCorrectNumber(value)) {
                return parseFloat(value);
            }
            return value;
        })
    },

    animateSkeleton(sprite, props, duration, callable = function () {
    }, callableThisArg) {
        const initialValues = {};
        const ranges = {};
        // 记录初始值并计算出差值范围
        for (const key in props) {
            const propValue = props[key];
            initialValues[key] = sprite[key];
            ranges[key] = propValue - initialValues[key];
        }

        let start = null;

        function update(time) {
            if (!start) start = time;
            const elapsed = time - start;

            // 根据缓动函数计算当前的进度
            const progress = Math.min(elapsed / duration, 1);
            // const easedProgress = easing(progress);

            // 更新属性
            for (const key in props) {
                sprite[key] = initialValues[key] + ranges[key] * progress;
            }

            if (progress < 1) {
                // 如果动画还未完成，则继续请求下一帧更新
                requestAnimationFrame(update);
            } else {
                typeof callable === "function" && callable.apply(callableThisArg);
            }
        }

        requestAnimationFrame(update);
    },
    getCenter(element) {
        if (element instanceof HTMLElement) {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            }
        } else if (typeof element == 'object' && element) {
            const keys = Object.keys(element);
            if (keys.length > 3) {
                return {
                    x: element.left + element.width / 2,
                    y: element.top + element.height / 2
                }
            }
            return element;
        } else {
            return {}
        }
    },
    calculateAngleAndDistance(element1, element2) {
        const center1 = this.getCenter(element1);
        const center2 = this.getCenter(element2);

        // 计算两个中心点之间的距离
        const dx = center2.x - center1.x;
        const dy = center2.y - center1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 计算角度（以弧度为单位）
        const angleRadians = Math.atan2(dy, dx);

        // 如果你需要角度以度为单位
        const angleDegrees = angleRadians * (180 / Math.PI);

        return {
            distance,
            angleRadians,
            angleDegrees
        };
    },
    isCorrectNumber,
}

'use strict';
class DragZoomElement {
    // 缩放移动的元素
    #element = null;
    // spine的唯一消息Id
    #spineId = null

    // 初始化缩放大小
    #initialScale = { x: 1, y: 1 }
    // 计算坐标
    #disX = 0
    #disY = 0
    // 最后一次move的Event
    #lastMoveEvent = null;
    // 骨骼信息
    #spineInfo = {}

    #initialDistance = 0

    get spineId() {
        return this.#spineId;
    }

    get spineInfo() {
        return this.#spineInfo;
    }

    constructor({spineId,parent = ui.window}) {
        if (!spineId) {
            throw new IllegalArgumentException("参数【spineId】不存在，请仔细检查！");
        }
        this.#spineId = spineId;
        this.#element = lib.qyUtils.createElement({
            parent,
            id: 'Jzwd-canvas-animation-drag-zoom',
        });
    }

    // 初始化
    #initiated = false;
    async initiate(){
        if(this.#initiated) {
            return
        }
        await this.getSpineInfo();
        this.#initiated = true;

        this.#bindEvent();
    }

    /**
     * 获取骨骼信息
     * @return {Promise<unknown>}
     */
    async getSpineInfo() {
        return new Promise((resolve, reject) => {
            lib.qyWorkerGetInfoBySpineId({uuid: this.#spineId}, (data, error) => {
                if (error) {
                    return reject(error);
                }
                if (Object.keys(data).length === 0) {
                    return reject(`根据spineId：${this.#spineId}，未找到正在播放的特效！`)
                }
                this.#spineInfo = data;
                resolve(data);
            })
        })
    }

    #debounceGetSpineInfo = lib.qyUtils.debounce(() => this.getSpineInfo().then(console.log), 200);

    #bindEvent(){
        // 按下触屏事件
        lib.qyUtils.on(this.#element, 'mousedown', this.#onDragStart.bind(this), true);
        lib.qyUtils.on(this.#element, 'touchstart', this.#onDragOrZoomStart.bind(this), true)
        // 拖拽移动
        lib.qyUtils.on(this.#element, 'mousemove', this.#onDragMove.bind(this), true)
        lib.qyUtils.on(this.#element, 'touchmove', this.#onDragOrZoomMove.bind(this), true)
        // 拖拽结束
        lib.qyUtils.on(this.#element, 'mouseup', this.#onDragEnd.bind(this), true)
        lib.qyUtils.on(this.#element, 'mouseupoutside', this.#onDragEnd.bind(this), true)
        lib.qyUtils.on(this.#element, 'touchend', this.#onDragEnd.bind(this), true)
        lib.qyUtils.on(this.#element, 'touchendoutside', this.#onDragEnd.bind(this), true);
        // 滚动条
        lib.qyUtils.on(this.#element, 'wheel', this.#onwheel.bind(this), {
            cancelable: true,
            passive: true
        });
    }

    // 拖拽开始
    #onDragOrZoomStart(event) {
        event.stopPropagation();
        this.#initialDistance = null;
        if (event.touches?.length === 1) {
            // start drag
            this.#onDragStart.call(this, event);
            this.dragging = true;
            this.zooming = false;
        } else if (event.touches?.length === 2) {
            // start pinch zoom
            let touch1 = event.touches[0];
            let touch2 = event.touches[1];
            this.#initialDistance = this.#distanceBetween(touch1, touch2);
            this.zooming = true;
            this.dragging = false;
        }
    }

    #onDragStart(event) {
        this.#disX = null;
        this.#disY = null;
        event.stopPropagation();
        // 是否手机端的
        if (event.touches?.length) {
            event = event.touches[0]
        }
        this.dragging = true;
        this.#disX = event.clientX
        this.#disY = event.clientY;
    }

    #onDragMove(event) {
        if (!this.dragging) {
            return;
        }
        event?.stopPropagation?.();
        if (event.touches && event.touches[0]) {
            event = event.touches[0];
        }
        const x = this.#spineInfo.x + (event.clientX - this.#disX);
        const y = this.#spineInfo.y + (event.clientY - this.#disY);

        this.#lastMoveEvent = event;
        lib.qyWorkerUpdateSpine({ skeX: x, skeY: y, uuid: this.#spineId});
    }

    // 双指开始缩放
    #onDragOrZoomMove(event, isSave) {
        this.#lastMoveEvent = event;
        if (this.dragging) {
            this.#onDragMove.call(this, event);
            if (isSave) {
                this.getSpineInfo().then(console.log)
            }
        } else if (this.zooming) {
            if (!isSave) {
                let touch1 = event.touches[0];
                let touch2 = event.touches[1];
                let currentDistance = this.#distanceBetween(touch1, touch2);
                let zoomFactor = currentDistance / this.#initialDistance;

                let zoomFactorX = Math.max(0.5, this.#initialScale.x * zoomFactor);
                let zoomFactorY = Math.max(0.5, this.#initialScale.y * zoomFactor);

                this.#spineInfo.scale.x = zoomFactorX;
                this.#spineInfo.scale.y = zoomFactorY;

                lib.qyWorkerUpdateSpine({ skeScale: zoomFactorX, uuid: this.#spineId});
                this.#debounceGetSpineInfo();
            }
        }
    }

    // 计算两个手指的位置
    #distanceBetween(touch1, touch2) {
        let xDiff = touch1.clientX - touch2.clientX;
        let yDiff = touch1.clientY - touch2.clientY;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    // 拖拽结束
    #onDragEnd(event) {
        if (this.#lastMoveEvent !== null) {
            this.#onDragOrZoomMove.call(this, this.#lastMoveEvent, true);
            this.#lastMoveEvent = null;
        }
        this.dragging = false;
        this.zooming = false;
        this.data = null;
    }

    // 滚动缩放
    #onwheel(event) {
        let zoomFactor = event.deltaY * 0.0005;
        let zoomFactorX = Math.max(0.2, Number.parseFloat(this.#spineInfo.scale.x) + this.#initialScale.x * zoomFactor);
        let zoomFactorY = Math.max(0.2, Number.parseFloat(this.#spineInfo.scale.y) + this.#initialScale.y * zoomFactor);
        this.#spineInfo.scale.x = zoomFactorX;
        this.#spineInfo.scale.y = zoomFactorY;
        lib.qyWorkerUpdateSpine({ skeScale: zoomFactorX, uuid: this.#spineId});
        this.#debounceGetSpineInfo();
    }

    /**
     * 销毁元素
     */
    destroy(){
        this.#element.remove();
        this.#element = null;
        this.#spineInfo = null;
        this.#lastMoveEvent = null;
    }

}

/**
 * 缓存
 * @type {Set<DragZoomElement>}
 */
const CACHE_DRAG_ZOOM_ELEMENT = new Set();
'use strict';
globalThis.DragZoomHelperUtils = {
    start({spineId, parent}, callback = function (val){}) {
        const dragZoomElement = DragZoomHelperUtils.get(spineId);
        if (dragZoomElement != null) {
            console.warn("有重复可复用的元素", spineId, dragZoomElement);
            return callback(dragZoomElement);
        }
        const zoomElement = new DragZoomElement({spineId, parent});
        CACHE_DRAG_ZOOM_ELEMENT.add(zoomElement);
        lib.qyUtils.checkConditionUntilMet(async function () {
            try {
                await zoomElement.initiate();
            } catch (e) {
                return false;
            }
            return true;
        }).then(res => callback?.(zoomElement));
    },
    get(spineId){
        if (spineId == null) {
            return null;
        }
        for (const dragZoomElement of CACHE_DRAG_ZOOM_ELEMENT) {
            if (dragZoomElement.spineId === spineId) {
                return dragZoomElement;
            }
        }
        return null;
    },
    close(spineId) {
        const dragZoomElement = DragZoomHelperUtils.get(spineId);
        if(dragZoomElement == null) {
            return;
        }
        CACHE_DRAG_ZOOM_ELEMENT.delete(dragZoomElement);
        dragZoomElement.destroy();
    },
}

// 设置上监听事件
// lib.qyWebWorkerMessage.on('f2b7b1d5ffbbb', qyWorkerAction.LOAD_SPINE, function (data) {
//     console.log(data);
// });
// 发送消息
// lib.qyWebWorker.postMessage({
//     action: qyWorkerAction.LOAD_SPINE,
//     data: {
//         id: 1,
//         messageId: 'f2b7b1d5ffbbb',
//         data: {
//             name: 'fire',
//         },
//     },
// });
