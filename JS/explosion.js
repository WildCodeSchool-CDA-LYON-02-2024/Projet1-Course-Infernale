import { Obstacle } from "./Obstacle.js";

export class Explosion extends Obstacle {
    isFinished = false
    currentFrameIndex = 0

    constructor(x, y) {
        super(x, y, 'assets/explosion_atlas.png', 'assets/explosion_atlas2.png', 'assets/explosion_atlas3.png');

        this.frame = Math.floor(Math.random() * (this.images.length - 1));
        this.refresh = 1000
        this.dateFrame = Date.now() + this.refresh;
    }

    getImg() {
        if (this.dateFrame < Date.now()) {
            this.dateFrame = Date.now() + this.refresh

            if (++this.frame > this.images.length - 1) {
                this.frame = 0
            }
        }

        return this.images[this.frame]
    }
}