function normalizeConnectAddress(input, useWss = false) {
  const text = String(input ?? "").normalize("NFKC").replace(/\s+/g, "");
  if (!text) {
    return null;
  }
  let href;
  const scheme = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//.exec(text);
  if (scheme) {
    const name = scheme[1].toLowerCase();
    const rest = text.slice(scheme[0].length);
    if (name === "http") {
      href = `ws://${rest}`;
    } else if (name === "https") {
      href = `wss://${rest}`;
    } else if (name === "ws" || name === "wss") {
      href = `${name}://${rest}`;
    } else {
      return null;
    }
  } else {
    href = `${useWss ? "wss" : "ws"}://${text}`;
  }
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "ws:" && url.protocol !== "wss:") {
    return null;
  }
  if (!url.hostname) {
    return null;
  }
  if (!url.port) {
    const hostPart = text.split("://").pop() ?? "";
    const hasPort = /:\d+(?:[/?#]|$)/.test(hostPart);
    if (!hasPort && !scheme && url.pathname === "/") {
      url.port = "8080";
    }
  }
  return url;
}
export {
  normalizeConnectAddress
};
