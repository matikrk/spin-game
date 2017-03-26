import {setElementPosition} from '../helpers';

class UIController {
  constructor({container, images, selectImages, onSubmit}) {
    this.onSubmit = onSubmit;
    this.images = images;
    this.selectImages = selectImages;
    this.container = container;
    this.createControlUI();
  }


  createControlUI() {
    const select = document.createElement('select');
    setElementPosition(select, 'select');
    this.prepareOptions(select);

    const results = document.createElement('div');
    results.style.color = '#fff';
    setElementPosition(results, 'results');

    const submit = document.createElement('button');
    setElementPosition(submit, 'submit');
    submit.textContent = 'spin';

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
    this.elements.submit.disabled = true;
    this.elements.select.disabled = true;
  }

  enableButtons() {
    this.elements.submit.disabled = false;
    this.elements.select.disabled = false;
  }

}
export default UIController;
