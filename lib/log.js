const log = (type, ...args) =>

  (args) ? (type === 'error') ? console.error(...args) : console.log(type, ...args) : null; //eslint-disable-line no-console

module.exports = { log };
