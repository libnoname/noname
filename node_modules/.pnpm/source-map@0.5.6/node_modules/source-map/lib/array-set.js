import "../../../../../../_virtual/_commonjsHelpers.js";
import { __exports as arraySet } from "../../../../../../_virtual/array-set.js";
import { __require as requireUtil } from "./util.js";
var hasRequiredArraySet;
function requireArraySet() {
  if (hasRequiredArraySet) return arraySet;
  hasRequiredArraySet = 1;
  var util = requireUtil();
  var has = Object.prototype.hasOwnProperty;
  function ArraySet() {
    this._array = [];
    this._set = /* @__PURE__ */ Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = util.toSetString(aStr);
    var isDuplicate = has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[sStr] = idx;
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  arraySet.ArraySet = ArraySet;
  return arraySet;
}
export {
  requireArraySet as __require
};
