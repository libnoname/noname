window.qyPreContent = async function (lib, game, ui, get, ai, _status, config) {
    // 获取文件
    lib.getDBList = function (dlcDirectory) {
        return new Promise((resolve, reject) => {
            game.getFileList(dlcDirectory, (folders, files) => {
                files = files.filter(name => name.endsWith('.js')).map(name => name.replace(/\.js$/, ''));
                resolve(files);
            })
        })
    }

    /**
     * 读取文件操作，如果没有该文件则直接创建出来这个文件
     * @param filename
     * @return {Promise<String>}
     */
    function readAndCreateFileText(filename) {
        return new Promise(async (resolve, reject) => {
            // 创建文件夹
            const directory = filename.substring(0, filename.lastIndexOf('/'));
            await createDirectory(directory);
            // 创建文件
            if (window.resolveLocalFileSystemURL) {
                window.resolveLocalFileSystemURL(lib.assetURL, function (entry) {
                    entry.getFile(filename, {create: true}, function (fileEntry) {
                        fileEntry.file(function (fileToLoad) {
                            const fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                resolve(e.target.result);
                            };
                            fileReader.readAsText(fileToLoad, "UTF-8");
                        }, reject);
                    }, reject);
                }, reject);
            } else if (lib.node?.fs) {
                const filepath = `${__dirname}/${filename}`;
                if (!lib.node.fs.existsSync(filepath)) {
                    lib.node.fs.writeFileSync(filepath, '');
                }

                lib.node.fs.readFile(__dirname + '/' + filename, 'utf-8', function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } else {
                reject("当前环境不支持读取文件！！");
            }
        });
    }

    /**
     * 创建文件夹
     * @param directory 文件夹路径
     * @return {Promise<unknown>}
     */
    function createDirectory(directory) {
        return new Promise((resolve, reject) => {
            if (lib.node?.fs) {
                if (lib.node.fs.existsSync(__dirname + '/' + directory)) resolve(true);
                lib.node.fs.mkdir(`${__dirname}/${directory}`, err => err ? reject(`创建文件夹失败：\n路径${directory}\n错误信息：${err.toString()}`) : resolve(true))
            } else if (window['resolveLocalFileSystemURL']) {
                const error = err => {
                    console.error(directory, err)
                    reject(`创建文件夹失败：\n路径${directory}\n错误信息：${err.toString()}`);
                }

                const dirs = directory.split('/');
                window.resolveLocalFileSystemURL(lib.assetURL, function (entry) {
                    // 递归创建目录
                    (function redo(entry) {
                        const dir = dirs.shift();
                        entry.getDirectory(dir, {create: true}, function (dirEntry) {
                            if (dirs.length) redo(dirEntry);
                            else resolve(true);
                        }, error);
                    })(entry);
                }, error)
            } else {
                reject("创建文件夹失败！")
            }
        });
    }

    // 参数错误异常类
    globalThis.IllegalArgumentError = class IllegalArgumentError extends Error {
        constructor(message) {
            super(message);
            this.name = 'IllegalArgumentError';
        }
    }

    // 校验参数方法
    function check(expression, errorMessage) {
        if (!expression) {
            throw new IllegalArgumentError(errorMessage);
        }
    }

    // 本地文件数据库
    globalThis.LocalFileDB = class LocalFileDB {
        // 所有的数据
        data = [];
        // 文件名称，一个文件一个数据库，所以也叫dbName
        dbName
        // 文件名称，补上后缀
        filename;
        //
        menu = {}

        constructor(dlcDirectory, dbName, menu) {
            check(dbName && typeof dbName === 'string', `dbName不能为空，并且必须是字符串类型！！!${dbName}`);
            this.dlcDirectory = dlcDirectory;
            this.dbName = dbName;
            this.filename = dbName + '.js';
            this.menu = menu;
            this.init();
        }

        // 初始化读文件
        async init() {
            const readText = await readAndCreateFileText(`${this.dlcDirectory}/${this.filename}`);
            if (readText) {
                const exec = eval(readText);
                check(Array.isArray(exec) || lib.qyUtils.isObject(exec), `读取的结果不是一个数组，请仔细检查！`);
                if (Array.isArray(exec)) {
                    this.data = exec;
                } else {
                    this.data = exec.data;
                    this.menu = {
                        name: exec.name,
                        enable: exec.enable,
                        label: exec.label,
                    }
                }
            } else {
                this.data = [];
            }
        }

        /**
         * 增加一个文件
         * @param data
         * @return {Promise<void>}
         */
        async add(...data) {
            this.data.push(...data);
            await this.sync();
        }

        /**
         * 同步本地文件
         * @return {Promise<void>}
         */
        sync() {
            return new Promise((resolve, reject) => {
                const crData = {};
                crData.name = this.menu.name;
                crData.label = this.menu.label;
                crData.enable = this.menu.enable
                crData.data = this.data;
                const text = JSON.stringify(crData, function (key, value) {
                    if (typeof value === 'function') {
                        return "《startFunction《" + get.stringify(value) + "》endFunction》";
                    }
                    if (value === undefined || value === null) return undefined;
                    return value;
                })
                    .replace(/"《startFunction《|》endFunction》"/g, '');
                const data = `(function (){\n\treturn ${text}})()`
                    .replace(/\\t/g, '\t')
                    .replace(/\\n/g, '\n')
                    .replace(/\\r/g, '');
                const writeTexxt = window.js_beautify(data, {
                    indent_size: 2,
                    indent_char: '\t',
                    space_before_function_paren: true,
                });
                game.writeFile(writeTexxt, this.dlcDirectory, this.filename, resolve);
            })
        }

        async update() {
            return await this.sync();
        }

        delete(...data) {
            return new Promise(async (resolve, reject) => {
                this.data = this.data.filter(item => !data.includes(item));
                await this.sync();
                resolve(true);
            })
        }

        /**
         * 删除文件
         * @return {Promise<void>}
         */
        unlinkFileDB() {
            return new Promise((resolve) => {
                this.data = [];
                game.removeFile(this.dlcDirectory + '/' + this.filename, resolve)
            });
        }

        destroy() {
            this.data.length = 0;
        }
    }


    // 创建文件夹
    await createDirectory('extension/清瑶葭绮/members/假装无敌/js/db');
    await createDirectory('extension/清瑶葭绮/members/假装无敌/js/db/line');
}