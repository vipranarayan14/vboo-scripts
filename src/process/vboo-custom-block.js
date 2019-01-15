// const { log } = require('../utils');

const customBlockRe = /^:::(.+?)\n(.+?)\n:::/;

const locator = (value, fromIndex) => value.indexOf(':::', fromIndex);

const blockTokenizer = (eat, value) => {

  const match = customBlockRe.exec(value);

  if (match) {

    const blockName = match[1];
    const content = match[2];

    return eat(match[0])({
      data: {
        hChildren: [{
          type: 'text',
          value: content
        }],
        hName: 'div',
        hProperties: {
          className: `vboo-custom-block ${blockName}-block`,
        }
      },
      tagName: 'div',
      type: 'element',
      value: content
    });

  }

  return '';

};

const VbooCustomBlock = function () {

  blockTokenizer.locator = locator;

  // Inject blockTokenizer
  const blockTokenizers = this.Parser.prototype.blockTokenizers;
  const blockMethods = this.Parser.prototype.blockMethods;

  blockTokenizers.vbooCustomBlock = blockTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'vbooCustomBlock');

};

module.exports = VbooCustomBlock;
