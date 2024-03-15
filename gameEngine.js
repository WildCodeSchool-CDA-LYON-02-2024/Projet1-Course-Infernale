import { Drw } from "./draw.js";
import { Controls } from "./controls.js";

class GameEngine {
  canvas = null;
  ctx = null;
  items = [];
  player = null;
  speed = 5;
  constructor() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 240;
    this.canvas.height = 800;
    this.player = new Drw("/image/redcar.png", 100, 650);
    this.controls = new Controls();
    this.angle = 0;
  }
  init() {
    this.items = [
      new Drw("/image/cars_one.png", 50, 10),
      new Drw("/image/cars_mini.png", 49, 300),
    ];
  }

  // draw ilage
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let item of this.items) {
      this.ctx.drawImage(item.getImg(), item.x, item.y);
    }
    this.ctx.drawImage(this.player.getImg(), this.player.x, this.player.y);
  }
  update() {
    if (this.controls.forward) {
      this.player.y -= this.speed;
    }
    if (this.controls.reverse) {
      this.player.y += this.speed;
    }
    if (this.controls.left) {
      this.player.x -= this.speed;
    }
    if (this.controls.right) {
      this.player.x += this.speed;
    }
  }

  // run the game loop
  gameLoop() {
    this.update();
    this.draw();
    window.requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  run() {
    this.init();
    let count = 0;
    for (let item of this.items) {
      item.loaded(() => {
        console.log(item);
        if (++count === this.items.length) {
          this.gameLoop();
        }
      });
    }
  }
}

export { GameEngine };
