var UI = require('ui');

function GNB(options) {
	this.html(options.message || 'no message');
};

GNB.prototype = {
	build: function() {
		this.$super();
	},
	moveTo: function(link) {
		console.log('move to', link);
	}
};

module.exports = GNB;
