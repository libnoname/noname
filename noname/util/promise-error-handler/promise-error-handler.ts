/**
 * 不同浏览器下异步报错问题处理方式的接口，用于定义不同浏览器对待异步报错的处理方式
 */
export interface PromiseErrorHandler {
	/**
	 * 当异步处理对象初始化时执行的操作
	 *
	 * 因为未来或许会涉及到错误处理方式的更改，故所有初始化操作请于此处执行
	 *
	 * 若该函数为异步函数，则将阻塞运行
	 */
	onLoad?(): void | Promise<void>;

	/**
	 * 当异步处理对象被释放时执行的操作
	 *
	 * 目前版本无任何用处，请等待未来的更新
	 *
	 * 未来或许会涉及到错误处理方式的更改，此后请使用无名杀提供的方式来进行异步错误处理的更改
	 *
	 * 若该函数为异步函数，则将阻塞运行
	 */
	onUnload?(): void | Promise<void>;

	/**
	 * 当全局监听器捕获到`unhandledrejection`事件时会调用的函数
	 *
	 * 该函数用于正式处理异步报错事件
	 *
	 * 该函数为异步函数时不会阻塞运行
	 *
	 * @param event - 被捕获到的异步报错事件
	 */
	onHandle?(event: PromiseRejectionEvent): void | Promise<void>;

	/**
	 * 当触发`window.onerror`时会调用的函数
	 *
	 * 用于在执行`window.onerror`前执行一些可能存在的善后操作
	 *
	 * 该函数无法为异步函数
	 */
	onErrorPrepare?(): void;

	/**
	 * 当`window.onerror`运行**即将结束**时会调用的函数
	 *
	 * 用于在执行`window.onerror`后执行一些可能存在的善后操作
	 *
	 * 该函数无法为异步函数
	 */
	onErrorFinish?(): void;
}
