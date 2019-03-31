const traverse = require('traverse');
const dirTree = require('directory-tree');

const tree = dirTree(
  './test/docs/',

  {
    extensions: /\.md$/
  },

  item =>
    (item.path = item.path
      .split('/')
      .slice(2)
      .join('/')),
  item =>
    (item.path = item.path
      .split('/')
      .slice(2)
      .join('/'))
);

const tocArray = [];

// traverse(tree.children[0]).map(item => tocArray.push(item));

// console.log(tree);

const getnodes = root =>
  root.map(node => {

    if (node.children) {

      getnodes(node.children);

    }

    tocArray.push(node.name);

  });

getnodes(tree.children);

console.log(tocArray);
