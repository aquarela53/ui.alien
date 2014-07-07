// application controller
function TestApplication(options) {	
	this.$super(options);
}

TestApplication.prototype = {
	build: function() {
		this.icons({
			'64': 'url',
			'112': 'url',
			'512': 'url'
		}).splash({
			'480x640': 'url'
		}).theme('ios').page('guide', function(e) {
			this.find('#content').load('guide.html');
			this.find('side-navigation').load('./data/guide.ui.json');

			return false;
		}).component('test', 'components/test/TestComponent.js');
		
		this.$super();
	
		var ui = this.build('contents.html');
		this.items(ui);
	},
	method: function() {
		console.log('custom method');
	}
};

module.exports = TestApplication;
