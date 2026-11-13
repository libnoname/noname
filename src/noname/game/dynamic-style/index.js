export class DynamicStyle {
	/**
	 * Object of style
	 * 表示样式的对象
	 *
	 * @typedef {Record<string, string | number>} StyleObject
	 */
	/**
	 * Rule to record style info.
	 * 用于记录样式信息的规则
	 *
	 * @typedef {[string, StyleObject]} Rule
	 */
	/**
	 * Type used to declare the place to store css info.
	 * 用来存CSS信息的空间的类型
	 *
	 * @typedef {object} DynamicStyleCache
	 * @property {Rule[]} rules 记录的规则
	 * @property {HTMLStyleElement} style 全局Style标签
	 * @property {CSSStyleSheet} sheet Style标签的Sheet
	 */

	/**
	 * Place to store css info.
	 * 存CSS信息的空间
	 *
	 * @type {DynamicStyleCache}
	 */
	#cache;

	/**
	 * Initialize dynamicStyle.
	 * 初始化数据
	 */
	constructor() {
		/**
		 * @type {DynamicStyleCache}
		 */
		const cache = Object.create(null);
		cache.rules = [];
		cache.style = document.createElement("style");
		cache.style.id = "game.dynamicStyle";
		document.head.appendChild(cache.style);
		cache.sheet = cache.style.sheet;

		this.#cache = cache;
	}

	/**
	 * Turn the Object Style to string format.
	 * 将给定的对象样式转换成字符串的形式
	 *
	 * @param {StyleObject} style 给定的对象样式
	 * @returns {string} 样式的字符串形式
	 */
	translate(style) {
		return Object.entries(style)
			.map(item => `${item[0].replace(/([A-Z])/g, match => `-${match.toLowerCase()}`)}: ${item[1]};`)
			.join(" ");
	}

	/**
	 * Generate the common css selector.
	 * 生成标准的CSS样式
	 *
	 * @param {string} name 选择器
	 * @param {StyleObject} style 对象样式
	 * @returns {string} 标准的CSS样式
	 */
	generate(name, style) {
		return `${name} { ${this.translate(style)} }`;
	}

	/**
	 * Determine the selector is in rules.
	 * 检查是否存在对应选择器的规则
	 *
	 * @param {string} name 选择器
	 * @returns {boolean}
	 */
	has(name) {
		return this.#cache.rules.some(item => item[0] === name);
	}

	/**
	 * Get the style of given selector, or return null.
	 * 获得对应选择器的样式对象，若不存在，则返回`null`
	 *
	 * @param {string} name 选择器
	 * @returns {?StyleObject}
	 */
	get(name) {
		const result = this.find(item => item[0] === name);
		return result ? result[1] : null;
	}

	/**
	 * Callback of `DynamicStyle#find`, getting the rule wanted.
	 * `DynamicStyle#find`的回调函数，用于获取符合要求的规则
	 *
	 * @callback FindCallback
	 * @param {Rule} rule 样式规则
	 * @param {number} index 样式编号
	 * @param {Rule[]} rules 规则集
	 * @returns {boolean}
	 */

	/**
	 * Get the rule wanted by given function.
	 * 通过给定的函数，获取符合要求的规则
	 *
	 * @param {FindCallback} fn 用于检查的函数
	 * @returns {Rule}
	 */
	find(fn) {
		return this.#cache.rules.find(fn);
	}

	/**
	 * Length of rules.
	 * 规则集的长度
	 *
	 * @returns {number}
	 */
	size() {
		return this.#cache.rules.length;
	}

	/**
	 * Get the index of given selector, or return `-1`.
	 * 获得对应选择器的位置，若不存在，则返回`-1`
	 *
	 * @param {string} name 选择器
	 * @returns {number}
	 */
	indexOf(name) {
		for (let i = 0; i < this.#cache.rules.length; ++i) {
			if (name === this.#cache.rules[i][0]) {
				return i;
			}
		}
		return -1;
	}

	// 后面部分就不说明了，可以顾名思义
	/**
	 * @param {string} name 选择器
	 * @param {StyleObject} style 要添加的样式对象
	 * @returns {boolean} 添加的结果，为`true`则添加成功，为`false`则添加失败
	 */
	add(name, style) {
		return this.update(name, this.has(name) ? Object.assign({}, this.get(name), style) : style);
	}

	/**
	 * @param {Record<string, StyleObject>} object 以`name: style`存储的映射
	 * @returns {boolean[]} 添加的结果，为`true`则添加成功，为`false`则添加失败
	 */
	addObject(object) {
		return Object.entries(object).map(item => this.add(item[0], item[1]));
	}

	/**
	 * @param {string} name 要移除规则的选择器
	 * @returns {boolean} 移除的结果，为`true`则移除成功，为`false`则移除失败
	 */
	remove(name) {
		if (!this.has(name)) {
			return false;
		}
		try {
			const index = this.indexOf(name);
			this.#cache.rules.splice(index, 1);
			this.#cache.sheet.deleteRule(index);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	/**
	 * @param {string} name 要移除规则的选择器
	 * @param {string[]} styles 要移除的样式
	 * @returns {boolean} 移除的结果，为`true`则移除成功，为`false`则移除失败
	 */
	removeStyles(name, styles) {
		if (!this.has(name)) {
			return false;
		}
		const style = this.get(name);
		styles.forEach(styleName => {
			delete style[styleName];
		});
		return this.update(name, style);
	}

	/**
	 * 添加或修改一个规则所对应的样式
	 *
	 * @param {string} name 要变更规则的选择器
	 * @param {StyleObject} style 变更规则的样式
	 * @returns {boolean} 更新的结果，为`true`则更新成功，为`false`则更新失败
	 */
	update(name, style) {
		try {
			if (this.has(name)) {
				const index = this.indexOf(name);
				this.#cache.sheet.deleteRule(index);
				this.#cache.sheet.insertRule(this.generate(name, style), index);
				this.#cache.rules[index] = [name, style];
			} else {
				const index = this.#cache.rules.length;
				this.#cache.rules.push([name, style]);
				this.#cache.sheet.insertRule(this.generate(name, style), index);
			}
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
}
