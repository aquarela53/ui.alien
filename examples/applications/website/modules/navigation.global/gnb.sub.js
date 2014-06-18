function GNBSub(options) {
	console.log('gnb sub init', options);
	this.ui(require('gnb.sub.ui.json'));
}

GNBSub.prototype = {
};

module.exports = GNBSub;