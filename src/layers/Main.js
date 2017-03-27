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
    this.changeResultText();
  }

  drawImage(image) {
    const {x, y, width, height} = config.elementsPosition.spinner;
    requestAnimationFrame(() => {
      this.ctx.clearRect(x, y, width, height);
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

  changeResultText({win = 0, lose = 0} = {}) {
    const {x, y, width, height} = config.elementsPosition.scoreBoard;
    const centerWidth = x + (width / 2);
    const gap = height / 5;
    const ctx = this.ctx;
    requestAnimationFrame(() => {
      ctx.textAlign = 'center';
      ctx.font = '24px Arial';

      ctx.clearRect(x, y, width, height);
      ctx.fillText('WIN', centerWidth, y + gap);
      ctx.fillText(win.toString(), centerWidth, y + (2 * gap));
      ctx.fillText('LOSE', centerWidth, y + (3 * gap));
      ctx.fillText(lose.toString(), centerWidth, y + (4 * gap));
    });
  }
}

export default Main;
