interface NonameAndroidBridge {
	/**
	 * 安卓的Toast.showToast的功能
	 * @param message 显示的字符串信息
	 */
	showToast(message: string): void;
	
	/**
	 * 根据地址来分享一个文件
	 * @param documentPath 文件相对于游戏根目录的地址
	 * @returns 是否成功触发分享操作
	 */
	shareFile(documentPath: string): boolean;

	/**
	 * 异步压缩并分享一个扩展压缩包
	 * @param extName 扩展名称
	 */
	shareExtensionAsync(extName: string): void;

	/**
	 * 异步压缩并分享一个带密码的扩展压缩包
	 * @param extName 扩展名称
	 * @param passWord 密码
	 */
	shareExtensionWithPassWordAsync(extName: string, passWord: string): void;

	/**
	 * 游戏做好准备从file协议升级到https协议所调用的方法
	 */
	sendUpdate(): void;

	/**
	 * 获取当前app的包名
	 */
	getPackageName(): string;

	/**
	 * 同步截图,会把截图保存到DCIM/应用包名文件夹内
	 * @param fileName 文件名(不加后缀)
	 */
	captureScreen(fileName: string): boolean;

	/**
	 * 切换App内使用的Webview实现
	 */
	changeWebviewProvider(): void;

	/**
	 * 获取当前app的versionCode
	 */
	getPackageVersionCode(): number;
}