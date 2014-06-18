var ui = {
	component: 'view',
	items: [
		{
			component: 'html',
			name: 'cmp',
			html: 'this component from another controller'
		}
	]
};

function AnotherController(options) {
	this.items(ui);
	this.add('ui3.ui.json');
	this.add({
		component: 'html',
		html: options.msg || 'empty message'
	});
}

AnotherController.prototype = {
	hello: function() {
		console.log('hello!!');
	}
};

module.exports = AnotherController;
