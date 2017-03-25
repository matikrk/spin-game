import CanvasController from './CanvasController';
import {loadImagesToArray, promiseDelay} from './helpers';

class Game {
  constructor(gameContainer) {
    this.initializeInstanceVariables();
    this.createGameLayers(gameContainer);
    this.loadGame();
  }

  createGameLayers(gameContainer = document.body) {
    const gameBoard = document.createElement('div');
    gameBoard.classList.add('game-board');
    const {width, height} = this.config;

    const background = document.createElement('canvas');
    background.width = width;
    background.height = height;

    const main = document.createElement('canvas');
    main.width = width;
    main.height = height;

    const ui = document.createElement('div');
    ui.style.width = `${width}px`;
    ui.style.height = `${height}px`;

    const loader = document.createElement('canvas');
    loader.width = width;
    loader.height = height;

    const layers = {background, main, ui, loader};
    Object.values(layers).forEach(layer => {
      layer.classList.add('game-board__layer');
      gameBoard.appendChild(layer);
    });

    gameContainer.appendChild(gameBoard);

    this.layers = layers;
  }

  initializeInstanceVariables() {
    this.loadedImages = [];
    this.loadedStaticImages = [];
    this.config = {
      width: 640,
      height: 240,
    };
  }

  loadGame() {
    this.startLoading();
    console.time('a');
    console.timeEnd('a');
    Promise.all([
      promiseDelay(1000)(), // fake delay for loading
      this.loadStaticResources().then(() => this.createBackground()),
      this.loadDynamicResources(),
    ])
      .then(() => this.createControlUI())
      .then(() => this.createMainLayer())
      .then(() => this.stopLoading())
      .then(() => console.timeEnd('a'));
  }

  startLoading() {
    const canvas = this.layers.loader;
    const ctx = canvas.getContext('2d');

    const centerWidth = canvas.width / 2;
    const centerHeight = canvas.height / 2;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    const canvas = this.layers.loader;
    canvas.style.display = 'none';
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
