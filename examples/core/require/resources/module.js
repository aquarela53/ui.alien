"use strict"

console.log('window', window);
console.log('navigator', navigator);
console.log('document', document);
console.log('location', location);
console.log('Element', Element);
console.log('parent', parent);
console.log('global', global);

console.log('window', require('window'));
console.log('document', require('document'));
console.log('path', require('path'));
console.log('ajax', require('ajax'));
console.log('events', require('events'));

console.log('__dirname', __dirname);
console.log('__filename', __filename);

global.test = 'test';

var sub1 = require('./sub/submodule.js');
var sub2 = require('./sub/submodule.js');
var sub3 = require('./sub/submodule.js', true, true);
var sub4 = require('./sub/submodule.js');

module.exports = 'This is Module Exports (' + sub1 + '/' + sub2 + '/' + sub3 + '/' + sub4 + ')';
