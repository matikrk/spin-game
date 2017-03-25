const promiseDelay = time => () => new Promise(res => setTimeout(res, time));

export {
  promiseDelay,
};

