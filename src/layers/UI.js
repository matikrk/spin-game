import config from '../config';
import {setElementPosition} from '../helpers';

class UI {
  constructor() {
    const {width, height} = config.gameBoard;

    const container = document.createElement('div');
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.zIndex = 3;

    this.selectedValue = undefined;

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
    this.changeSelectedValue(this.selectImages[0].key);
  }

  createControlUI() {
    const select = document.createElement('div');
    setElementPosition(select, 'select');
    select.classList.add('game-board__select');
    this.prepareOptions(select);

    const scoreBoard = document.createElement('div');
    setElementPosition(scoreBoard, 'scoreBoard');

    const submit = document.createElement('div');
    submit.classList.add('game-board__btnSpin');
    setElementPosition(submit, 'submit');

    const elements = {select, scoreBoard, submit};
    Object.values(elements).forEach(element => this.container.appendChild(element));

    this.elements = elements;

    this.attachListeners();
  }

  prepareOptions(select) {
    this.selectImages.forEach(({key, image}) => {
      const option = document.createElement('button');
      option.classList.add('game-board__select-item');
      option.setAttribute('data-option-key', key);
      //   option.textContent = key;
      option.appendChild(image);
      option.addEventListener('click', () => this.changeSelectedValue(key));

      select.appendChild(option);
    });
  }

  changeSelectedValue(key) {
    [...this.elements.select.children].forEach(button => {
      if (button.getAttribute('data-option-key') === key) {
        button.classList.add('game-board__select-item--active');
      } else {
        button.classList.remove('game-board__select-item--active');
      }
    });
    this.selectedValue = key;
  }

  getSelectedValue() {
    return this.selectedValue;
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
    this.elements.scoreBoard.textContent = text;
  }

}
export default UI;
