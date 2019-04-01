const Flexsearch = require('flexsearch');

const index = new Flexsearch();

const filelist = {};

const addToSearchIndex = (id, filepath, file, outputFile) => {

  const isDoc = filepath.match(/.*\/docs\/.*/);

  if (isDoc) {

    const hasDocTitle = outputFile.match(
      /<h1>(?:<.*?>)*(.*?)(?:<\/.*?>)*?<\/h1>/
    );
    const docTitle = hasDocTitle ? hasDocTitle[1] : '';

    index.add(id, file.toString());

    filelist[id] = { docTitle, filepath };

  }

};

const exportSearchIndex = (write, dest) => {

  const searchIndexFile = `
window.$FLEX_SEARCH_INDEX='${index.export()}';
window.$FILE_LIST=${JSON.stringify(filelist)};
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
