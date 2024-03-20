class Obstacle {

    img = null
    x = 0
    y = 0
    score = 0


    constructor(x, y, ...sources) {
        this.images = sources.map(src => {
            const image = new Image()
            image.src = src
            return image
        })
        this.x = x
        this.y = y
        this.index = 0
    }

    getImg() {
        return this.images[this.index]
    }

    loaded(callback) {
        let count = 0
        for (let image of this.images)
        {
            image.onload = () => {
                if (++count === this.images.length) {
                    callback()
                }
            }
        }
    }

}

export { Obstacle }