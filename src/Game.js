import CanvasController from './layers/CanvasController';
import BackgroundController from './layers/BackgroundController';
import UIController from './layers/UIController';
import LoaderController from './layers/LoaderController';

import {loadImagesToArray, promiseDelay} from './helpers';

class Game {
  constructor(gameContainer) {
    this.initializeInstanceVariables();
    this.createGameLayers(gameContainer);
    this.loadGame();
  }

  initializeInstanceVariables() {
    this.loadedImages = [];
    this.loadedStaticImages = [];
    this.layersControlers = {};
  }

  createGameLayers(gameContainer = document.body) {
    const gameBoard = document.createElement('div');
    gameBoard.classList.add('game-board');

    this.layersControlers = {
      mainController: new CanvasController(),
      uiController: new UIController(),
      loaderController: new LoaderController(),
      backgroundController: new BackgroundController(),
    };

    Object.values(this.layersControlers)
      .forEach(({domNode}) => {
        domNode.classList.add('game-board__layer');
        gameBoard.appendChild(domNode);
      });

    gameContainer.appendChild(gameBoard);
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
    this.layersControlers.backgroundController.render({
      images: this.loadedStaticImages,
    });
  }

  startLoading() {
    this.layersControlers.loaderController.render();
  }

  stopLoading() {
    this.layersControlers.loaderController.hide();
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
    this.layersControlers.uiController.render({
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

      this.layersControlers.mainController.spin(winner)
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
    this.layersControlers.mainController.render({images: this.loadedImages});
  }
}

export default Game;
