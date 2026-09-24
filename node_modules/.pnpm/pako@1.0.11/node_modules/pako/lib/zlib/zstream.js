import "../../../../../../../_virtual/_commonjsHelpers.js";
var zstream;
var hasRequiredZstream;
function requireZstream() {
  if (hasRequiredZstream) return zstream;
  hasRequiredZstream = 1;
  "use strict";
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  zstream = ZStream;
  return zstream;
}
export {
  requireZstream as __require
};
