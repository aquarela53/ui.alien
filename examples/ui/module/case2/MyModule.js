var UI = require('ui');
var MyComponent = require('./MyComponent.js');
var AnotherModule = require('./AnotherModule.js');

// define controller (declare as object type is fine)
function MyModule(options) {	
	var context = this.context();
	context.component('mycmp', MyComponent);
	context.component('another', AnotherModule);
	context.component('another2', AnotherModule);

	// setup your default ui & routes
	this.items('ui1.ui.json');
	this.mark();
}

MyModule.prototype = {
	switchUI: function() {
		if( this.source() === 'ui1.ui.json' ) {
			this.items('ui2.ui.json');
		} else {
			this.items('ui1.ui.json');
		}
	},
	attachAnother: function() {
		this.add({
			component: 'another',
			msg: 'another!!'
		}).add({
			component: 'another2',
			msg: 'another2!!'
		});
	}
};

module.exports = MyModule;
