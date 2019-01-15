const customBlockRe = /^:::(.+?)\n(.+?)\n:::/;

const BlockTokenizer = function (eat, value, silent) {

  const now = eat.now();

  if (silent) {

    return true;

  }

  const match = customBlockRe.exec(value);

  if (match) {

    const blockName = match[1];
    const content = match[2];

    return eat(match[0])({
      children: this.tokenizeInline(content, now),
      data: {
        hName: 'div',
        hProperties: {
          className: `vboo-custom-blocks ${blockName}-block`,
        }
      },
      type: 'vbooCustomBlocks',
    });

  }

  return '';

};

const VbooCustomBlocks = function () {

  // Inject BlockTokenizer
  const blockTokenizers = this.Parser.prototype.blockTokenizers;
  const blockMethods = this.Parser.prototype.blockMethods;

  blockTokenizers.vbooCustomBlocks = BlockTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'vbooCustomBlocks');

};

module.exports = VbooCustomBlocks;
