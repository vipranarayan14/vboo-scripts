const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const glob = require('glob');

const readAsync = promisify(readFile);
const writeAsync = promisify(writeFile);
const rimrafAsync = promisify(rimraf);
const mkdirpAsync = promisify(mkdirp);

const globAsync = src =>
  new Promise((resolve, reject) =>
    glob(src, (err, filepaths) => {

      if (err) {

        reject(err);

      }

      resolve(filepaths);

    })
  );

module.exports = {
  globAsync,
  mkdirpAsync,
  readAsync,
  rimrafAsync,
  writeAsync
};
