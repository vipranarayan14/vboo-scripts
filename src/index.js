#!/usr/bin/env node

const { start } = require('./start');
const { log } = require('./utils');

const command = process.argv[2];

if (command === 'start') {

  start();

} else if (command === 'build') {

  process.env.NODE_ENV = 'production';
  start();

} else {

  log('Provide a valid command');

}
