class CanvasController {
  constructor(config) {
    this.setupConfig(config);
    this.drawInitialScreen();
  }

  setupConfig({canvas, spinTime = 1000, spinTimeDelta = 500, images = []}) {
    this.canvas = canvas;
    this.spinTime = spinTime;
    this.spinTimeDelta = spinTimeDelta;
    this.images = images;

    this.ctx = canvas.getContext('2d');
  }

  drawInitialScreen() {
    if (this.images.length > 0) {
      this.drawImage(this.images[0].image);
    } else {
      this.ctx.font = '26px Arial';
      this.ctx.fillText('Problem occurred', 10, 50);
    }
  }

  drawImage(image) {
    requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(image, 0, 0);
    });
  }

  * nextImageGenerator() {
    const length = this.images.length;
    for (let i = 0; i < 50; i++) {
      const index = i % length;
      yield this.images[index].image;
    }
  }

  get finalSpinTime() {
    return this.spinTime + (Math.random() * this.spinTimeDelta);
  }

  spin(winner) {
    return new Promise(res => {
      const nextImageIterator = this.nextImageGenerator();

      const interval = setInterval(() => {
        const {value} = nextImageIterator.next();
        this.drawImage(value);
      }, 120);

      setTimeout(() => {
        clearInterval(interval);
        this.drawImage(winner.image);
        res();
      }, this.finalSpinTime);
    });
  }
}

export default CanvasController;
