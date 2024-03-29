import { Obstacle } from "./Obstacle.js";
import { Controls } from "./Controls.js";
import { Bonus } from "./Bonus.js";
import { collision } from "./collision.js";
import { Explosion } from "./explosion.js";

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
  explosions = [];

  constructor() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 640;
    this.canvas.height = 827;
    this.controls = new Controls();
    this.countItems = 0;
    this.obstacleSpeed = 5;
    this.level = document.getElementById("niveau");
    this.currentLevel = 1;
    this.countItems = 0; // compteur de voiture descendant
    this.countBonus = 0; // compteur de bonus descendant
    this.bonusSpeed = 4; // vitesse de base des obstacles
    this.countspeed = 1;
    this.currentLevel = 1;
    this.maxLeft = 50;
    this.maxRight = 570;
    this.timeLeft = 3;
    this.isGameOver = false;
  }

  randomX(min, max) {
    return Math.random() * (max - min) + min;
  }

  randomY(min, max) {
    return Math.random() * (max - min) + min;
  }

  init() {
    this.score = 0;
    this.items = [];
    this.obstacleSpeed = 5;
    this.currentLevel = 1;
    this.speed = 7;

    this.stopMenuMusic();
    this.backgroundMusic();
    document.getElementById("game").style =
      "animation: road 3s linear infinite";
    this.initEvent();
    this.player = new Obstacle(400, 800, "assets/moto.png");

    this.items = [
      new Obstacle(
        this.randomX(50, 350),
        this.randomY(0, -200),
        "assets/car.png"
      ),
      new Obstacle(
        this.randomX(250, 570),
        this.randomY(0, -1000),
        "assets/car2.png"
      ),
    ];
    this.bonus = [new Bonus(this.randomX(250, 550), this.randomY(-500, -2000))];
    this.isGameOver = false;
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

    if (this.collisionItem()) {
      this.player.x = prevX;
      this.player.y = prevY;
      this.createExplosionSound();
      this.isGameOver = true;
      this.endGame();
    }

    if (!this.collisionItem()) {
      this.score += 1;
    }

    this.collisionBorder();
    this.collisionBonus();
    this.collisionItem();

    for (let explosion of this.explosions) {
      if (!explosion.isFinished) {
        explosion.currentFrameIndex++;

        if (explosion.currentFrameIndex >= explosion.images.length) {
          explosion.isFinished = true;
        }
      }
    }

    this.explosions = this.explosions.filter((explosion) => {
      return !explosion.isFinished;
    });

    if (this.items.length === 1) {
      this.countItems += 2;
      this.items.push(
        new Obstacle(
          this.randomX(50, 350),
          this.randomY(-200, -400),
          "assets/car.png"
        ),
        new Obstacle(
          this.randomX(300, 550),
          this.randomY(-500, -800),
          "assets/car2.png"
        ),
        new Obstacle(
          this.randomX(100, 500),
          this.randomY(-800, -1000),
          "assets/car3.png"
        )
      );
    }

    if (this.bonus.length === 1) {
      this.countBonus += 1;
      this.bonus.push(
        new Bonus(this.randomX(50, 570), this.randomY(-2000, -5000))
      );
    }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // collision entre la moto et les voitures
  collisionItem() {
    for (let item of this.items) {
      if (collision(this.player, item)) {
        this.createExplosion(item);
        this.createExplosion(this.player);
        item.onImpact = true;
        this.stopBackgroundMusic();
        return true;
      }
    }
    return false;
  }

  // collision entre la moto et les murs de la route
  getMalus() {
    this.speed -= 1;
  }

  getBonus() {
    this.speed += 2;
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
      }
    }
  }

  collisionBorder() {
    if (this.player.y < 0) {
      this.player.y = 0;
    }
    if (this.player.y + this.player.getImg().height > this.canvas.height) {
      this.player.y = this.canvas.height - this.player.getImg().height;
    }
    if (this.player.x < this.maxLeft) {
      this.player.x = this.maxLeft;
    }
    if (this.player.x + this.player.getImg().width > this.maxRight) {
      this.player.x = this.maxRight - this.player.getImg().width;
    }
  }

  obstacleMovement() {
    this.items = this.items.filter(
      (item) => item.y < this.canvas.height && !item.onImpact
    );
    this.bonus = this.bonus.filter(
      (bonus) => bonus.y < this.canvas.height && !bonus.onImpact
    );

    for (let item of this.items) {
      item.y += this.obstacleSpeed;
    }
    for (let element of this.bonus) {
      element.y += this.bonusSpeed;
    }

    if (this.countItems > 5) {
      this.obstacleSpeed += 3;
      this.currentLevel += 1;
      this.countItems = 0;
    }

    if (this.obstacleSpeed > 20) {
      this.obstacleSpeed = this.maxSpeed;
    }
  }

  // creer les images sur le canvas
  draw() {
    this.clear();
    for (let item of this.items) {
      this.ctx.drawImage(item.getImg(), item.x, item.y);
    }
    for (let element of this.bonus) {
      this.ctx.drawImage(element.getImg(), element.x, element.y);
    }
    this.ctx.drawImage(this.player.getImg(), this.player.x, this.player.y);
    // for (let explosion of this.explosions) {
    //   this.ctx.drawImage(explosion.getImg(), explosion.x, explosion.y);
    // }

    this.ctx.font = "bold 30px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = "hsl(210, 100%, 50%)";
    this.ctx.lineWidth = 8;
    this.ctx.fillText("Score: " + this.score, 20, 30); //affichage du score sur l'écran
    this.ctx.fillText("Niveau: " + this.currentLevel, 480, 30); //affichage du niveau sur l'écran
    this.ctx.fillText("Vitesse: " + this.countspeed, 480, 60); //affichage
    console.log(this.score);
  }

  endGame() {
    this.menuMusic();
    this.bonusSpeed = 0;
    this.obstacleSpeed = 0;
    console.log(this.score);
    document.getElementById("titleMenu").innerText = "GAME OVER";
    document.getElementById(
      "contentMenu"
    ).innerText = `Score de la partie : ${this.score}`;
    document.getElementById("menu").style = "display: flex";
    document.getElementById("game").style =
      " animation: road 0s linear infinite";
    document.getElementById("startBtn").innerText = "Restart the Game";
  }

  createExplosion(item) {
    const explosion = new Explosion(null, null);
    explosion.x = item.x - 100;
    explosion.y = item.y - 50;
    this.explosions.push(explosion);
  }

  createExplosionSound() {
    const explosionSound = new Audio("assets/sound/explosion.flac");
    return explosionSound.play();
  }

  raceStart() {
    const raceStart = new Audio("assets/sound/raceStart.mp3");
    return raceStart.play();
  }

  backgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.loop = true;
    backgroundMusic.play();
  }

  stopBackgroundMusic() {
    const backgroundMusic = document.getElementById("backgroundMusic");
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
  }

  menuMusic() {
    const menuMusic = document.getElementById("menuMusic");
    menuMusic.loop = true;
    menuMusic.play();
  }

  stopMenuMusic() {
    const menuMusic = document.getElementById("menuMusic");
    if (menuMusic) {
      menuMusic.pause();
    }
  }

  countdown() {
    this.clear();

    if (this.timeLeft > 0) {
      this.ctx.font = "bold 80px Arial";
      this.ctx.fillStyle = "red";
      const text = this.timeLeft.toString();
      const textWidth = this.ctx.measureText(text).width;
      const x = (this.canvas.width - textWidth) / 2;
      const y = this.canvas.height / 2;
      this.ctx.fillText(text, x, y);
      this.timeLeft--;
      setTimeout(() => {
        this.countdown();
      }, 1000);
    } else {
      const textWidth = this.ctx.measureText("START !!!!").width;
      const x = (this.canvas.width - textWidth) / 2;
      const y = this.canvas.height / 2;
      this.ctx.font = "bold 50px superpixel";
      this.ctx.fillText("START !!!!", x, y);
    }
  }

  // le boucle du jeu
  gameLoop() {
    if (!this.isGameOver) {
      this.obstacleMovement();
      this.update();
      this.draw();
    }
    window.requestAnimationFrame(() => {
      this.gameLoop();
    });
  }

  // démarage du jeu
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
