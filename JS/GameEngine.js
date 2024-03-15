import {Obstacle} from "./Obstacle.js"
import { Controls } from "./Controls.js";


class GameEngine {

    canvas = null
    ctx = null
    items = []
    player= null


    speed = 7

    constructor() {
        this.canvas = document.getElementById('game')
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = 840
        this.canvas.height = 650
        this.player = new Obstacle('assets/moto.png', 500, 800)
        this.controls = new Controls();
    }

    init() {
  
        this.items = [
            new Obstacle('assets/car.png',  this.randomX(200,600), this.randomY(0,-200)),
            // new Obstacle('assets/car.png',  500, -500),
            // new Obstacle('assets/car.png',  300, -1000),
            // new Obstacle('assets/car.png',  500,-1400),
            // new Obstacle('assets/car.png',  200, -1900),
            // new Obstacle('assets/car.png',  500, -2500),
            // new Obstacle('assets/car.png',  400, -2900),
            // new Obstacle('assets/car.png',  200, -3500),
            // new Obstacle('assets/car.png',  400, -4100),
            // new Obstacle('assets/car.png',  500, -4600),
            // new Obstacle('assets/car.png',  300, -5100),
            // new Obstacle('assets/car.png',  400,-5400),
            // new Obstacle('assets/car.png',  600, -5800),
            // new Obstacle('assets/car.png',  400, -6300),
            // new Obstacle('assets/car.png',  200, -7000),
            // new Obstacle('assets/car.png',  500, -7200),
        ]
    }


    update() {

        let prevX = this.player.x
        let prevY = this.player.y

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

        if (this.collisionItem()) {
            this.player.x = prevX
            this.player.y = prevY
        }
    }
        this.collisionBorder()
    }

    collisionItem() {
        for (let item of this.items)
        {
            if (
                this.player.x < item.getImg().width + item.x
                && this.player.x + this.player.getImg().width > item.x
                && this.player.y < item.getImg().height + item.y
                && this.player.y + this.player.getImg().height > item.y
            ) {
                return true
            }
        }
        return false
    }

    collisionBorder() {
        if (this.player.x < 0) {
            this.player.x = 0
        }
        if (this.player.y < 0) {
            this.player.y= 0
        }
        if (this.player.x + this.player.img.width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.img.width
        }
        if (this.player.y + this.player.img.height > this.canvas.height) {
            this.player.y = this.canvas.height - this.player.img.height
        }
    }

    obstacleMovement(){
        for (let item of this.items)
        {
            // if (this.endGame()){
            //     item.y
            // }
            item.y += 10
            
        }
    }
randomX(min, max){
    return Math.random() * (max - min) + min;
}

randomY(min, max){
    return Math.random() * (max - min) + min;
}
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let item of this.items)
        {
            this.ctx.drawImage(item.getImg(), item.x, item.y)
        }
        this.ctx.drawImage(this.player.getImg(), this.player.x, this.player.y)
    }
    endGame(){
        if (this.collisionItem()) {
            this.speed = 0
            this.obstacleMovement()
        }
    }
    gameLoop() {
        this.items
        this.obstacleMovement()
        this.update()
        this.draw()
        window.requestAnimationFrame(() => {
            this.gameLoop()
            // this.endGame()
        })
    }

    run() {
        this.init()
        let count = 0
        for (let item of this.items)
        {
            item.loaded(() => {
                console.log(item)
                if (++count === this.items.length) {
                    this.gameLoop()
                }
            })
        }
    }
}

export { GameEngine }