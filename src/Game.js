import MainLayer from './layers/Main';
import BackgroundLayer from './layers/Background';
import UILayer from './layers/UI';
import LoaderLayer from './layers/Loader';

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
  }

  createGameLayers(gameContainer = document.body) {
    const gameBoard = document.createElement('div');
    gameBoard.classList.add('game-board');

    this.layers = {
      main: new MainLayer(),
      ui: new UILayer(),
      loader: new LoaderLayer(),
      background: new BackgroundLayer(),
    };

    Object.values(this.layers)
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
    this.layers.background.render({
      images: this.loadedStaticImages,
    });
  }

  startLoading() {
    this.layers.loader.render();
  }

  stopLoading() {
    this.layers.loader.hide();
  }


  loadStaticResources() {
    const paths = {
      bg: '/img/bg.png',
      btnSpin: '/img/btnSpin.png',
      btnSpinD: '/img/btnSpinD.png',
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
    this.layers.ui.render({
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
    this.layers.ui.disableButtons();
  }

  enableButtons() {
    this.layers.ui.enableButtons();
  }

  spin() {
    return new Promise(resolve => {
      this.onWait();
      const winnerIndex = Math.floor(Math.random() * this.loadedImages.length);
      const winner = this.loadedImages[winnerIndex];

      this.layers.main.spin(winner)
        .then(() => resolve(winner.key));
    });
  }

  onWait() {
    this.layers.ui.changeResultText('Wait for it :)');
  }

  onWin() {
    this.layers.ui.changeResultText('Win');
  }

  onLoose() {
    this.layers.ui.changeResultText('Lose');
  }

  updateScoreBoard(winnerKey) {
    const selected = this.layers.ui.getSelectedValue();

    if (winnerKey === selected) {
      this.onWin();
    } else {
      this.onLoose();
    }
  }

  createMainLayer() {
    this.layers.main.render({images: this.loadedImages});
  }
}

export default Game;
