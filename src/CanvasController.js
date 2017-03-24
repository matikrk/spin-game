class CanvasController {
  constructor({canvas, spinTime = 1000, spinTimeDelta = 0, images = []}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.spinTime = spinTime;
    this.spinTimeDelta = spinTimeDelta; // later to change spin time
    this.images = images;
  }

  drawImage(image) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(image, 0, 0);
  }

  * nextImageGenerator() {
    const length = this.images.length;
    for (let i = 0; i < 50; i++) {
      const index = i % length;
      yield this.images[index].image;
    }
  }


  spin(winner) {
    return new Promise(
      res => {
        const nextImageIterator = this.nextImageGenerator();

        const interval = setInterval(() => {
          const {value} = nextImageIterator.next();
          this.drawImage(value);
        }, 120);

        setTimeout(
          () => {
            clearInterval(interval);
            this.drawImage(winner.image);
            res();
          }, this.spinTime);
      });
  }
}

export default CanvasController;
