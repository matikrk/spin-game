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

/* eslint-disable */
export {
  promiseDelay,
  loadImagesToArray,
};
/* eslint-enable */

