class PoliceCar {
  img1 = null;
  img2 = null;
  x = 0;
  y = 0;

  constructor(x, y) {
    this.img1 = new Image();
    this.img2 = new Image();
    this.img1.src = src;
    this.img2.src = src;
    this.x = x;
    this.y = y;
    this.isRed = true;
    this.countFrame = 0;
  }
  getImg() {
    if (++this.countFrame === 10) {
      this.isRed = !this.isRed;
      return this.countFrame;
    }
    return this.isRed ? this.img1 : this.img2;
  }
  loaded(callback) {
    this.imgp.onload = () => {
      callback();
    };
  }
}

export { PoliceCar };
