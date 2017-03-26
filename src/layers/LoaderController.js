import config from '../config';


class LoaderController {
  constructor({canvas}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  startLoading() {
    const ctx = this.ctx;
    const {width, height} = config.gameBoard;
    const centerWidth = width / 2;
    const centerHeight = height / 2;

    ctx.fillRect(0, 0, width, height);

    ctx.font = '26px Arial';
    ctx.textAlign = 'center';
    const text = 'Loading';

    const gradientRadius = ctx.measureText(text).width / 2;
    const gradient = ctx.createLinearGradient(centerWidth - gradientRadius, 0, centerWidth + gradientRadius, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.5, '#00ff00');
    gradient.addColorStop(1.0, '#0000ff');
    ctx.fillStyle = gradient;

    ctx.fillText(text, centerWidth, centerHeight);
  }

  stopLoading() {
    const canvas = this.canvas;
    canvas.style.display = 'none';
  }

}

export default LoaderController;
