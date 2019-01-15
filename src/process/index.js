const { getPaths } = require('./get-paths');
const { readFile } = require('../utils');
const { writeOutput } = require('./write-output');
const { processTransclusions } = require('./process-transclusions');
const { convertToHtml } = require('./convert-to-html');

const process = config => () =>

  new Promise((resolve, reject) =>

    getPaths(config).then(filePaths =>

      filePaths.forEach(filePath => readFile(filePath)
        .then(processTransclusions)
        .then(convertToHtml)
        .then(writeOutput(filePath, config))
        .then(resolve)
        .catch(err => reject(err))

      )

    )

  );

module.exports = { process };
