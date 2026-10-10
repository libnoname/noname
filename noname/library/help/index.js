import aboutGame from "./about-game.js";
import gameControls from "./game-controls.js";
import gameApi from "./game-api.js";
import GamePoptip from "./GamePoptip.vue.js";
const help = {
  关于游戏: aboutGame,
  游戏操作: gameControls,
  游戏命令: gameApi,
  游戏名词: GamePoptip
};
export {
  help as default
};
