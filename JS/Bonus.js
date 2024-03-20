import {Obstacle} from "./Obstacle.js";

class Bonus extends Obstacle {

    constructor(x, y) {
        super(x, y, 'assets/bonus1.png', 'assets/bonus2.png')
        this.isShining = true
        this.dateFrame = Date.now()
        this.onImpact = false
    }

    getImg() {
        if (this.dateFrame + 200 < Date.now()) {
            this.isShining = !this.isShining
            this.dateFrame = Date.now()
        }
        return this.isShining ? this.images[0] : this.images[1]
    }
}

export {Bonus}