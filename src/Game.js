class Game {
  constructor() {
    this.loadResources();
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

    const select = document.getElementById('select');

    Object.keys(data).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.text = key;

      select.appendChild(option)
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

}

export default Game;
