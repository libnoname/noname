/**
 * **启动页** 接口
 *
 * 该接口用于定义自定义启动页的行为
 *
 * 扩展作者可以实现这个接口来添加自己的启动页
 *
 * 一切启动页信息均需要添加到`lib.onloadSplashes`当中，
 * 请勿直接更改任何相关设置，以免出现兼容问题
 */
export interface OnloadSplash {
	/**
	 * 启动页的唯一标识符，先出现的将覆盖后出现的
	 */
	readonly id: string;

	/**
	 * 启动页的显示名称
	 */
	readonly name: string;

	/**
	 * 初始化启动页，启动页的HTML div元素由无名杀自发创建
	 *
	 * @param node - 用于渲染启动页的 HTML div 元素
	 * @param resolve - 回调函数，用于通知启动页加载完成。参数为要启动模式
	 * @returns 可为同步，亦可为异步
	 */
	init(node: HTMLDivElement, resolve: (mode: string) => void): void | Promise<void>;

	/**
	 * 选择模式后，进行必要的清理工作
	 *
	 * 如果此处自行处理了启动页元素的清理，请返回`true`，此时无名杀将不会管理启动页的生死
	 *
	 * @param node - 渲染启动页的 HTML div 元素
	 * @returns 可为同步，亦可为异步
	 */
	dispose(node: HTMLDivElement): void | Promise<void> | boolean | Promise<boolean>;

	/**
	 * 预览启动页
	 *
	 * @param node - 用于预览启动页的 HTML div 元素
	 * @returns 可为同步，亦可为异步
	 */
	preview(node: HTMLDivElement): void | Promise<void>;
}
