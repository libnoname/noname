import { lib } from "../index.js";
import * as symbol from "./symbol.js";
class Experimental {
  symbol = symbol;
  symbols = symbol;
  /**
   * @type {boolean}
   */
  get enable() {
    return Reflect.get(lib.config, "experimental_enable");
  }
}
let experimental = new Experimental();
export {
  Experimental,
  experimental
};
