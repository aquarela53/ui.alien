var path = require('path');


console.log(path.join('http://a/b/c', 'http://a/b/c'));
console.log(path.join('/a/b/c', '/a/b/c'));
console.log(path.join('/a/b/c', 'd'));
console.log(path.join('/a/b/c', './d'));
console.log(path.join('/a/b/c', '../d'));