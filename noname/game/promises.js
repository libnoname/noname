import { lib, _status, game } from "../../noname.js";

export class GamePromises {
	/**
	 * 模仿h5的prompt，用于显示可提示用户进行输入的对话框
	 *
	 * 注: 由于参数列表是随意的，在这里我准备限制一下这个函数的参数顺序
	 *
	 * @param { string } [title] 设置prompt标题与input内容
	 * @param { boolean } [forced] 为true的话将没有"取消按钮"
	 * @param { string } alertOption 设置prompt是否模拟alert
	 * @example
	 * ```js
	 * // 只设置标题(但是input的初始值就变成了undefined)
	 * game.promises.prompt('###prompt标题').then(value => console.log(value));
	 * // 设置标题和input初始内容
	 * game.promises.prompt('###prompt标题###input初始内容').then(value => console.log(value));
	 * ```
	 * @returns { Promise<string> }
	 */
	/**
	 * @overload
	 * @param { string } title
	 * @returns { Promise<string | false> }
	 */
	/**
	 * @overload
	 * @param { string } title
	 * @param { boolean } [forced]
	 * @returns { Promise<string> }
	 *
	 */
	// @ts-ignore
	prompt(alertOption, title, forced) {
		return new Promise((resolve, reject) => {
			if (alertOption !== "alert") {
				// @ts-ignore
				forced = title || false;
				title = alertOption;
				game.prompt(title, forced, resolve);
			} else {
				game.prompt(title, alertOption, resolve);
			}
		});
	}
	/**
	 * 模仿h5的alert，用于显示信息的对话框
	 *
	 * @param { string } title
	 * @example
	 * ```js
	 * await game.promises.alert('弹窗内容');
	 * ```
	 * @returns { Promise<true> }
	 */
	alert(title) {
		return new Promise((resolve, reject) => {
			game.prompt(title, "alert", resolve);
		});
	}
	// 读写函数promises化(不用考虑其对应函数是否存在)
	download(url, folder, dev, onprogress) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			game.download(url, folder, resolve, reject, dev, onprogress);
		});
	}
	/**
	 * @param {string} filename
	 * @returns {Promise<ArrayBuffer | Buffer>}
	 */
	readFile(filename) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			game.readFile(filename, resolve, reject);
		});
	}
	readFileAsText(filename) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			game.readFileAsText(filename, resolve, reject);
		});
	}
	writeFile(data, path, name) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			game.writeFile(data, path, name, resolve);
		}).then(result => {
			return new Promise((resolve, reject) => {
				if (result instanceof Error) {
					reject(result);
				} else {
					resolve(result);
				}
			});
		});
	}
	ensureDirectory(list, callback, file) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			game.ensureDirectory(list, resolve, file);
		});
	}
	createDir(directory) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			game.createDir(directory, resolve, reject);
		});
	}
	removeFile(filename) {
		return /** @type {Promise<void>} */ (
			new Promise((resolve, reject) => {
				// @ts-ignore
				game.removeFile(filename, err => {
					if (err) reject(err);
					else resolve();
				});
			})
		);
	}
	removeDir(directory) {
		return /** @type {Promise<void>} */ (
			new Promise((resolve, reject) => {
				// @ts-ignore
				game.removeDir(directory, resolve, reject);
			})
		);
	}

	/**
	 * 获取文件列表
	 *
	 * @param { string } dir 目录
	 * @returns { Promise<[string[], string[]]> } 返回一个数组，第一个元素是文件夹列表，第二个元素是文件列表
	 */
	getFileList(dir) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			game.getFileList(dir, (folders, files) => resolve([folders, files]), reject);
		});
	}

	/**
	 * @param { string } key
	 * @param { * } [value]
	 * @param { string | boolean } [local]
	 */
	saveConfig(key, value, local) {
		// @ts-ignore
		if (_status.reloading) return Promise.resolve();

		// @ts-ignore
		return new Promise(resolve => game.saveConfig(key, value, local, resolve));
	}
	/**
	 * @param { string } key
	 */
	saveConfigValue(key) {
		return game.promises.saveConfig(key, lib.config[key]);
	}
	/**
	 * @param { string } extension
	 * @param { string } key
	 * @param { * } [value]
	 */
	saveExtensionConfig(extension, key, value) {
		return game.promises.saveConfig(`extension_${extension}_${key}`, value);
	}
	/**
	 * @param { string } extension
	 * @param { string } key
	 */
	saveExtensionConfigValue(extension, key) {
		return game.promises.saveExtensionConfig(extension, key, game.getExtensionConfig(extension, key));
	}

	/**
	 * 检查指定的路径是否是一个文件
	 *
	 * @param {string} fileName - 需要查询的路径
	 * @return {Promise<(-1 | 0 | 1)>} - 返回值意义如下:
	 *  - `-1`: 路径不存在或无法访问
	 *  - `0`: 路径的内容不是文件
	 *  - `1`: 路径的内容是文件
	 */
	checkFile(fileName) {
		return new Promise((resolve, reject) => {
			game.checkFile(fileName, resolve, reject);
		});
	}

	/**
	 * 检查指定的路径是否是一个目录
	 *
	 * @param {string} dir - 需要查询的路径
	 * @return {Promise<(-1 | 0 | 1)>} - 返回值意义如下:
	 *  - `-1`: 路径不存在或无法访问
	 *  - `0`: 路径的内容不是目录
	 *  - `1`: 路径的内容是目录
	 */
	checkDir(dir) {
		return new Promise((resolve, reject) => {
			game.checkDir(dir, resolve, reject);
		});
	}
}
