class Game {
  constructor() {
    this.getUIReferences();
    this.loadResources();
    this.attachListeners();
  }

  getUIReferences() {
    const $ = id => document.getElementById(id);

    this.elements = {
      select: $('select'),
      canvas: $('canvas'),
      results: $('results'),
      submit: $('submit'),
    };
  }

  loadResources() {
    this.startLoading();

    const symbolsPath = '/rest/symbols.json';

    fetch(symbolsPath)
      .then(response => response.json())
      .then(data => this.prepareOptions(data))
      .then(data => this.prepareImages(data))
      .then(() => this.stopLoading());
  }

  prepareOptions(data) {

    Object.keys(data).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.text = key;

      this.elements.select.appendChild(option)
    });

    return data;
  }

  prepareImages(data) {
    this.loadedImages = [];
    const imagesFetchers = Object.entries(data)
      .map(([name, url]) => this.prepareImage(name, url));

    return Promise.all(imagesFetchers)
  }

  prepareImage(name, url) {
    return new Promise(
      resolve => {
        const image = new Image();
        image.src = url;
        image.onload = function() {
          resolve();
        };

        this.loadedImages.push({name, image});
      }
    )
  }

  startLoading() {
    console.log('loading');
  }

  stopLoading() {
    console.log('stopLoading');
  }

  attachListeners() {
    this.elements.submit.addEventListener('click', this.onSubmit.bind(this))
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
    return new Promise(
      resolve => {
        this.onWait();
        const winnerIndex = Math.floor(Math.random() * this.loadedImages.length);
        const {image, name} = this.loadedImages[winnerIndex];

        setTimeout(() => resolve(name), 1000);

      }
    );
  }

  onWait() {
    this.elements.results.textContent = 'Wait for it :)'
  }

  onWin() {
    this.elements.results.textContent = 'Win'
  }

  onLoose() {
    this.elements.results.textContent = 'Loose'

  }

  updateScoreBoard(winnerName) {
    const selected = this.elements.select.value;

    if (winnerName === selected) {
      this.onWin();
    } else {
      this.onLoose();
    }
  }
}

export default Game;
