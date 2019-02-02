const visit = require('unist-util-visit');

const visitor = opts => (node, index, root) => {

  root.children[index] = {
    children: [node],
    data: {
      hName: 'div',
      hProperties: {
        className: `remark-wrapper remark-wrapper-${node.type} ${opts.classNames ? opts.classNames : ''}`,
      }
    },
    type: 'remarkWrapper'
  };

};

const remarkWrapper = opts => ast => {

  visit(ast, opts.nodeName, visitor(opts));

};

module.exports = remarkWrapper;
