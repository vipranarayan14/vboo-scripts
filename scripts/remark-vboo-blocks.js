const vbooBlocksRe = /^:::(.+?)\n(.+?)\n:::/;

const BlockTokenizer = function (eat, value, silent) {

  const now = eat.now();

  if (silent) {

    return true;

  }

  const match = vbooBlocksRe.exec(value);

  if (match) {

    const blockName = match[1];
    const content = match[2];

    return eat(match[0])({
      children: this.tokenizeInline(content, now),
      data: {
        hName: 'div',
        hProperties: {
          className: `vboo-blocks ${blockName}-block`,
        }
      },
      type: 'vbooBlocks',
    });

  }

  return '';

};

const VbooBlocks = function () {

  // Inject BlockTokenizer
  const blockTokenizers = this.Parser.prototype.blockTokenizers;
  const blockMethods = this.Parser.prototype.blockMethods;

  blockTokenizers.vbooBlocks = BlockTokenizer;
  blockMethods.splice(blockMethods.indexOf('fencedCode') + 1, 0, 'vbooBlocks');

};

module.exports = VbooBlocks;
