import { Obstacle } from "./Obstacle.js";
import { Controls } from "./Controls.js";
import { Bonus } from "./Bonus.js";
import { collision } from "./collision.js";

class GameEngine {
  canvas = null;
  ctx = null;
  items = [];
  bonus = [];
  player = null;

  keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
  };
  speed = 7;
  maxSpeed = 20;
  score = 0;
  constructor() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 840;
    this.canvas.height = 650;
    this.player = new Obstacle(500, 800, "assets/moto.png");
    this.controls = new Controls();
    this.countItems = 0; // compteur de voiture descendant
    this.countBonus = 0; // compteur de bonus descendant
    this.obstacleSpeed = 3; // vitesse de base des obstacles
    this.bonusSpeed = 4; // vitesse de base des obstacles
    this.countspeed = 1;
    this.currentLevel = 1;
    this.maxLeft = 230;
    this.maxRight = 620;
  }
  randomX(min, max) {
    return Math.random() * (max - min) + min;
  }

  randomY(min, max) {
    return Math.random() * (max - min) + min;
  }
  init() {
    this.initEvent();

    this.items = [
      new Obstacle(
        this.randomX(250, 350),
        this.randomY(0, -200),
        "assets/car.png"
      ),
      new Obstacle(
        this.randomX(250, 550),
        this.randomY(0, -1000),
        "assets/car.png"
      ),
    ];
    this.bonus = [new Bonus(this.randomX(250, 550), this.randomY(-500, -2000))];
  }

  initEvent() {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.keys.up = true;
          break;
        case "ArrowDown":
          this.keys.down = true;
          break;
        case "ArrowLeft":
          this.keys.left = true;
          break;
        case "ArrowRight":
          this.keys.right = true;
          break;
        case " ":
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.keys.up = false;
          break;
        case "ArrowDown":
          this.keys.down = false;
          break;
        case "ArrowLeft":
          this.keys.left = false;
          break;
        case "ArrowRight":
          this.keys.right = false;
          break;
        case " ":
          break;
      }
    });
  }

  update() {
    let prevX = this.player.x;
    let prevY = this.player.y;

    if (this.keys.down) {
      this.player.y += this.speed;
    }
    if (this.keys.up) {
      this.player.y -= this.speed;
    }
    if (this.keys.left) {
      this.player.x -= this.speed;
    }
    if (this.keys.right) {
      this.player.x += this.speed;
    }

    if (this.collisionItem()|| this.collisionRoad())  {
      this.player.x = prevX;
      this.player.y = prevY;
    }

    if (!this.collisionItem()) {
      this.score += 1; // Augmentez le score d'une unité (vous pouvez ajuster cela selon vos besoins)
    }
    this.collisionBorder();

    this.collisionBonus();
  }


  collisionRoad(){
    for (let item of this.items) {
      if (
        this.player.x < this.maxLeft ||
        this.player.x + this.player.getImg().width > this.maxRight
      ) {
        return true;
      }
    }
    return false;
  }

  collisionItem() {
    for (let item of this.items) {
      if (
        this.player.x < item.getImg().width + item.x &&
        this.player.x + this.player.getImg().width > item.x &&
        this.player.y < item.getImg().height + item.y &&
        this.player.y + this.player.getImg().height > item.y
      ) {
        return true;
      }
    }
    return false;
  }
  getMalus() {
    this.speed -= 1;
  }

  getBonus() {
    this.speed += 1;
  }

  randomBonus(min, max) {
    return Math.random() * (max - min) + min;
  }

  collisionBonus() {
    for (let bonus of this.bonus) {
      if (collision(bonus, this.player)) {
        bonus.onImpact = true;
        const randomNum = this.randomBonus(1, 10);
        if (randomNum > 7) {
          this.getMalus();
          this.countspeed -= 1;
        } else {
          this.getBonus();
          this.countspeed += 1;
        }
        
        console.log(randomNum);
      }
    }
  }
 

  collisionBorder() {
    if (this.player.x < 0) {
      this.player.x = 0;
    }
    if (this.player.y < 0) {
      this.player.y = 0;
    }
    if (this.player.x + this.player.getImg().width > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.getImg().width;
    }
    if (this.player.y + this.player.getImg().height > this.canvas.height) {
      this.player.y = this.canvas.height - this.player.getImg().height;
    }
  }

  obstacleMovement() {
    this.items = this.items.filter((item) => item.y < this.canvas.height);
    this.bonus = this.bonus.filter(
      (bonus) => bonus.y < this.canvas.height && !bonus.onImpact
    );

    //TODO IF COLLISION    THEN GAME OVER
    for (let item of this.items) {
      item.y += this.obstacleSpeed;
    }
    for (let element of this.bonus) {
      element.y += this.bonusSpeed;
    }

    if (this.countItems > 5) {
      this.obstacleSpeed += 1;
      this.currentLevel += 1;
      this.countItems = 0;
    }

    if (this.obstacleSpeed > 20) {
      this.obstacleSpeed = this.maxSpeed;
    }
    console.log(this.obstacleSpeed);
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let item of this.items) {
      this.ctx.drawImage(item.getImg(), item.x, item.y);
    }
    for (let element of this.bonus) {
      this.ctx.drawImage(element.getImg(), element.x, element.y);
    }
    this.ctx.drawImage(this.player.getImg(), this.player.x, this.player.y);

    this.ctx.font = "bold 20px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("Score: " + this.score, 20, 30); //affichage du score sur l'écran
    this.ctx.fillText("Niveau: " + this.currentLevel, 700, 30); //affichage du niveau sur l'écran
    this.ctx.fillText("Vitesse: " + this.countspeed, 700, 50); //affichage
  }
  // endGame(){
  //     if (this.collisionItem()) {
  //         this.speed = 0

  //     }
  // }
  gameLoop() {
    if (this.items.length === 1) {
      this.countItems += 2;
      this.items.push(
        new Obstacle(
          this.randomX(250, 350),
          this.randomY(-200, -400),
          "assets/car.png"
        ),
        new Obstacle(
          this.randomX(300, 550),
          this.randomY(-500, -800),
          "assets/car.png"
        )
      );
    }
    if (this.bonus.length === 1) {
      this.countBonus += 1;
      this.bonus.push(
        new Bonus(this.randomX(250, 550), this.randomY(-2000, -5000))
      );
    }

    this.obstacleMovement();

    this.update();
    this.collisionItem();
    this.draw();
    window.requestAnimationFrame(() => {
      this.gameLoop();
      //   this.endGame();
    });
  }

  run() {
    this.init();
    let count = 0;
    for (let item of this.items) {
      item.loaded(() => {
        count++;
        if (count === this.items.length) {
          this.gameLoop();
        }
      });
    }
  }
}

export { GameEngine };
