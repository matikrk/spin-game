import CanvasController from './CanvasController';
import {loadImagesToArray, promiseDelay, setElementPosition} from './helpers';
import config from './config';

class Game {
  constructor(gameContainer) {
    this.initializeInstanceVariables();
    this.createGameLayers(gameContainer);
    this.loadGame();
  }

  createGameLayers(gameContainer = document.body) {
    const gameBoard = document.createElement('div');
    gameBoard.classList.add('game-board');
    const {width, height} = config.gameBoard;

    const background = document.createElement('canvas');
    background.width = width;
    background.height = height;
    background.style.zIndex = 1;

    const main = document.createElement('canvas');
    main.width = width;
    main.height = height;
    main.style.zIndex = 2;

    const ui = document.createElement('div');
    ui.style.width = `${width}px`;
    ui.style.height = `${height}px`;
    ui.style.zIndex = 3;

    const loader = document.createElement('canvas');
    loader.width = width;
    loader.height = height;
    loader.style.zIndex = 4;

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
  }

  loadGame() {
    this.startLoading();
    Promise.all([
      promiseDelay(1000)(), // fake delay for loading
      this.loadStaticResources().then(() => this.createBackground()),
      this.loadDynamicResources(),
    ])
      .then(() => this.createControlUI())
      .then(() => this.createMainLayer())
      .then(() => this.stopLoading());
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

    // bg image
    const {image} = this.loadedStaticImages.find(({key}) => key === 'bg');
    const {width, height} = config.gameBoard;
    ctx.drawImage(image, 0, 0, width, height);

    // spinner hole
    this.drawSpinnerHole();

    this.drawButtonHole();
    this.drawScoreBoard();
  }

  drawSpinnerHole() {
    const background = this.layers.background;
    const ctx = background.getContext('2d');

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
    const background = this.layers.background;
    const ctx = background.getContext('2d');

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
    const background = this.layers.background;
    const ctx = background.getContext('2d');

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

  loadDynamicResources() {
    const symbolsPath = '/rest/symbols.json';

    return fetch(symbolsPath)
      .then(response => response.json())
      .then(data => this.prepareImages(data));
  }


  createControlUI() {
    const select = document.createElement('select');
    setElementPosition(select, 'select');
    this.prepareOptions(select);

    const results = document.createElement('div');
    results.style.color = '#fff';
    setElementPosition(results, 'results');

    const submit = document.createElement('button');
    setElementPosition(submit, 'submit');
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
    this.elements.results.textContent = 'Lose';
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
