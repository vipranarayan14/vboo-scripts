const {
  globAsync,
  mkdirpAsync,
  readAsync,
  rimrafAsync,
  writeAsync
} = require('./io');

const browserSync = require('browser-sync');
const MemoryFS = require('memory-fs');
const path = require('path');

const { log } = require('./log');
const { convertToHtml } = require('./markdown');
const { middleware } = require('./middleware');
const { addToSearchIndex, exportSearchIndex } = require('./search-index');

const mfs = new MemoryFS();
const bs = browserSync.create();

const process = (filepath, index) => file => {

  const MARKDOWN_EXT = '.md';
  const HTML_EXT = '.html';

  const isMarkdownFile = path.extname(filepath).toLowerCase() === MARKDOWN_EXT;

  let outputFile = file,
    outputFilePath = filepath;

  if (isMarkdownFile) {

    outputFilePath = filepath.replace(MARKDOWN_EXT, HTML_EXT);
    outputFile = convertToHtml(file);

  }

  return {
    outputFile,
    outputFilePath
  };

};

const build = (src, dest, write) => new Promise((resolve, reject) => {

  globAsync(src)
    .then(filepaths => {

      filepaths.forEach((filepath, index) => {

        const isLastFile = index === filepaths.length - 1;

        readAsync(filepath)
          .then(process(filepath))
          .then(write(src, dest))
          .then(() => {

            if (isLastFile) {

              resolve();

            }

          })
          .catch(err => reject(err));

      });

    })
    .catch(err => reject(err));

});

const watch = src => new Promise((resolve, reject) => {

  build(src, './', writeToMemory)
    .then(() =>

      bs.watch([src], { ignoreInitial: true }).on('all', (event, file) => {

        log(`${event.toUpperCase()}:`, path.resolve('/', file));

        build(src, './', writeToMemory)
          .then(() => bs.reload())
          .catch(err => reject(err));

      })

    )
    .then(resolve)
    .catch(err => reject(err));

});

const getWritePath = (filepath, src, destDir) => {

  const srcDir = src.replace('/**/*.*', '');

  const writeFilePath = filepath.replace(srcDir, destDir);
  const writePath = path.dirname(writeFilePath);

  return {
    writeFilePath,
    writeFilePathForMFS: path.resolve(writeFilePath.replace('./', '/')),
    writePath,
    writePathForMFS: path.resolve(writePath.replace('./', '/'))
  };

};

const writeToMemory = (src, dest) => ({ outputFile, outputFilePath }) => {

  const {
    writeFilePathForMFS,
    writePathForMFS
  } = getWritePath(outputFilePath, src, dest);

  mfs.mkdirpSync(writePathForMFS);

  log(`Creating dirs '${writePathForMFS}' in memory.`);

  mfs.writeFileSync(writeFilePathForMFS, outputFile, { encoding: 'binary' });

  log(`Writing file '${writeFilePathForMFS}' to memory.`);

};

const writeToFile = (src, dest) => ({ outputFile, outputFilePath }) =>

  new Promise((resolve, reject) => {

    const {
      writeFilePath,
      writePath
    } = getWritePath(outputFilePath, src, dest);

    mkdirpAsync(writePath)
      .then(() => writeAsync(writeFilePath, outputFile)
        .then(resolve)
        .catch(err => reject(err))
      )
      .catch(err => reject(err));

  });

const initServer = servePath => new Promise((resolve, reject) =>
  bs.init({
    middleware: middleware(servePath, mfs),
    server: servePath
  }, err => err ? reject(err) : resolve())
);

const dev = src => {

  initServer('/')
    .then(watch(src))
    .catch(err => log('error', err));

};

const prod = (src, dest) => {

  rimrafAsync(dest)
    .then(() => build(src, dest, writeToFile))
    .catch(err => log('error', err));

};

module.exports = {
  dev,
  prod
};
