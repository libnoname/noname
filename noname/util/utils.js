const NO_RETURN = /* @__PURE__ */ Symbol("no return");
function debounce(sourceFunction, options = 500) {
  let lastTimerId = null;
  let lastResolve = null;
  let delay = typeof options === "number" ? options : options?.delay;
  if (!delay || !Number.isInteger(delay) || delay <= 0) {
    delay = 500;
  }
  let failResult = typeof options === "number" ? NO_RETURN : options?.failResult;
  return function(...args) {
    if (lastTimerId != null) {
      if (failResult !== NO_RETURN) {
        lastResolve?.(failResult);
      }
      clearTimeout(lastTimerId);
    }
    return new Promise((resolve) => {
      lastResolve = resolve;
      lastTimerId = setTimeout(() => {
        lastTimerId = null;
        resolve(sourceFunction.apply(this, args));
      }, delay);
    });
  };
}
function throttle(sourceFunction, options = 500) {
  let lastTimerId = null;
  let lastResolve = null;
  let delay = typeof options === "number" ? options : options?.delay;
  if (!delay || !Number.isInteger(delay) || delay <= 0) {
    delay = 500;
  }
  let failResult = typeof options === "number" ? NO_RETURN : options?.failResult;
  return function(...args) {
    if (lastTimerId != null) {
      if (failResult !== NO_RETURN) {
        return Promise.resolve(failResult);
      }
      return new Promise(() => {
      });
    }
    return new Promise((resolve) => {
      lastResolve = resolve;
      lastTimerId = setTimeout(() => {
        lastTimerId = null;
        resolve(sourceFunction.apply(this, args));
      }, delay);
    });
  };
}
export {
  debounce,
  throttle
};
