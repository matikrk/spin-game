function promiseDelay(time) {
  return () => new Promise(res => setTimeout(res, time));
}

function prepareImage(name, url) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve({name, image});
  });
}

function loadImagesToArray(paths, array) {
  const imagesFetchers = Object.entries(paths)
    .map(([name, url]) => prepareImage(name, url));

  return Promise.all(imagesFetchers)
    .then(images => array.push(...images));
}

/* eslint-disable */
export {
  promiseDelay,
  loadImagesToArray,
};
/* eslint-enable */

