#!/usr/bin/env node

const { prod, dev } = require('./build');

const src = process.argv[2];
const dest = process.argv[3];

const srcPattern = `${src}/**/*.*`;

if (dest) {

  prod(srcPattern, dest);

} else {

  dev(srcPattern);

}
