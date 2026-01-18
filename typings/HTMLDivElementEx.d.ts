//noname内扩展的一些HTMLDivElement方法：
interface HTMLDivElement {
    _link: any;
    timeout?: number;
    destiny?: HTMLDivElement;
    _listeningEnd?: boolean;
    _transitionEnded?: boolean;
    _onEndDelete?: boolean;
    _selfDestroyed?: boolean;
    /**
     * 增加一个动画（增加className动画标记）
     * 
     * @param name className
     * @param time 该动画多长时间自动销毁
     */
    addTempClass(name: string, time?: number): this;
    /**
     * 隐藏
     */
    hide(): this;
    unfocus(): this;
    refocus(): this;
    show(): this;
    /**
     * 删除该节点div
     * @param time 调用后删除的时间（延时删除）
     * @param callback 删除后的回调
     */
    delete(time?: number, callback?: () => void): this;
    /**
     * 将该节点div移除，并添加到目标处
     * 
     * 会为card设置将position到destiny，在get.position中，获得得位置为将要设置得position目标处；
     * @param position 目标处 
     * @param time 延迟执行的时间
     */
    goto(position: HTMLDivElement, time?: number): this;
    /**
     * 立即移除
     */
    fix(): this;
    /**
     * 设置背景（卡面）/设置图片
     * @param name 自定义格式名:   xxx:xxxxxxxx:xx（应该有各种命名格式，到时详细探讨）
     * @param type 设置的卡面的类型
     * @param ext 文件类型后缀名（例:.jpg）,填noskin，或者不填，默认为".jpg"
     * @param subfolder 子文件夹路径（基本都是按规定文件夹放置，命名）,不填走默认路径
     */
    setBackground(name: string, type?: string, ext?: string, subfolder?: string): this;
    /**
     * 设置游戏背景，并且缓存该设置
     * @param img 
     */
    setBackgroundDB(img: string): Promise<this>;
    /**
     * 设置背景
     * @param img 
     */
    setBackgroundImage(img: string | string[]): this;
    /**
     * 设置触摸/点击监听
     * @param func 
     */
    listen(func: (this: HTMLDivElement, event: Event) => void): this;
    /**
     * 设置转换结束（webkitTransitionEnd）监听
     * @param func 
     * @param time 
     */
    listenTransition(func: () => void, time: number): number;
    /**
     * 设置位置
     * @param args 
     */
    setPosition(...args: number[]): this;

}
interface HTMLElement {
    /**
     * 为元素添加右击或长按弹出的提示信息
     * @param {string} title 标题
     * @param {string} content 提示的具体内容
     */
    setNodeIntro(title: string, content: string): this
    /**
     * 添加css样式
     * @param style 
     */
    css<T extends keyof CSSStyleDeclaration>(style: {
        [key in T]?: string;
    } & {
        innerHTML?: string;
    }): this;
}