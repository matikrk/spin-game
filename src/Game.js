class Game {
  constructor() {
    this.loadResources();
  }

  loadResources() {
    this.startLoading();

    const symbolsPath = '/rest/symbols.json';
    fetch(symbolsPath)
      .then(response => response.json())
      .then(data => this.prepareImages(data))
      .then(() => this.stopLoading());
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

}

export default Game;
