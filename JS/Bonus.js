import {Obstacle} from "./Drawable.js";

class Bonus extends Obstacle {

    constructor(x, y) {
        super(x, y, 'asset/police-car-siren-red.png', 'asset/police-car-siren-blue.png')
        this.isRed = true
        this.dateFrame = Date.now()
    }

    getImg() {
        if (this.dateFrame + 200 < Date.now()) {
            this.isRed = !this.isRed
            this.dateFrame = Date.now()
        }
        return this.isRed ? this.images[0] : this.images[1]
    }
}

export {Bonus}