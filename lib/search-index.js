const Flexsearch = require('flexsearch');

const index = new Flexsearch();

const filepaths = [];

const addToSearchIndex = (id, filepath, file) => {

  const hasDocTitle = file.toString().match(/^#\s(.*?)\n/);
  const docTitle = hasDocTitle ? hasDocTitle[1] : '';

  index.add(id, file.toString());

  filepaths.push({ docTitle, filepath });

};

const exportSearchIndex = (write, dest) => {

  const searchIndexFile = `
const _FLEX_SEARCH_INDEX_ = '${index.export()}';
const _FILEPATHS_ = ${JSON.stringify(filepaths)};
`;

  write({
    outputFile: searchIndexFile,
    outputFilePath: `${dest}/flexsearch-index.js`
  });

};

module.exports = {
  addToSearchIndex,
  exportSearchIndex
};
