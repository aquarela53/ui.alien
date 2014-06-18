var Appbus = require('attrs.ui');
var path = require('path');
var ajax = require('ajax');

function MainFrame() {
	this.ui(require('main.ui.json'));
}

module.exports = MainFrame;
