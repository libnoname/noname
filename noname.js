import { AI, ai, setAI } from "./noname/ai/index.js";
import { Game, game, setGame } from "./noname/game/index.js";
import { Get, get, setGet } from "./noname/get/index.js";
import { Library, lib, setLibrary } from "./noname/library/index.js";
import { _status, setStatus, status } from "./noname/status/index.js";
import { UI, setUI, ui } from "./noname/ui/index.js";
let url = new URL(
  /* @vite-ignore */
  "./",
  import.meta.url
);
if (!url.href.endsWith("/")) {
  url = new URL(url.href + "/");
}
const rootURL = url;
export {
  AI,
  Game,
  Get,
  Library,
  UI,
  _status,
  ai,
  game,
  get,
  lib,
  rootURL,
  setAI,
  setGame,
  setGet,
  setLibrary,
  setStatus,
  setUI,
  status,
  ui
};
