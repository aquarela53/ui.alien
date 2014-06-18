var list_router = function(bbs, bbsId) {
	this.bbsId = bbsId;
	this.bbs = bbs;
};

list_router.prototype  = {
	'cmp1.click': function(e) {
		console.log(this.bbsId + '컴포넌트 1 이 클릭되었음');
		this.bbs.view();
	},
	'cmp2.click': function(e) {
		console.log(this.bbsId + '컴포넌트 2 가 클릭되었음');
	}
};


module.exports = list_router;
