/**
 * iOS 上放宽 `<input type="file">` 的可选文件范围。
 *
 * ---
 *
 * ## 问题
 *
 * iOS 的「文件」选择器会**按 `accept` 严格过滤**：只要文件的真实类型
 * （UTI，通常由扩展名推断）不匹配 `accept`，那一项就会被渲染成**灰色且点不动**。
 * 更糟的是 iOS **没有**桌面浏览器那种「显示全部文件」的下拉逃生入口，
 * 一旦全都不匹配，就等于完全无法导入。
 *
 * 无名杀里不少地方写死了较窄的 `accept`：
 *
 * | 位置 | accept |
 * | --- | --- |
 * | `library/index.js` 导入自定义背景音乐 | `audio/*` |
 * | `optionsMenu.js` / `exetensionMenu.js` 导入扩展 | `application/zip` |
 * | 多处「添加图片」 | `image/*` |
 *
 * 而玩家从 Safari 或「文件」App 存进来的资源，命名经常是
 * 「扩展名缺失 / 大小写不一致 / 少见的容器格式」，于是被判定为不匹配。
 *
 * ## 做法
 *
 * iOS 上**直接去掉所有文件选择框的 `accept`**：选择器改为展示全部文件，
 * 由游戏在拿到文件之后再自行判断。这样文件叫什么名字都能选。
 *
 * 用两道保险覆盖全部创建方式（core 里有三种写法，见下）：
 *
 * 1. **MutationObserver 盯 `accept` 属性的写入**——能覆盖
 *    `ui.create.filediv()` 这种「先插入 DOM、之后才 `inputNode.accept = "..."`」的写法；
 * 2. **捕获阶段 `click` 监听**——兜底，在点击即将打开选择器前再清一次，
 *    防止有代码在更晚的时机设置 accept。
 *
 * core 里三种创建方式的覆盖情况：
 *
 * | 写法 | 例子 | 由谁覆盖 |
 * | --- | --- | --- |
 * | `ui.create.filediv()` 后设 `inputNode.accept` | 各「添加图片」 | observer（属性变更） |
 * | 先 `input.type = "file"` 再插 DOM、后设 `accept` | `exetensionMenu.js` | observer（属性变更） |
 * | 直接以 HTML 字符串创建 | `import_music`、导入扩展、导入录像 | observer（节点新增） |
 *
 * 只在 iOS 生效：安卓与桌面浏览器上 `accept` 的过滤是有用的，不该动。
 */

/** 判断节点是否是文件选择框 */
function isFileInput(node: unknown): node is HTMLInputElement {
	return node instanceof HTMLInputElement && node.type === "file";
}

/** 去掉 accept；重复调用安全 */
function stripAccept(input: HTMLInputElement): void {
	if (input.hasAttribute("accept")) {
		input.removeAttribute("accept");
	}
}

/**
 * 启动对文件选择框的放宽处理。
 *
 * 在 `preload()` 里调用一次即可。越早调用越好——已存在的输入框会被立即处理，
 * 之后新增的由 observer 兜住。
 */
export function relaxFileInputFilters(): void {
	// 1) 属性观察：accept 一旦被写入就清掉。
	//    removeAttribute 本身会再触发一次记录，但此时 hasAttribute 已为假，
	//    会直接返回，不会形成死循环。
	const observer = new MutationObserver(records => {
		for (const record of records) {
			if (record.type === "attributes") {
				if (isFileInput(record.target)) {
					stripAccept(record.target);
				}
				continue;
			}

			record.addedNodes.forEach(node => {
				if (isFileInput(node)) {
					stripAccept(node);
				} else if (node instanceof HTMLElement) {
					// 新增的子树里可能藏着文件选择框（例如整段 innerHTML）
					node.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach(stripAccept);
				}
			});
		}
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["accept"],
	});

	// 2) 兜底：点下去之前再清一次
	document.addEventListener(
		"click",
		event => {
			if (isFileInput(event.target)) {
				stripAccept(event.target);
			}
		},
		true
	);

	// 3) 处理调用时已经存在的输入框
	document.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach(stripAccept);
}
