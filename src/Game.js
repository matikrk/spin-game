import CanvasController from './CanvasController';
import {loadImagesToArray} from './helpers';

const $ = id => document.getElementById(id);

class Game {
  constructor(gameContainer) {
    this.createGameLayers(gameContainer);
    this.initializeInstanceVariables();
    this.loadGame();
  }

  createGameLayers(gameContainer = document.body) {
    const gameBoard = document.createElement('div');
    const [width, height] = [640, 240];

    const background = document.createElement('canvas');
    background.width = width;
    background.height = height;

    const main = document.createElement('canvas');
    main.width = width;
    main.height = height;

    const ui = document.createElement('div');
    ui.style.width = `${width}px`;
    ui.style.height = `${height}px`;

    const layers = {background, main, ui};
    Object.values(layers).forEach(layer => gameBoard.appendChild(layer));

    gameContainer.appendChild(gameBoard);

    this.layers = layers;
  }

  initializeInstanceVariables() {
    this.loadedImages = [];
    this.loadedStaticImages = [];
  }

  loadGame() {
    this.startLoading();

    Promise.all([
      this.loadStaticResources().then(() => this.createBackground()),
      this.loadDynamicResources(),
    ])
      .then(() => this.createControlUI())
      .then(() => this.createMainLayer())
      .then(() => this.stopLoading());
  }

  startLoading() {
// eslint-disable-next-line
    console.log('loading');
  }

  stopLoading() {
// eslint-disable-next-line
    console.log('stopLoading');
  }


  loadStaticResources() {
    const paths = {
      bg: '/img/bg.png',
      btSpin: '/img/btnSpin.png',
      btSpinD: '/img/btnSpinD.png',
    };
    return loadImagesToArray(paths, this.loadedStaticImages);
  }

  createBackground() {
    const background = this.layers.background;
    const ctx = background.getContext('2d');
    const {image} = this.loadedStaticImages.find(({key}) => key === 'bg');
    ctx.drawImage(image, 0, 0);
  }

  loadDynamicResources() {
    const symbolsPath = '/rest/symbols.json';

    return fetch(symbolsPath)
      .then(response => response.json())
      .then(data => this.prepareImages(data));
  }

  createControlUI() {
    const select = document.createElement('select');
    select.style.position = 'absolute';
    this.prepareOptions(select);

    const results = document.createElement('div');
    results.style.position = 'absolute';
    results.style.left = '200px';

    const submit = document.createElement('button');
    submit.style.position = 'absolute';
    submit.style.left = '100px';
    submit.textContent = 'spin';

    const elements = {select, results, submit};
    Object.values(elements).forEach(element => this.layers.ui.appendChild(element));

    this.elements = elements;

    this.attachListeners();
  }

  prepareOptions(select) {
    this.loadedImages.forEach(({key}) => {
      const option = document.createElement('option');
      option.value = key;
      option.text = key;

      select.appendChild(option);
    });
  }

  prepareImages(data) {
    return loadImagesToArray(data, this.loadedImages);
  }

  attachListeners() {
    this.elements.submit.addEventListener('click', () => this.onSubmit());
  }

  onSubmit() {
    this.disableButtons();

    this.spin()
      .then(winnerKey => this.updateScoreBoard(winnerKey))
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
        .then(() => resolve(winner.key));
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

  updateScoreBoard(winnerKey) {
    const selected = this.elements.select.value;

    if (winnerKey === selected) {
      this.onWin();
    } else {
      this.onLoose();
    }
  }

  createMainLayer() {
    this.canvasController = new CanvasController({
      canvas: this.layers.main,
      images: this.loadedImages,
    });
  }
}

export default Game;
