import config from '../config';

class BackgroundController {
  constructor({canvas, images = []}) {
    this.canvas = canvas;
    this.loadedStaticImages = images;
    this.ctx = this.canvas.getContext('2d');

    this.createBackground();
  }

  createBackground() {
    this.drawBgImage();
    this.drawSpinnerHole();
    this.drawButtonHole();
    this.drawScoreBoard();
  }

  drawBgImage() {
    const ctx = this.ctx;
    ctx.beginPath();

    // bg image
    const {image} = this.loadedStaticImages.find(({key}) => key === 'bg');
    const {width, height} = config.gameBoard;
    ctx.drawImage(image, 0, 0, width, height);
  }

  drawSpinnerHole() {
    const ctx = this.ctx;
    ctx.beginPath();

    const {x, y, width, height} = config.elementsPosition.spinner;
    const padding = {
      x: 5,
      y: 5,
    };

    //  can use quadraticCurveTo rounded, but take a lot time
    ctx.rect(x - padding.x, y - padding.y, width + (2 * padding.x), height + (2 * padding.y));
    ctx.strokeStyle = '#40300e';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }

  drawButtonHole() {
    const ctx = this.ctx;
    ctx.beginPath();

    const {x, y, width} = config.elementsPosition.submit;
    const padding = 3;
    const radius = (width / 2) + padding;

    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);

    ctx.strokeStyle = '#40300e';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }

  drawScoreBoard() {
    const ctx = this.ctx;
    ctx.beginPath();

    const {x, y, width, height} = config.elementsPosition.results;

    const padding = {
      x: 5,
      y: 5,
    };

    //  can use quadraticCurveTo rounded, but take a lot time
    ctx.rect(x - padding.x, y - padding.y, width + (2 * padding.x), height + (2 * padding.y));

    ctx.strokeStyle = '#40300e';
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
  }


}

export default BackgroundController;
