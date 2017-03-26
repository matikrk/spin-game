import config from '../config';
import {setElementPosition} from '../helpers';

class UI {
  constructor() {
    const {width, height} = config.gameBoard;

    const container = document.createElement('div');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.zIndex = 3;

    this.container = container;
  }

  get domNode() {
    return this.container;
  }

  render({images, selectImages, onSubmit}) {
    this.onSubmit = onSubmit;
    this.images = images;
    this.selectImages = selectImages;

    this.createControlUI();
  }

  createControlUI() {
    const select = document.createElement('select');
    setElementPosition(select, 'select');
    this.prepareOptions(select);

    const results = document.createElement('div');
    results.style.color = '#fff';
    setElementPosition(results, 'results');

    const submit = document.createElement('div');
    submit.classList.add('game-board__btnSpin');
    setElementPosition(submit, 'submit');

    const elements = {select, results, submit};
    Object.values(elements).forEach(element => this.container.appendChild(element));

    this.elements = elements;

    this.attachListeners();
  }

  prepareOptions(select) {
    this.selectImages.forEach(({key}) => {
      const option = document.createElement('option');
      option.value = key;
      option.text = key;

      select.appendChild(option);
    });
  }

  attachListeners() {
    this.elements.submit.addEventListener('click', this.onSubmit);
  }

  disableButtons() {
    this.elements.submit.classList.add('game-board__btnSpin--disabled');
    this.elements.select.disabled = true;
  }

  enableButtons() {
    this.elements.submit.classList.remove('game-board__btnSpin--disabled');
    this.elements.select.disabled = false;
  }

  changeResultText(text) {
    this.elements.results.textContent = text;
  }

}
export default UI;
