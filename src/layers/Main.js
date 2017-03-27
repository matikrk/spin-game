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

  getImageByModuloIndex(num) {
    const length = this.images.length;
    const index = num % length;
    return this.images[index];
  }

  drawSpinClip(spinPos) {
    const {x, y, width, height} = config.elementsPosition.spinner;
    const imgNo = Math.floor(spinPos / height);
    const imgOffset = spinPos % height;

    const upperPartImg = this.getImageByModuloIndex(imgNo + 1).image;
    const bottomPartImg = this.getImageByModuloIndex(imgNo).image;
    this.ctx.clearRect(x, y, width, height);
    const upperImgOffset = imgOffset - height;
    this.ctx.drawImage(upperPartImg, x, y + upperImgOffset);
    this.ctx.drawImage(bottomPartImg, x, y + imgOffset);
    this.ctx.clearRect(x, 0, width, y);
    this.ctx.clearRect(x, y + height, width, y + height + height);
  }

  get finalSpinTime() {
    return this.spinTime + (Math.random() * this.spinTimeDelta);
  }

  spin(winner) {
    let shouldSpin = true;
    const startTime = +new Date();

    const spinning = () => {
      requestAnimationFrame(() => {
        const deltaTime = +new Date() - startTime;
        const speed = 2; //  slided/ms
        this.drawSpinClip(speed * deltaTime);
        if (shouldSpin) {
          spinning();
        }
      });
    };

    spinning();

    const drawFinalStep = () => {
      shouldSpin = false;
      this.drawImage(winner.image);
    };

    return promiseDelay(this.finalSpinTime)()
      .then(drawFinalStep)
      .then(promiseDelay(12));
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
