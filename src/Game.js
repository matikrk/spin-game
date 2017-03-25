import CanvasController from './CanvasController';
import {loadImagesToArray} from './helpers';

class Game {
  constructor() {
    this.initializeInstanceVariables();

    // temporary here
    this.createBackground();

    this.loadResources();
    this.attachListeners();
  }

  initializeInstanceVariables() {
    this.loadedImages = [];
    this.loadedStaticImages = [];

    this.getUIReferences();
  }

  getUIReferences() {
    const $ = id => document.getElementById(id);

    this.elements = {
      select: $('select'),
      canvas: $('canvas'),
      results: $('results'),
      submit: $('submit'),
      bgCanvas: $('bgCanvas'),
    };
  }

  createBackground() {
    this.loadStaticResources();
  }

  loadStaticResources() {
    const paths = {
      bg: '/img/bg.png',
      btSpin: '/img/btnSpin.png',
      btSpinD: '/img/btnSpinD.png',
    };
    return loadImagesToArray(paths, this.loadedStaticImages);
  }


  loadResources() {
    this.startLoading();

    const symbolsPath = '/rest/symbols.json';

    fetch(symbolsPath)
      .then(response => response.json())
      .then(data => this.prepareOptions(data))
      .then(data => this.prepareImages(data))
      .then(() => this.initializeCanvasController())
      .then(() => this.stopLoading());
  }

  prepareOptions(data) {
    Object.keys(data).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.text = key;

      this.elements.select.appendChild(option);
    });

    return data;
  }

  prepareImages(data) {
    return loadImagesToArray(data, this.loadedImages);
  }

  startLoading() {
    this.disableButtons();

// eslint-disable-next-line
    console.log('loading');
  }

  stopLoading() {
    this.enableButtons();

// eslint-disable-next-line
    console.log('stopLoading');
  }

  attachListeners() {
    this.elements.submit.addEventListener('click', this.onSubmit.bind(this));
  }

  onSubmit() {
    this.disableButtons();

    this.spin()
      .then(winnerName => this.updateScoreBoard(winnerName))
      .then(() => this.enableButtons());
  }

  disableButtons() {
    this.elements.submit.disabled = true;
    this.elements.select.disabled = true;
  }

  enableButtons() {
    this.elements.submit.disabled = false;
    this.elements.select.disabled = false;
  }

  spin() {
    return new Promise(resolve => {
      this.onWait();
      const winnerIndex = Math.floor(Math.random() * this.loadedImages.length);
      const winner = this.loadedImages[winnerIndex];

      this.canvasController.spin(winner)
        .then(() => resolve(winner.name));
    });
  }

  onWait() {
    this.elements.results.textContent = 'Wait for it :)';
  }

  onWin() {
    this.elements.results.textContent = 'Win';
  }

  onLoose() {
    this.elements.results.textContent = 'Loose';
  }

  updateScoreBoard(winnerName) {
    const selected = this.elements.select.value;

    if (winnerName === selected) {
      this.onWin();
    } else {
      this.onLoose();
    }
  }

  initializeCanvasController() {
    this.canvasController = new CanvasController({
      canvas: this.elements.canvas,
      images: this.loadedImages,
    });
  }
}

export default Game;
