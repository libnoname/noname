import { get } from "./index.js";
class Promises {
  /**
   * @returns { Promise<JSZip> }
   */
  zip() {
    return new Promise((resolve) => get.zip(resolve));
  }
}
export {
  Promises
};
