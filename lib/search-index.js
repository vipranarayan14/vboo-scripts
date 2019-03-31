const { writeAsync } = require('./io');
const { log } = require('./log');

const Flexsearch = require('flexsearch');

const index = new Flexsearch();

const filepaths = [];

const addToSearchIndex = (id, filepath, file) => {

  index.add(id, file.toString());
  filepaths.push(filepath);

};

const exportSearchIndex = dest => {

  const searchIndex = `
const _FLEX_SEARCH_INDEX_ = '${index.export()}';
const _FILEPATHS_ = ${JSON.stringify(filepaths)};
`;

  writeAsync(`${dest}/flexsearch-index.js`, searchIndex).catch(err =>
    log('error', err)
  );

};

module.exports = {
  addToSearchIndex,
  exportSearchIndex
};
