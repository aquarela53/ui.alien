var $ = require('dom');

module.exports = function(cmp) {
	console.log('remote component handler called', cmp);
	
	cmp.add($.create('div').html('hello! module!'));
};