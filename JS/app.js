import { GameEngine } from "./GameEngine.js";

const game = new GameEngine();
game.menuMusic()

,
document.getElementById("startBtn").onclick = () => {
  document.getElementById("menu").style = "display: none";
  game.stopMenuMusic()
  game.raceStart(),
  setTimeout(game.countdown(), 1000)

  setTimeout(
    () => (game.player !== null ? game.init() : game.run()),
    4000
  );
};
