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
    this.ctx.drawImage(image, 0, 0)
  }

  spin(winner) {
    return new Promise(
      res => {
        this.drawImage(winner.image)
        res();
      })
  }

}
export default CanvasController;
