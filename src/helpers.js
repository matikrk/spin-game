import config from './config';

function promiseDelay(time) {
  return () => new Promise(res => setTimeout(res, time));
}

function prepareImage(key, url) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve({key, image});
  });
}

function loadImagesToArray(paths, array) {
  const imagesFetchers = Object.entries(paths)
    .map(([key, url]) => prepareImage(key, url));

  return Promise.all(imagesFetchers)
    .then(images => array.push(...images));
}


/* eslint-disable no-param-reassign*/
function setElementPosition(elem, key) {
  const {elementsPosition: {[key]: {x, y}}} = config;
  elem.style.position = 'absolute';
  elem.style.left = `${x}px`;
  elem.style.top = `${y}px`;
}
/* eslint-enable no-param-reassign*/

export {
  promiseDelay,
  loadImagesToArray,
  setElementPosition,
};

