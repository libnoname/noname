import "../../noname.js";
import { lib } from "../library/index.js";
import { game } from "../game/index.js";
function get(name) {
  const config = lib.config;
  if (!config) {
    return null;
  }
  return Reflect.get(config, name);
}
function set(name, value) {
  const config = lib.config;
  if (!config) {
    return;
  }
  Reflect.set(config, name, value);
}
function has(name) {
  const config = lib.config;
  if (!config) {
    return false;
  }
  return Reflect.has(config, name);
}
function load(name, type, reinitLocalStorage = true, reinitIndexedDB = void 0) {
  if (lib.db) {
    let result = game.getDB(type, name);
    if (typeof reinitIndexedDB != "undefined") {
      result = result.catch(() => game.putDB(type, name, reinitIndexedDB).then(() => reinitIndexedDB));
    }
    return result;
  }
  let config;
  try {
    let json = localStorage.getItem(`${lib.configprefix}${type === "data" ? name : type}`);
    if (!json) {
      throw new Error();
    }
    config = JSON.parse(json);
    if (typeof config != "object" || config == null) {
      throw new Error();
    }
  } catch (err) {
    config = {};
    if (reinitLocalStorage) {
      localStorage.setItem(`${lib.configprefix}${name}`, "{}");
    }
  }
  return Promise.resolve(type === "data" ? config : config[name]);
}
function save(name, type, value) {
  let noValue = typeof value == "undefined";
  if (lib.db) {
    return noValue ? game.deleteDB(type, name) : game.putDB(type, name, value);
  }
  let database = type === "data";
  let key = database ? name : type;
  let config;
  if (database) {
    if (noValue) {
      localStorage.removeItem(`${lib.configprefix}${key}`);
      return Promise.resolve();
    } else {
      config = value;
    }
  } else {
    try {
      let json = localStorage.getItem(`${lib.configprefix}${key}`);
      if (!json) {
        throw new Error();
      }
      config = JSON.parse(json);
      if (typeof config != "object" || config == null) {
        throw new Error();
      }
    } catch (err) {
      config = {};
    }
    if (noValue) {
      delete config[name];
    } else {
      config[name] = value;
    }
  }
  localStorage.setItem(`${lib.configprefix}${key}`, JSON.stringify(config));
  return Promise.resolve();
}
export {
  get,
  has,
  load,
  save,
  set
};
