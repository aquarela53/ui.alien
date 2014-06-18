var ui_list = require('./list.ui.json');
var router_list = require('./list.router.js');
var ui_view = require('./view.ui.json');

// class bbs
function BBS(bbsId) {
	console.log('bbs', bbsId);

	this.bbsId = bbsId;

	this.list();
}

BBS.prototype = {
	list: function(page) {
		this.ui(ui_list);

		this.routes(new router_list(this, this.bbsId));
	},
	view: function(articleId) {
		this.ui(ui_view);
	},
	remove: function(articleId) {
	}
};


module.exports = BBS;
