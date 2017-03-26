import config from '../config';


/* eslint-disable no-param-reassign*/
function drawFigure(ctx) {
  const strokeStyle = '#40300e';
  const fillStyle = 'rgba(255, 255, 255, 0.5)';

  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}
/* eslint-enable no-param-reassign*/

class Background {
  constructor() {
    const {width, height} = config.gameBoard;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.zIndex = 1;

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  get domNode() {
    return this.canvas;
  }

  render({images = []}) {
    this.loadedStaticImages = images;

    this.drawBgImage();
    this.drawSpinnerHole();
    this.drawButtonHole();
    this.drawScoreBoard();
  }

  drawBgImage() {
    const ctx = this.ctx;

    const {image} = this.loadedStaticImages.find(({key}) => key === 'bg');
    const {width, height} = config.gameBoard;
    ctx.drawImage(image, 0, 0, width, height);
  }

  //  can use quadraticCurveTo to created rounded boxes, but it take a lot time
  drawSpinnerHole() {
    const ctx = this.ctx;
    ctx.beginPath();

    const {x, y, width, height} = config.elementsPosition.spinner;
    const padding = {
      x: 5,
      y: 5,
    };

    ctx.rect(x - padding.x, y - padding.y, width + (2 * padding.x), height + (2 * padding.y));
    drawFigure(ctx);
  }

  drawButtonHole() {
    const ctx = this.ctx;
    ctx.beginPath();

    const {x, y, width} = config.elementsPosition.submit;
    const padding = 3;
    const radius = (width / 2) + padding;

    ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
    drawFigure(ctx);
  }

  drawScoreBoard() {
    const ctx = this.ctx;
    ctx.beginPath();

    const {x, y, width, height} = config.elementsPosition.results;

    const padding = {
      x: 5,
      y: 5,
    };

    ctx.rect(x - padding.x, y - padding.y, width + (2 * padding.x), height + (2 * padding.y));
    drawFigure(ctx);
  }
}

export default Background;
