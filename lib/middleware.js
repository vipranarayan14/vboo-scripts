const mimeTypes = require('mime-types');
const url = require('url');
const path = require('path');

const { log } = require('./log');

const SUCCESS_CODE = 200;

const getMimeType = filepath => mimeTypes.lookup(filepath) || 'application/octet-stream';

const getFilePathFromUrl = (fileUrl, serveBasePath) => {

  let filepath = url.parse(fileUrl).pathname;

  if (filepath === '/') {

    filepath = '/index.html';
    filepath = path.posix.join('/', serveBasePath, filepath);

  }

  return filepath;

};

const middleware = (serveBasePath, mfs) => (request, response, next) => {

  const filepath = getFilePathFromUrl(request.url, serveBasePath);

  mfs.readFile(filepath, (error, data) => {

    if (error) {

      log('error', `File "${filepath}" not found in memory.`);

      if (next) {

        return next();

      }

      return response.end();

    }

    log(`Serving file "${filepath}" from memory.`);

    const mimeType = getMimeType(filepath);

    response.writeHead(SUCCESS_CODE, { 'Content-Type': mimeType });

    return response.end(data);

  });

};

module.exports = {
  middleware
};
