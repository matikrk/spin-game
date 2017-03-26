import {promiseDelay} from '../helpers';
import config from '../config';

class Main {
  constructor(cfg = {}) {
    this.setupConfig(cfg);
    const {width, height} = config.gameBoard;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = 2;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  get domNode() {
    return this.canvas;
  }

  render({images = []}) {
    this.images = images;
    this.drawInitialScreen();
  }

  setupConfig({spinTime = 1000, spinTimeDelta = 500}) {
    this.spinTime = spinTime;
    this.spinTimeDelta = spinTimeDelta;
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
    const {gameBoard: {width: canvasWidth, height: canvasHeight}, elementsPosition: {spinner: {x, y}}} = config;
    requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      this.ctx.drawImage(image, x, y);
    });
  }

  * nextImageGenerator() {
    const length = this.images.length;
    let i = 0;

    // eslint-disable-next-line
    while (true) {
      const index = i % length;
      yield this.images[index].image;
      i++;
    }
  }

  get finalSpinTime() {
    return this.spinTime + (Math.random() * this.spinTimeDelta);
  }

  spin(winner) {
    const nextImageIterator = this.nextImageGenerator();
    const visibleSlidedPeriod = 120;

    const interval = setInterval(() => {
      const {value} = nextImageIterator.next();
      this.drawImage(value);
    }, visibleSlidedPeriod);

    const drawFinalStep = () => {
      clearInterval(interval);
      this.drawImage(winner.image);
    };

    return promiseDelay(this.finalSpinTime)()
      .then(drawFinalStep)
      .then(promiseDelay(visibleSlidedPeriod));
  }
}

export default Main;
