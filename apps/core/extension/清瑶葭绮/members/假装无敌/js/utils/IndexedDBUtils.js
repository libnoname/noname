class IndexedDBUtils {
    constructor(dbName, version, storeName, upgradeCallback) {
        this.db = null;
        this.dbName = dbName;
        this.version = version;
        this.storeName = storeName;
        this.upgradeCallback = upgradeCallback;
        this.data = [];
    }

    async init() {
        const request = window.indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            console.log('数据库升级成功');

            if (this.db.objectStoreNames.contains(this.storeName)) {
                this.db.deleteObjectStore(this.storeName);
            }

            const store = this.db.createObjectStore(this.storeName, {keyPath: 'id', autoIncrement: true});

            if (typeof this.upgradeCallback === 'function') {
                this.upgradeCallback(store);
            }
        };

        return new Promise((resolve, reject) => {
            request.onerror = function (event) {
                console.log('数据库打开失败');
                reject(event.target.error);
            };

            request.onsuccess = async (event) => {
                this.db = event.target.result;
                console.log('数据库打开成功');
                // 获取所有数据
                this.data = await this.getAllData();
                resolve(this.db);
            };
        });
    }

    getStore(mode = 'readonly') {
        const transaction = this.db.transaction(this.storeName, mode);
        return transaction.objectStore(this.storeName);
    }

    async add(data) {
        this.data.push(data);

        const store = this.getStore('readwrite');
        const request = store.add(data);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                console.log('数据添加成功');
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.log('数据添加失败');
                reject(event.target.error);
            };
        });
    }

    async update(data) {
        const index = this.data.findIndex((item) => item.id === data.id);

        if (index !== -1) {
            this.data[index] = data;
        }

        const store = this.getStore('readwrite');
        const request = store.put(data);

        request.onsuccess = (event) => {
            console.log('数据更新成功');
        };

        request.onerror = (event) => {
            console.log('数据更新失败');
        };
    }

    async delete(id) {
        const index = this.data.findIndex((item) => item.id === id);

        if (index !== -1) {
            this.data.splice(index, 1);
        }

        const store = this.getStore('readwrite');
        const request = store.delete(id);

        request.onsuccess = (event) => {
            console.log('数据删除成功');
        };

        request.onerror = (event) => {
            console.log('数据删除失败');
        };
    }

    async clear() {
        this.data = [];

        const store = this.getStore('readwrite');
        const request = store.clear();

        request.onsuccess = (event) => {
            console.log('数据清空成功');
        };

        request.onerror = (event) => {
            console.log('数据清空失败');
        };
    }

    async close() {
        this.db.close();
    }

    getById(id) {
        const store = this.getStore();
        const request = store.get(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                console.log('数据获取成功');
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.log('数据获取失败');
                reject(event.target.error);
            };
        });
    }

    getByIndex(indexName, value) {
        const store = this.getStore();
        const index = store.index(indexName);
        const request = index.get(value);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                console.log('数据获取成功');
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.log('数据获取失败');
                reject(event.target.error);
            };
        });
    }

    getAllByIndex(indexName, value) {
        const store = this.getStore();
        const index = store.index(indexName);
        const request = index.getAll(value);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                console.log('数据获取成功');
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.log('数据获取失败');
                reject(event.target.error);
            };
        });
    }

    getAllData() {
        const store = this.getStore();
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                console.log('数据获取成功');
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.log('数据获取失败');
                reject(event.target.error);
            };

        });
    }
}

class IndexedDBCache {
    static prefix = 'qingyao-animation-custom-';

    /**
     *
     * @param dbName
     * @param version
     * @param storeName
     * @param upgradeCallback
     */
    constructor(dbName, version, storeName = 'qingyao-animation-custom', upgradeCallback) {
        dbName = IndexedDBCache.prefix + dbName;
        this.db = new IndexedDBUtils(dbName, version, storeName, upgradeCallback);
        this.data = [];
    }

    async init() {
        await this.db.init();
        this.data.push(...this.db.data);
    }

    async add(data) {
        this.data.push(data);
        data.id = await this.db.add(data);
    }

    async update(data) {
        const index = this.data.findIndex((item) => item.id === data.id);

        if (index !== -1) {
            this.data[index] = data;
        }

        await this.db.update(data);
    }

    async delete(id) {
        const index = this.data.findIndex((item) => item.id === id);

        if (index !== -1) {
            this.data.splice(index, 1);
        }

        await this.db.delete(id);
    }

    async clear() {
        this.data = [];
        await this.db.clear();
    }

    async close() {
        await this.db.close();
    }

    async getAllData() {
        const allData = await this.db.getAllData();
        this.data = allData;
        return allData;
    }

    async getById(id) {
        const cachedData = this.data.find((item) => item.id === id);

        if (cachedData) {
            return cachedData;
        }

        const data = await this.db.getById(id);

        if (data) {
            this.data.push(data);
        }

        return data;
    }

    getByName(name) {
        return this.data.find(({ name: dbName }) => name === dbName);
    }


    async getByIndex(indexName, value) {
        const data = await this.db.getByIndex(indexName, value);

        if (data) {
            this.data.push(data);
        }

        return data;
    }

    async getAllByIndex(indexName, value) {
        const data = await this.db.getAllByIndex(indexName, value);

        if (data) {
            this.data.push(...data);
        }

        return data;
    }
}


/*
// 使用示例
const db = new IndexedDBCache('test', 1, 'data');

db.init().then(() => {
  // 数据库初始化完成后，可以进行数据操作
  db.add({ id: 1, name: '张三' });
  db.update({ id: 1, name: '李四' });
  db.delete(1);
  db.clear();
  db.getById(1);
  db.getByIndex('name', '李四');
  db.getAllByIndex('name', '李四');
});

*/

/* LocalStorage 工具类 */
globalThis.qyLocalStorageUtil = class localStorageUtil {
    // 前缀
    static #prefix = 'qingyao - '

    // get
    static get(key, defValue) {
        return localStorage.getItem(`${this.#prefix}${key}`) ?? defValue
    }

    // set
    static set(key, value) {
        localStorage.setItem(`${this.#prefix}${key}`, value)
    }

    static getJson(key, defValue) {
        const val = this.get(key);
        if (!val) return defValue;
        return JSON.parse(val)
    }

    static setJson(key, value) {
        this.set(key, JSON.stringify(value))
    }

    static getJsonArray(key) {
        const val = this.get(key);
        if (!val) return [];
        return JSON.parse(val)
    }

    static setJsonArray(key, value) {
        this.set(key, JSON.stringify(value))
    }
}
