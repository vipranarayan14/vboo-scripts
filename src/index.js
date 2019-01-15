const { watchFiles } = require('./start');
const { log } = require('./utils');

const command = process.argv[2];

if (command === 'start') {

  watchFiles();

} else if (command === 'build') {

  process.env.NODE_ENV = 'production';
  watchFiles();

} else {

  log('Provide a valid command');

}
