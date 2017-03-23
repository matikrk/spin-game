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
    const selected = this.elements.select.value;

    this.spin(selected);
  }

  spin(selected) {
    return new Promise(
      resolve => {
        const winnerIndex = Math.floor(Math.random() * this.loadedImages.length);
        const winner = this.loadedImages[winnerIndex];


        if (winner.name === selected) {
          this.onWin();
        } else {
          this.onLoose();
        }

      }
    );
  }

  onWin() {
    this.elements.results.textContent = 'Win'
  }

  onLoose() {
    this.elements.results.textContent = 'Loose'

  }

}

export default Game;
