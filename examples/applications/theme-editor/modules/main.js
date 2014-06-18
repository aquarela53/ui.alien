var Appbus = require('attrs.ui');
var path = require('path');
var ajax = require('ajax');

function ThemeEditorFrame() {
	this.ui(require('frame.ui.json'));
	
	console.log('context', this.context());

	var root = this.one('editor-root');
	console.log('editor-root', root);
	console.log('name', root.name());
	root.name('editor-root2');
	console.log('one(editor-root)', this.one('editor-root'));
	console.log('one(editor-root2)', this.one('editor-root2'));
	console.log('one(editing-area)', this.one('editing-area'));
	console.log('get(tab)', this.get('tab'));
	console.log('all', this.all());

	
	var test = this.context('test');
	console.log('test context', test);
	console.log('test.get(tab)', test.get('tab'));
	console.log('testall', test.all());
}

module.exports = ThemeEditorFrame;
