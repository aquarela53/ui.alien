var UI = require('ui');

function MyComponent(options) {
	this.$super(options);
}

MyComponent.prototype = {
	build: function() {
		var view = new UI.View();					// same as view.add({component:'view'});
		view.add(new UI.HTML({html:this.options.msg || 'My Component!'}));	// same as view.add({component:'html',html:'something'});
		this.add(view);								// same as this.add({component:'view',items:[{component:'html',html:'something'}]});

		this.el.html(this.options.msg || 'My Component!');
	}
};

MyComponent.style = {
	'background': '#efefef'
};

module.exports = MyComponent = UI.inherit(MyComponent, UI.Attachable);
