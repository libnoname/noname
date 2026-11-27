import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireMedia } from "./media.js";
var src;
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  const { webm, mp4 } = requireMedia();
  const oldIOS = () => typeof navigator !== "undefined" && parseFloat(
    ("" + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(
      navigator.userAgent
    ) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")
  ) < 10 && !window.MSStream;
  const nativeWakeLock = () => "wakeLock" in navigator;
  class NoSleep {
    constructor() {
      this.enabled = false;
      if (nativeWakeLock()) {
        this._wakeLock = null;
        const handleVisibilityChange = () => {
          if (this._wakeLock !== null && document.visibilityState === "visible") {
            this.enable();
          }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleVisibilityChange);
      } else if (oldIOS()) {
        this.noSleepTimer = null;
      } else {
        this.noSleepVideo = document.createElement("video");
        this.noSleepVideo.setAttribute("title", "No Sleep");
        this.noSleepVideo.setAttribute("playsinline", "");
        this._addSourceToVideo(this.noSleepVideo, "webm", webm);
        this._addSourceToVideo(this.noSleepVideo, "mp4", mp4);
        this.noSleepVideo.addEventListener("loadedmetadata", () => {
          if (this.noSleepVideo.duration <= 1) {
            this.noSleepVideo.setAttribute("loop", "");
          } else {
            this.noSleepVideo.addEventListener("timeupdate", () => {
              if (this.noSleepVideo.currentTime > 0.5) {
                this.noSleepVideo.currentTime = Math.random();
              }
            });
          }
        });
      }
    }
    _addSourceToVideo(element, type, dataURI) {
      var source = document.createElement("source");
      source.src = dataURI;
      source.type = `video/${type}`;
      element.appendChild(source);
    }
    get isEnabled() {
      return this.enabled;
    }
    enable() {
      if (nativeWakeLock()) {
        return navigator.wakeLock.request("screen").then((wakeLock) => {
          this._wakeLock = wakeLock;
          this.enabled = true;
          console.log("Wake Lock active.");
          this._wakeLock.addEventListener("release", () => {
            console.log("Wake Lock released.");
          });
        }).catch((err) => {
          this.enabled = false;
          console.error(`${err.name}, ${err.message}`);
          throw err;
        });
      } else if (oldIOS()) {
        this.disable();
        console.warn(`
        NoSleep enabled for older iOS devices. This can interrupt
        active or long-running network requests from completing successfully.
        See https://github.com/richtr/NoSleep.js/issues/15 for more details.
      `);
        this.noSleepTimer = window.setInterval(() => {
          if (!document.hidden) {
            window.location.href = window.location.href.split("#")[0];
            window.setTimeout(window.stop, 0);
          }
        }, 15e3);
        this.enabled = true;
        return Promise.resolve();
      } else {
        let playPromise = this.noSleepVideo.play();
        return playPromise.then((res) => {
          this.enabled = true;
          return res;
        }).catch((err) => {
          this.enabled = false;
          throw err;
        });
      }
    }
    disable() {
      if (nativeWakeLock()) {
        if (this._wakeLock) {
          this._wakeLock.release();
        }
        this._wakeLock = null;
      } else if (oldIOS()) {
        if (this.noSleepTimer) {
          console.warn(`
          NoSleep now disabled for older iOS devices.
        `);
          window.clearInterval(this.noSleepTimer);
          this.noSleepTimer = null;
        }
      } else {
        this.noSleepVideo.pause();
      }
      this.enabled = false;
    }
  }
  src = NoSleep;
  return src;
}
export {
  requireSrc as __require
};
