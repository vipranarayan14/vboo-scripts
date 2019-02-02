#!/usr/bin/env node

const { prod, dev } = require('./build');

const src = process.argv[2];
const dest = process.argv[3];

if (!src) {

  process.exit(0);

}

const srcPattern = `${src}/**/*.*`;

if (dest) {

  prod(srcPattern, dest);

} else {

  dev(srcPattern);

}
