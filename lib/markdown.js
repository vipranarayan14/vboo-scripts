const vtranslit = require('remark-vtranslit');
const vbooCustomBlocks = require('./remark-vboo-blocks');
const remarkWrapper = require('./remark-wrapper');
const remark = require('remark');
const html = require('remark-html');

const { vTranslitSchemeItrn } = require('vtranslit-scheme-itrn');
const { vTranslitSchemeDeva } = require('vtranslit-scheme-deva');

const convertToHtml = data => remark()
  .use(remarkWrapper, {
    nodeName: 'table'
  })
  .use(vtranslit, [
    vTranslitSchemeItrn,
    vTranslitSchemeDeva
  ])
  .use(vbooCustomBlocks)
  .use(html)
  .processSync(data)
  .toString();

module.exports = { convertToHtml };
