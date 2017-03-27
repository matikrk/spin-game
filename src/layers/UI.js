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


    const submit = document.createElement('div');
    submit.classList.add('game-board__btnSpin');
    setElementPosition(submit, 'submit');

    const elements = {select, submit};
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

  disableSelecting() {
    [...this.elements.select.children].forEach(button => {
      button.classList.add('game-board__select-item--disabled');
      button.disabled = true; //eslint-disable-line
    });
  }

  enableSelecting() {
    [...this.elements.select.children].forEach(button => {
      button.classList.remove('game-board__select-item--disabled');
      button.disabled = false; //eslint-disable-line
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
    this.elements.submit.addEventListener('click', () => this.onClickSpinButton());
  }

  onClickSpinButton() {
    if (this.spinnerDisabled) {
      return;
    }
    this.onSubmit();
  }

  disableButtons() {
    this.elements.submit.classList.add('game-board__btnSpin--disabled');
    this.spinnerDisabled = true;
    this.disableSelecting();
  }

  enableButtons() {
    this.elements.submit.classList.remove('game-board__btnSpin--disabled');
    this.spinnerDisabled = false;
    this.enableSelecting();
  }

}
export default UI;
