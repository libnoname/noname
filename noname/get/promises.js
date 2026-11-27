import { get } from "./index.js";
class Promises {
  zip() {
    return new Promise((resolve) => get.zip(resolve));
  }
}
export {
  Promises
};
