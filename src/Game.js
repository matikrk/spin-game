import CanvasController from './layers/CanvasController';
import BackgroundController from './layers/BackgroundController';
import UIController from './layers/UIController';
import LoaderController from './layers/LoaderController';

import {loadImagesToArray, promiseDelay} from './helpers';
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
    this.layersControlers = {};
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

  createBackground() {
    this.layersControlers.backgroundController = new BackgroundController({
      canvas: this.layers.background,
      images: this.loadedStaticImages,
    });
  }

  startLoading() {
    this.layersControlers.loaderController = new LoaderController({
      canvas: this.layers.loader,
    });
    this.layersControlers.loaderController.startLoading();
  }

  stopLoading() {
    this.layersControlers.loaderController.stopLoading();
  }


  loadStaticResources() {
    const paths = {
      bg: '/img/bg.png',
      btSpin: '/img/btnSpin.png',
      btSpinD: '/img/btnSpinD.png',
    };
    return loadImagesToArray(paths, this.loadedStaticImages);
  }

  loadDynamicResources() {
    const symbolsPath = '/rest/symbols.json';

    return fetch(symbolsPath)
      .then(response => response.json())
      .then(data => this.prepareImages(data));
  }


  createControlUI() {
    this.layersControlers.uiController = new UIController({
      container: this.layers.ui,
      images: this.loadedStaticImages,
      selectImages: this.loadedImages,
      onSubmit: () => this.onSubmit(),
    });
  }

  prepareImages(data) {
    return loadImagesToArray(data, this.loadedImages);
  }


  onSubmit() {
    this.disableButtons();

    this.spin()
      .then(winnerKey => this.updateScoreBoard(winnerKey))
      .then(() => this.enableButtons());
  }

  disableButtons() {
    this.layersControlers.uiController.disableButtons();
  }

  enableButtons() {
    this.layersControlers.uiController.enableButtons();
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
    this.layersControlers.uiController.elements.results.textContent = 'Wait for it :)';
  }

  onWin() {
    this.layersControlers.uiController.elements.results.textContent = 'Win';
  }

  onLoose() {
    this.layersControlers.uiController.elements.results.textContent = 'Lose';
  }

  updateScoreBoard(winnerKey) {
    const selected = this.layersControlers.uiController.elements.select.value;

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
